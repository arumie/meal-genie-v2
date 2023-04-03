import { pb } from "@meal-genie/lib/pocketbase";
import { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { ClientResponseError } from "pocketbase";
import { parseJson } from "../../../../lib/parseGptJson";

export type MealResult = {
  description: string;
  ingredients: string[];
  directions: string[];
};

export type DayResult = {
  day: string;
  meals: MealResult[];
};

export type PlanResult = {
  plan: DayResult[];
};

type Auth = {
  openaiToken: string;
  id: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.cookies["pb_auth"] == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const auth: Auth = JSON.parse(req.cookies["pb_auth"] ?? "{}").model;
  
  const { id } = req.query
  try {
    const recordId: string = (id instanceof Array ? id[0] : id) ?? '';
    const record = await pb.collection("mealplans").getOne(recordId);
    if (req.method === 'GET') {
      res.status(200).json(record.plan);
    } else {
      const result = await getPlan(
        record.context as ChatCompletionRequestMessage[],
        record.days,
        'gpt-4',
        auth
      );

      await pb.collection("mealplans").update(record.id, { plan: result });
      res.status(201).json(result);
    }
  } catch (e) {
    const error = e as ClientResponseError;
    res
      .status(error.status)
      .json({ message: `Unable to create meal plan`, error: e });
  }
}

async function getPlan(
  messages: ChatCompletionRequestMessage[],
  days: number,
  model: string,
  auth: Auth
) {
  const configuration = new Configuration({
    apiKey: auth.openaiToken,
  });
  const openai = new OpenAIApi(configuration);

  return await createGPTCompletion(
    messages,
    days,
    openai,
    model ?? "gpt-3.5-turbo"
  );
}

async function createGPTCompletion(
  messages: ChatCompletionRequestMessage[],
  days: number,
  openai: OpenAIApi,
  model: string
) {
  const promises = [];

  for (let i = 1; i <= days; i++) {
    const planMessages = messages.concat([
      {
        role: "user",
        content: `Give me steps by step directions for the meal(s) of day ${i}. Your response should be in JSON format {meals: {"description": string, "ingredients": {"name": string, "quantity": number, "unit": string}[], "directions": string[]}[]}. Values should be in danish.`,
      },
    ]);
    const dayData = openai
      .createChatCompletion(
        {
          model: model,
          messages: planMessages,
          temperature: 0.2,
          max_tokens: model === "gpt-4" ? 5000 : 2048, // The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
        },
        { timeout: 180000 }
      )
      .catch((error) => {
        console.log(error);
        return error;
      });
    promises.push(dayData);
  }

  const plan = await Promise.all(promises).then((values) => {
    return values.map((value, index) => {
      const json = parseJson(value.data.choices[0].message?.content);
      return {
        day: `Dag ${index + 1}`,
        ...json,
      };
    });
  });

  return {
    plan,
  };
}

export default handler;

import { NextApiRequest, NextApiResponse } from "next";
import {
  ChatCompletionRequestMessage,
  Configuration,
  CreateChatCompletionResponse,
  OpenAIApi,
} from "openai";
import {
  getMealPlanPrompt,
  MealPlanParams,
} from "../../../lib/generatePrompt";
import { pb } from "@meal-genie/lib/pocketbase";
import { ClientResponseError } from "pocketbase";

export type InitResult = {
  planStr: string;
  gptContent: CreateChatCompletionResponse[];
  messages: ChatCompletionRequestMessage[];
};

export type InitRequest = NextApiRequest & {
  body: MealPlanParams;
};

type Auth = {
  openaiToken: string;
  id: string;
};

async function handler(req: InitRequest, res: NextApiResponse) {
  if (req.cookies["pb_auth"] == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const auth: Auth = JSON.parse(req.cookies["pb_auth"] ?? "{}").model;

  await GetMealPlan(req, res, auth);
}

async function GetMealPlan(req: InitRequest, res: NextApiResponse, auth: Auth) {
  const body = req.body;
  console.log(body);

  const systemPrompt =
    "You are a kitchen chef. You describe recipes in great detail. You specify each ingredient individually. You only include the results in your answer.";
  console.log(systemPrompt);

  var customPrompt = getMealPlanPrompt(body);
  console.log(customPrompt);

  const configuration = new Configuration({
    apiKey: auth.openaiToken,
  });
  const openai = new OpenAIApi(configuration);

  const mealPlan = await createGPTCompletion(
    customPrompt,
    systemPrompt,
    openai,
    body.model ?? "gpt-3.5-turbo"
  );

  const data = {
    userId: auth.id,
    days: Number(body.days),
    context: mealPlan.messages,
    ingredients: null,
    plan: null,
  };

  try {
    const record = await pb.collection("mealplans").create(data);

    res.status(200).json({
      id: record.id,
      ...mealPlan,
    });
  } catch (e) {
    const error = e as ClientResponseError;
    res.status(error.status).json({ message: `Unable to create meal plan`, error: e })
  }
}

async function createGPTCompletion(
  customPrompt: string,
  systemPrompt: string,
  openai: OpenAIApi,
  model: string
): Promise<InitResult> {
  let messages: ChatCompletionRequestMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: customPrompt },
  ];
  const completions = [];
  const mealPlan = await openai.createChatCompletion({
    model: model,
    messages: messages,
    temperature: 1,
    max_tokens: model === "gpt-4" ? 6000 : 2048, // The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
  });

  completions.push(mealPlan.data);

  if (mealPlan.data.choices[0].message?.content != null) {
    const planStr = mealPlan.data.choices[0].message?.content;
    console.log(mealPlan.data.choices[0].message?.content);
    messages.push({
      role: "assistant",
      content: mealPlan.data.choices[0].message?.content,
    });

    return {
      planStr,
      gptContent: completions,
      messages,
    };
  }

  throw Error("Failed to create completion");
}

export default handler;

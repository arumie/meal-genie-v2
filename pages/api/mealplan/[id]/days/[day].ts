import { pb } from "@meal-genie/lib/pocketbase";
import { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { ClientResponseError } from "pocketbase";

const prompt = (day: number) =>
  `Change the meal(s) for day ${day} to something else.`;

type Auth = {
  openaiToken: string;
  id: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.cookies["pb_auth"] == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const auth: Auth = JSON.parse(req.cookies["pb_auth"] ?? "{}").model;

  const { id, day } = req.query;
  try {
    const recordId: string = (id instanceof Array ? id[0] : id) ?? "";
    const record = await pb.collection("mealplans").getOne(recordId);

    if (req.method !== "POST") {
      res.status(404);
    } else {
      const d = Number((day instanceof Array ? day[0] : day) ?? 0);
      const result = await updateDay(d, record.context, "gpt-4", auth);

      await pb.collection("mealplans").update(record.id, { context: result });
      res.status(200).json(result);
    }
  } catch (e) {
    const error = e as ClientResponseError;
    res
      .status(error.status)
      .json({ message: `Unable to create meal plan`, error: e });
  }
}

async function updateDay(
  day: number,
  messages: ChatCompletionRequestMessage[],
  model: string,
  auth: Auth
) {
  const configuration = new Configuration({
    apiKey: auth.openaiToken,
  });
  const openai = new OpenAIApi(configuration);

  return await createGPTCompletion(
    day,
    messages,
    openai,
    model ?? "gpt-3.5-turbo"
  );
}

async function createGPTCompletion(
  day: number,
  messages: ChatCompletionRequestMessage[],
  openai: OpenAIApi,
  model: string
): Promise<ChatCompletionRequestMessage[]> {
  let updateDayMessages = messages.concat([
    { role: "user", content: prompt(day) },
  ]);
  console.log(updateDayMessages);
  
  const data = await openai.createChatCompletion(
    {
      model: model,
      messages: updateDayMessages,
      temperature: 1,
      max_tokens: model === "gpt-4" ? 5000 : 2048, // The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
    },
    { timeout: 180000 }
  );

  const content = data.data.choices[0].message?.content;

  if (content != null) {
    console.log(content);
    return updateDayMessages.concat([
      {
        role: "assistant",
        content,
      },
    ]);
  }

  throw Error("Failed to create completion");
}

export default handler;

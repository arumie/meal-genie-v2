import { pb } from "@meal-genie/lib/pocketbase";
import { NextApiRequest, NextApiResponse } from "next";
import {
  ChatCompletionRequestMessage,
  Configuration,
  CreateChatCompletionResponse,
  OpenAIApi,
} from "openai";
import { ClientResponseError } from "pocketbase";
import { parseJson } from "../../../../lib/parseGptJson";

const promptGPT3Ingredients =
  'Summarize all the ingredients as one list with an entry for each ingredient. Your response should be in JSON format with three parameters "name", "quantity" and "unit" for each ingredient ex. [{"name": "Flour", "quantity":"1", "unit": "kg"}]. ';

export type IngredientsResult = {
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
  }[];
  gptContent: CreateChatCompletionResponse;
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
    const record = await pb.collection("mealplans").getOne(recordId, { '$autoCancel': false });

    if (record.ingredients != null) {
      res.status(200).json(record.ingredients);
    } else {
      const result = await getIngredients(record.context, "gpt-4", auth);

      await pb
        .collection("mealplans")
        .update(record.id, { ingredients: result });
      res.status(200).json(result);
    }
  } catch (e) {
    const error = e as ClientResponseError;    
    res
      .status(error?.status == null || error.status === 0 ? 500: error.status)
      .json({ message: `Unable to create meal plan`, error: e });
  }
}

async function getIngredients(
  messages: ChatCompletionRequestMessage[],
  model: string,
  auth: Auth
) {
  const configuration = new Configuration({
    apiKey: auth.openaiToken,
  });
  const openai = new OpenAIApi(configuration);

  return await createGPT35Completion(
    messages,
    openai,
    model ?? "gpt-3.5-turbo"
  );
}

async function createGPT35Completion(
  messages: ChatCompletionRequestMessage[],
  openai: OpenAIApi,
  model: string
): Promise<IngredientsResult> {
  let ingredientMessages = messages.concat([
    { role: "user", content: promptGPT3Ingredients },
  ]);
  const data = await openai.createChatCompletion(
    {
      model: model,
      messages: ingredientMessages,
      temperature: 0.2,
      max_tokens: model === "gpt-4" ? 5000 : 2048, // The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
    },
    { timeout: 180000 }
  );

  const ingredientsJson = data.data.choices[0].message?.content;

  if (ingredientsJson != null) {
    let ingredients = parseJson(ingredientsJson);
    if (ingredients.keys != null && ingredients.keys().length === 1) {
      ingredients = ingredients[ingredients.keys()[0]];
    }
    return ingredients;
  }

  throw Error("Failed to create completion");
}

export default handler;

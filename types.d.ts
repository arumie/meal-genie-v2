import {
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
} from "openai";

export interface PbUser {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
  openaiToken: string;
}

export interface PbIngredient { name: string; quantity: number; unit: string }

export interface PbPlan {
  day: "Dag 1";
  meals: {
    description: string;
    directions: string[];
    ingredients: PbIngredient[];
  }[];
}

export interface PbMealPlan {
  collectionId: string;
  collectionName: string;
  context: CreateChatCompletionRequest[];
  created: string;
  days: number;
  id: string;
  ingredients: PbIngredient[];
  name: string;
  plan: { plan: PbPlan[]; };
  updated: string;
  userId: string;
}

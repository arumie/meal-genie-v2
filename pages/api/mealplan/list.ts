import { pb } from "@meal-genie/lib/pocketbase";
import { NextApiRequest, NextApiResponse } from "next";
import { ClientResponseError } from "pocketbase";

type Auth = {
  openaiToken: string;
  id: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.cookies["pb_auth"] == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const auth: Auth = JSON.parse(req.cookies["pb_auth"] ?? "{}").model;

  if (req.method !== "GET") {
    res.status(404).json({ message: `Can only GET meal plans` });
  }

  try {
    const records = await pb.collection("mealplans").getFullList({
      sort: "-created",
      filter: `userId="${auth.id}"`,
    });

    res.status(200).json(records);

  } catch (e) {
    const error = e as ClientResponseError;
    res
      .status(error.status)
      .json({ message: `Unable to create meal plan`, error: e });
  }
}

export default handler;

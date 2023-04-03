import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";
import { pb } from "@meal-genie/lib/pocketbase";

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

  try {
    const { username, password } = req.body;
    console.log(username, password)
    await pb.collection("users").authWithPassword(username, password);
    console.log(pb.authStore);
    

    if (pb.authStore.isValid) {
      res.setHeader('set-cookie', pb.authStore.exportToCookie())
      res.status(200).json({ message: `Logged in successfully` })
    } else {
      res.status(400).json({ message: `Unable to login` })
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: `Unable to login` })
  }
}

export default handler;


import Cors from "cors"
import type { NextApiRequest, NextApiResponse } from "next";
import { pb } from "@meal-genie/lib/pocketbase";
import { ClientResponseError } from "pocketbase";

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
  methods: ["POST", "HEAD"],
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

  try {
    const { name, username, email, password, confirmPassword, openaiToken } = req.body;
    
    const data = {
      name,
      username,
      email,
      emailVisibility: true,
      password,
      passwordConfirm: confirmPassword,
      openaiToken
    }
    console.log(data);
    
    const result = await pb.collection('users').create(data)
    console.log(result);
    
    await pb.collection("users").authWithPassword(username, password);

    if (pb.authStore.isValid) {
      res.setHeader('set-cookie', pb.authStore.exportToCookie())
      res.status(200).json({ message: `Signed up successfully` })
    } else {
      res.status(400).json({ message: `Unable to sign up. Invalid input` })
    }
  } catch (e) {
    console.log(e)
    const error = e as ClientResponseError;
    res.status(error.status).json({ message: `Unable to sign up`, error: e })
  }
}

export default handler;

import { jsonrepair } from "jsonrepair";

export function parseJson(gptJsonStr: string): any {
  console.log(gptJsonStr);
  
  const jsonStr =
    gptJsonStr.split("```")[1] != null
      ? gptJsonStr.split("```")[1]
      : gptJsonStr;

  const repairedJsonStr = jsonrepair(jsonStr);

  const obj = JSON.parse(repairedJsonStr);
  return obj;
}

import { createOpenAI } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY || "",
  baseURL: "https://api.groq.com/openai/v1",
});

// system prompt for the ai, todo: add more detailed examples
const system = `Provide the correct solution(s) to the given problem using the 'must_use_for_solution' tool. If the question has a single correct answer, return that answer. If the question has multiple correct answers, return a list of correct answers. 
Example:
Which point of view does the narrator use in the passage?
My Aunt Helen was my favorite person in the whole world. She was my mom's sister. She got straight A's when she was a teenager, and she used to give me books to read. My father said that the books were a little too old for me, but I liked them, so he just shrugged and let me read.
a) first person
b) second person
c) third person
Correct response:
a) first person
`;

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();
  const model = groq("lama-3.1-405b-reasoning");
  const result = await generateText({
    model,
    temperature: 0.4,
    system,
    prompt,
    tools: {
      must_use_for_solution: tool({
        description: "Must be used to return the solution to the problem.",
        parameters: z.object({
          answers: z
            .array(z.string().describe("A correct answer"))
            .describe("List of correct answers"),
        }),
        execute: async ({ answers }) => answers,
      }),
    },
  });

  const tool_output = result.toolResults[0]?.result;
  const answers: string[] = tool_output ?? [result?.text]; // fallback to text if tool does not get called, this is a bug if it occurs

  return NextResponse.json(answers);
}

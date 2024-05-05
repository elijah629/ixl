import { createOpenAI } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import { z } from "zod";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY || "",
  baseURL: "https://api.groq.com/openai/v1",
});

const system = `Provide the correct solution(s) to the given problem using the 'must_use_for_solution' tool. If the question has a single correct answer, return that answer. If the question has multiple correct answers, return a list of correct answers. Please only return the letter of the answer. 
Example:
Which point of view does the narrator use in the passage?
My Aunt Helen was my favorite person in the whole world. She was my mom's sister. She got straight A's when she was a teenager, and she used to give me books to read. My father said that the books were a little too old for me, but I liked them, so he just shrugged and let me read.
a) first person
b) second person
c) third person
Correct response:
a
`;

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();
  const model = groq("llama3-70b-8192");
  const result = await generateText({
    model,
    temperature: 0.4,
    maxTokens: 10,
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

  const tools = result.toolResults;
  const answers: string[] = tools[0]?.result ?? [result?.text];

  return new Response(JSON.stringify(answers));
}

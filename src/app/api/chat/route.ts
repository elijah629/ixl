import { createOpenAI } from '@ai-sdk/openai'
import { generateText, tool } from 'ai'
import { z } from "zod";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY || "",
  baseURL: "https://api.groq.com/openai/v1",
})

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json()
  const model = groq("llama3-70b-8192");
  const result = await generateText({
		model,
		temperature: 0.4,
		system: `Please provide only the correct solution to the given problem using the "must_use_for_solution" tool. If the question requires a single answer, return that answer. If the question requires multiple answers, return a list of correct answers.`,
		prompt,
		tools: {
			must_use_for_solution: tool({
				description: "Must be used to return the solution to the problem.",
			    parameters: z.object({
				     answers: z.array(z.string().describe("A correct answer")).describe("List of correct answers")
    			}),
				execute: async ({ answers }) => answers
			}),
		}
  })
  
  const tools = result.toolResults;
  const answers: string[] = tools[0]?.result ?? [result?.text];

  return new Response(JSON.stringify(answers));
}

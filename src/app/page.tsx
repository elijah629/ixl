"use client";

import { useCompletion } from 'ai/react'

const loader = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-spin">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>


export default function Page() {
  const { completion, isLoading, complete, error } = useCompletion({
    api: '/api/chat', "streamMode": "text"
  })

  return <>
	  <main className="flex justify-center items-center">
		<button className="px-4 py-2 border-black dark:border-white border-4 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors text-2xl rounded-xl" onClick={async () => {
			complete(await navigator.clipboard.readText());
		}}>{error ? <span className="text-red-500">{error.message}</span> : isLoading ? loader() : completion === "" ? "Solve" : <>{(JSON.parse(completion) as string[]).map((x, i) => <span key={i} className="font-bold">{x}</span>)}</>}</button>
	  </main>
  </>
}

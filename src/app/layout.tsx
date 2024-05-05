import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const jbm = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IXL AI",
};

const bookmarklet = `const n=Array.from(document.querySelector(".ixl-practice-crate").children[1].children).map(n=>n.innerText);n[0]+="\n",n[n.length-1]=n[n.length-1].split("\n").map((n,e)=>"abcdefghijklmnopqrstuvwxyz"[e]+") "+n).join("\n"),await navigator.clipboard.writeText(n.join("\n"))`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(jbm.className, "bg-white dark:bg-black", "text-black dark:text-white", "flex", "flex-col")}>
		<header>
			<nav className="border-b-black dark:border-b-white border-b-[1px] min-h-12 flex items-center px-4 gap-2">
				<span className="font-bold">IXL AI</span>
				<a href={`javascript:!async function(){${bookmarklet}}()`} className="rounded-md bg-black dark:bg-white text-white dark:text-black p-1" title="Drag into bookmarks bar to install, if you do not see a bookmarks bar you may need to enable it">Bookmarklet</a>
			</nav>
		</header>
		<main className="flex-1">
			{children}
		</main>
	</body>
    </html>
  );
}

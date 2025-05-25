import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism  } from "react-syntax-highlighter/dist/esm/styles/prism";
import confetti from "canvas-confetti";
import { useTheme } from "next-themes";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeBlockWithCopy({
  children,
  language,
}: {
  children: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);
  const {theme} = useTheme();

  const handleCopy = async (e: React.MouseEvent) => {
    await navigator.clipboard.writeText(children);
    setCopied(true);

    // Firework effect at button position
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    confetti({
      particleCount: 20,
      spread: 30,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: [theme==="dark" ? "#ffffff" : "#364153"],
      startVelocity: 8,
      scalar: 0.1,
      gravity: 0.5,
    });

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative my-4">
      <button
        onClick={handleCopy}
        className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium transition cursor-pointer ${theme==="dark" ? "bg-neutral-700 text-neutral-100 hover:text-neutral-200" : "bg-neutral-200 text-neutral-500 hover:text-neutral-400"}`}
        aria-label="Copy code"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <SyntaxHighlighter
        style={theme==="dark" ? atomDark : prism}
        language={language}
        PreTag="div"
        customStyle={{ paddingTop: 32, borderRadius: 10 }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}


export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        code: ({ inline, className, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
          const match = /language-(\w+)/.exec(className || "");
          if (!inline && match) {
            return (
              <CodeBlockWithCopy language={match[1]}>
                {String(children).replace(/\n$/, "")}
              </CodeBlockWithCopy>
            );
          }
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

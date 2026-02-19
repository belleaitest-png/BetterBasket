"use client";

import { Message } from "@/lib/store";
import clsx from "clsx";

interface Props {
  message: Message;
}

// Very lightweight markdown renderer — bold, italic, bullet lists
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <li key={i} className="ml-4">
          {formatInline(line.slice(2))}
        </li>
      );
    } else if (line.trim() === "") {
      elements.push(<br key={i} />);
    } else {
      elements.push(<p key={i}>{formatInline(line)}</p>);
    }
  });

  return <div className="prose text-sm space-y-0.5">{elements}</div>;
}

function formatInline(text: string): React.ReactNode {
  // Handle **bold** and _italic_
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("_") && part.endsWith("_")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx(
        "flex",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center
                        text-white text-xs font-bold shrink-0 mr-2 mt-1">
          B
        </div>
      )}
      <div
        className={clsx(
          "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-green-600 text-white rounded-tr-sm"
            : "bg-white border border-stone-100 text-stone-800 rounded-tl-sm shadow-sm"
        )}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          renderMarkdown(message.content)
        )}
      </div>
    </div>
  );
}

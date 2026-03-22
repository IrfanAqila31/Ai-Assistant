import ReactMarkdown from "react-markdown";

import "katex/dist/katex.min.css";

type MessageBubbleProps = {
  message: string;
  isUser?: boolean;
};

const MessageBubble = (Props: MessageBubbleProps) => {
  return (
    <>
      <div
        className={`flex ${Props.isUser ? "justify-end" : "justify-start"} mb-4 fade-in`}
      >
        <div
          className={`max-w-[75%] sm:max-w-md rounded-lg px-4 py-2 text-sm prose prose-invert break-words
        ${Props.isUser ? "bg-indigo-600 text-white" : "bg-zinc-800 text-white"}`}
        >
          <ReactMarkdown
            components={{

              pre: ({ children }) => (
                <pre className="overflow-x-auto max-w-full bg-zinc-900 p-3 rounded-lg mt-2 mb-2">
                  {children}
                </pre>
              ),
              code: ({ children }) => (
                <code className="break-words">{children}</code>
              ),
              p: ({ children }) => <p className="break-words">{children}</p>,
            }}
          >
            {Props.message}
          </ReactMarkdown>
        </div>
      </div>
    </>
  );
};
export default MessageBubble;

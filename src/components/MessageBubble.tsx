import ReactMarkdown from "react-markdown";
import { Sparkles } from "lucide-react";
import "katex/dist/katex.min.css";

type MessageBubbleProps = {
  message: string;
  isUser?: boolean;
};

const MessageBubble = ({ message, isUser }: MessageBubbleProps) => {
  return (
    <div
      className={`flex items-end gap-3 ${isUser ? "justify-end" : "justify-start"} mb-6 fade-in`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/10 shrink-0 mb-1">
          <Sparkles size={16} className="text-indigo-400" />
        </div>
      )}
      
      <div
        className={`max-w-[85%] sm:max-w-xl rounded-2xl px-4 py-3 text-sm prose prose-invert wrap-break-word shadow-sm
        ${isUser 
          ? "user-bubble text-white rounded-br-none" 
          : "ai-bubble text-zinc-100 rounded-bl-none"}`}
      >
        <ReactMarkdown
          components={{
            pre: ({ children }) => (
              <pre className="overflow-x-auto max-w-full bg-black/40 p-4 rounded-xl mt-3 mb-3 border border-white/5 font-mono text-xs">
                {children}
              </pre>
            ),
            code: ({ children }) => (
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-[13px]">{children}</code>
            ),
            p: ({ children }) => <p className="leading-relaxed mb-0">{children}</p>,
            ul: ({ children }) => <ul className="list-disc ml-4 space-y-1 my-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal ml-4 space-y-1 my-2">{children}</ol>,
          }}
        >
          {message}
        </ReactMarkdown>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-bold shrink-0 mb-1">
          ME
        </div>
      )}
    </div>
  );
};

export default MessageBubble;

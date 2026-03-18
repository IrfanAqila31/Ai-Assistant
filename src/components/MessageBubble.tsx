import ReactMarkdown from "react-markdown";

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
          <ReactMarkdown>{Props.message}</ReactMarkdown>
        </div>
      </div>
    </>
  );
};
export default MessageBubble;

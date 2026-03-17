type MessageBubbleProps = {
  message: string;
  isUser?: boolean;
};

const MessageBubble = (Props: MessageBubbleProps) => {
  return (
    <>
      <div
        className={`flex ${Props.isUser ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`max-w-xs rounded-xl px-4 py-2 text-sm 
        ${Props.isUser ? "bg-blue-600" : "bg-zinc-800"}`}
        >
          {Props.message}
        </div>
      </div>
    </>
  );
};
export default MessageBubble;

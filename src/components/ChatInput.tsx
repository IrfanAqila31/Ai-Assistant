import { useState } from "react";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
};

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };
  return (
    <div className="flex flex-wrap px-4 gap-4 max-w-3xl mx-auto">
      <textarea
        placeholder="Type your message ..."
        className="flex-1 bg-zinc-800 text-white rounded-xl px-4 py-2 outline-none"
        value={input}
        rows={1}
        onKeyDown={handleKeyDown}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleSend}
        className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
      >
        Send
      </button>
    </div>
  );
};
export default ChatInput;

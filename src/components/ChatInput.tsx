import { useState, useRef } from "react";
import { Send, Paperclip } from "lucide-react";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
};

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "70px";
      textareaRef.current.scrollTop = 0;
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2">
      <div className="relative glass border border-white/10 p-2 rounded-2xl shadow-xl flex items-end gap-2 group focus-within:border-indigo-500/50 transition-all duration-300">
        <button className="p-2.5 text-zinc-500 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all h-[42px] w-[42px] flex items-center justify-center">
          <Paperclip size={20} />
        </button>

        <textarea
          ref={textareaRef}
          placeholder="Tanyakan sesuatu pada Lumina..."
          className="flex-1 bg-transparent text-white rounded-xl px-2 py-2.5 outline-none custom-scrollbar resize-none text-[15px] max-h-[200px] leading-relaxed"
          value={input}
          rows={1}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`h-[42px] w-[42px] flex items-center justify-center rounded-xl transition-all duration-300 shadow-lg 
            ${
              input.trim()
                ? "bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/25 active:scale-95"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
        >
          <Send
            size={18}
            fill={input.trim() ? "currentColor" : "none"}
            strokeWidth={2.5}
          />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

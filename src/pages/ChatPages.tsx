import { useState, useRef, useEffect } from "react";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";

type Message = {
  role: "ai" | "user";
  content: string;
};
const ChatPages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hello! How can I help you",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);
  const handleSendMessage = (text: string) => {
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(newMessages);
    setIsTyping(true);

    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: "ai",
          content: "This is a demo AI response 🤖",
        },
      ]);
      setIsTyping(false);
    }, 2000);
  };
  return (
    <>
      <div className="flex flex-col h-screen bg-zinc-900 text-white">
        {/* Header */}
        <header className="border-b border-zinc-800 p-4 text-xl font-semibold">
          Irfan AI
        </header>

        {/* Chat Area */}
        <main className="flex-1 p-4 overflow-y-auto px-4 custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            {messages.map((msg, index) => (
              <MessageBubble
                key={index}
                message={msg.content}
                isUser={msg.role === "user"}
              />
            ))}
            {isTyping && <MessageBubble message="AI is Typing..." />}
            <div ref={chatEndRef}></div>
          </div>
        </main>

        {/* Input Area */}
        <footer className="border-t border-zinc-800 p-4">
          <ChatInput onSendMessage={handleSendMessage} />
        </footer>
      </div>
    </>
  );
};
export default ChatPages;

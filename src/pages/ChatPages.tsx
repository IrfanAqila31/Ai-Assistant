import { useState, useRef, useEffect } from "react";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";
import { sendMessageToAI } from "../lib/openrouter";

type Message = {
  role: "ai" | "user";
  content: string;
};
const ChatPages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Haloo👋, Apakah ada yang bisa saya bantu?😁",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);
  const handleSendMessage = async (text: string) => {
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(newMessages);
    setIsTyping(true);

    try {
      const aiResponse = await sendMessageToAI(text);

      setMessages([
        ...newMessages,
        {
          role: "ai",
          content: aiResponse,
        },
      ]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages([
        ...newMessages,
        {
          role: "ai",
          content: "Error mengambil respon AI 😢",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
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
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-zinc-800 px-2 py-2 rounded-xl flex gap-1">
                  <span className="w-1 h-1 bg-white rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-white rounded-full animate-bounce delay-150"></span>
                  <span className="w-1 h-1 bg-white rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>
        </main>

        {/* Input Area */}
        <footer className="border-t border-zinc-800 p-4 sticky bottom-0 bg-zinc-900">
          <ChatInput onSendMessage={handleSendMessage} />
        </footer>
      </div>
    </>
  );
};
export default ChatPages;

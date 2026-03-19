import { useState, useRef, useEffect } from "react";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";
import { sendMessageToAI } from "../lib/openrouter";

type Message = {
  role: "ai" | "user";
  content: string;
};

type Chat = {
  id: string;
  title: string;
  message: Message[];
};

const ChatPages = () => {
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem("chats");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            title: "New Chat",
            message: [
              {
                role: "ai",
                content: "Halo! Apakah ada yang bisa saya bantu? 😁",
              },
            ],
          },
        ];
  });

  const [activeChatId, setActiveChatId] = useState(chats[0].id);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Ambil chat aktif
  const activeChat = chats.find((c) => c.id === activeChatId);

  // Scroll otomatis
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.message, isTyping]);

  // Simpan di localstorage
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  // Kirim pesan
  const handleSendMessage = async (text: string) => {
    if (!activeChat) return;

    const newMessages: Message[] = [
      ...activeChat.message,
      { role: "user", content: text },
    ];

    // Update chat aktif
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId ? { ...chat, message: newMessages } : chat,
      ),
    );

    setIsTyping(true);

    try {
      const aiResponse = await sendMessageToAI(text);

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                message: [...newMessages, { role: "ai", content: aiResponse }],
              }
            : chat,
        ),
      );
    } catch (error) {
      console.error("Gemini Error:", error);
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                message: [
                  ...newMessages,
                  { role: "ai", content: "Error mengambil respon AI 😢" },
                ],
              }
            : chat,
        ),
      );
    } finally {
      setIsTyping(false);
    }
  };

  // Tambah chat baru
  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      message: [
        { role: "ai", content: "Halo! Apakah ada yang bisa saya bantu? 😁" },
      ],
    };
    setChats((prev) => [...prev, newChat]);
    setActiveChatId(newChat.id);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 p-4 text-xl font-semibold flex justify-between items-center">
        <span>Irfan AI</span>
        <button
          className="bg-zinc-800 px-3 py-1 rounded hover:bg-zinc-700"
          onClick={handleNewChat}
        >
          + New Chat
        </button>
      </header>

      {/* Tabs Chat */}
      <div className="flex border-b border-zinc-800 overflow-x-auto">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => setActiveChatId(chat.id)}
            className={`px-4 py-2 whitespace-nowrap ${
              chat.id === activeChatId ? "bg-zinc-700" : "bg-zinc-800"
            }`}
          >
            {chat.title}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <main className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          {activeChat?.message.map((msg, index) => (
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
  );
};

export default ChatPages;

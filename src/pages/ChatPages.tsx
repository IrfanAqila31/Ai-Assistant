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
  messages: Message[];
};

const ChatPages = () => {
  // 🔥 STATE
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem("chats");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            title: "New Chat",
            messages: [
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const activeChat = chats.find((chat) => chat.id === activeChatId) || chats[0];

  const safeMessages = activeChat?.messages || [];

  // auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safeMessages, isTyping]);

  // 🔥 SIMPAN LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  // menggupdate chatt
  const updateChatMessages = (messages: Message[]) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId ? { ...chat, messages } : chat,
      ),
    );
  };

  // agar ai typing..
  const typeMessage = async (
    fullText: string,
    callback: (text: string) => void,
  ) => {
    let current = "";

    for (let i = 0; i < fullText.length; i++) {
      current += fullText[i];
      callback(current);
      // kecepatan ketik
      await new Promise((resolve) => setTimeout(resolve, 8));
    }
  };

  // mengirim pesan
  const handleSendMessage = async (text: string) => {
    const newMessages: Message[] = [
      ...safeMessages,
      { role: "user", content: text },
    ];

    // auto diganti judul di sidebar
    if (activeChat.title === "New Chat") {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, title: text.slice(0, 25) }
            : chat,
        ),
      );
    }

    updateChatMessages(newMessages);
    setIsTyping(true);

    try {
      const aiResponse = await sendMessageToAI(text);

      // 1. tampilkan bubble kosong dulu
      updateChatMessages([...newMessages, { role: "ai", content: "" }]);

      // 2. animasi mengetik
      await typeMessage(aiResponse, (text) => {
        updateChatMessages([...newMessages, { role: "ai", content: text }]);
      });
    } catch {
      updateChatMessages([...newMessages, { role: "ai", content: "Error 😢" }]);
    } finally {
      setIsTyping(false);
    }
  };

  // 🔥 chatt baru
  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [
        {
          role: "ai",
          content: "Halo! Apakah ada yang bisa saya bantu? 😁",
        },
      ],
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setIsSidebarOpen(false);
  };

  // hapus chatt
  const handleDeleteChat = (id: string) => {
    setChats((prev) => {
      const updated = prev.filter((chat) => chat.id !== id);

      if (id === activeChatId) {
        setActiveChatId(updated[0]?.id || "");
      }

      return updated;
    });
  };

  return (
    <div className="flex h-[100dvh] bg-zinc-900 text-white">
      {/* OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col z-50 transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* HEADER */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-slate-300">Lumina AI</h1>
          <button
            className="md:hidden cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* NEW CHAT */}
        <div className="p-2">
          <button
            onClick={handleNewChat}
            className="w-full bg-indigo-600 py-2 rounded hover:bg-indigo-700"
          >
            + New Chat
          </button>
        </div>

        {/* LIST CHAT */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex justify-between items-center p-3 cursor-pointer text-sm border-b border-zinc-800 text-slate-200
              ${chat.id === activeChatId ? "bg-zinc-800" : "hover:bg-zinc-800"}`}
            >
              <span
                onClick={() => {
                  setActiveChatId(chat.id);
                  setIsSidebarOpen(false);
                }}
              >
                {chat.title}
              </span>

              <button
                onClick={() => handleDeleteChat(chat.id)}
                className="text-zinc-500 hover:text-zinc-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">
        {/* 🔥 HAMBURGER HEADER */}
        <div className="p-4 border-b border-zinc-800 flex items-center">
          <button
            className="md:hidden text-xl mr-3 cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>

          <h1 className="text-lg font-semibold ml-3 text-slate-300">Lumina AI</h1>
        </div>

        {/* CHAT */}
        <main className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            {safeMessages.map((msg, index) => (
              <MessageBubble
                key={index}
                message={msg.content}
                isUser={msg.role === "user"}
              />
            ))}

            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-zinc-800 px-3 py-2 rounded-xl flex gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>
        </main>

        {/* INPUT */}
        <footer className="border-t border-zinc-800 p-4 bg-zinc-900">
          <ChatInput onSendMessage={handleSendMessage} />
        </footer>
      </div>
    </div>
  );
};

export default ChatPages;

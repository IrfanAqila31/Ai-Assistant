import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Trash2,
  Menu,
  X,
  MessageSquare,
  Sparkles,
  Sidebar as SidebarIcon,
} from "lucide-react";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";
import { sendMessageToAI } from "../lib/openrouter";
import { Link } from "react-router";
import { Wand2 } from "lucide-react";


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
  // STATE
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem("chats");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            title: "New Chat",
            messages: [],
          },
        ];
  });

  const [activeChatId, setActiveChatId] = useState(chats[0].id);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const activeChat = chats.find((chat) => chat.id === activeChatId) || chats[0] || null;
  const safeMessages = activeChat?.messages || [];
  const isNewChat = safeMessages.length === 0;

  // auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safeMessages, isTyping]);

  // 🔥 SIMPAN LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const updateChatMessages = (messages: Message[]) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId ? { ...chat, messages } : chat,
      ),
    );
  };

  const typeMessage = async (
    fullText: string,
    callback: (text: string) => void,
  ) => {
    let current = "";
    for (let i = 0; i < fullText.length; i++) {
      current += fullText[i];
      callback(current);
      await new Promise((resolve) => setTimeout(resolve, 8));
    }
  };

  const handleSendMessage = async (text: string) => {
    const newMessages: Message[] = [
      ...safeMessages,
      { role: "user", content: text },
    ];

    if (activeChat?.title === "New Chat") {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, title: text.slice(0, 30) }
            : chat,
        ),
      );
    }

    updateChatMessages(newMessages);
    setIsTyping(true);

    try {
      const aiResponse = await sendMessageToAI(text);
      updateChatMessages([...newMessages, { role: "ai", content: "" }]);
      await typeMessage(aiResponse, (text) => {
        updateChatMessages([...newMessages, { role: "ai", content: text }]);
      });
    } catch {
      updateChatMessages([
        ...newMessages,
        {
          role: "ai",
          content: "Maaf, terjadi kesalahan. Silakan coba lagi nanti. 😢",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setIsSidebarOpen(false);
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    setChats((prev) => {
      const updated = prev.filter((chat) => chat.id !== id);
      
      // JIKA KOSONG, BUAT BARU OTOMATIS (ANTI-KOSONG)
      if (updated.length === 0) {
        const newChat: Chat = {
          id: Date.now().toString(),
          title: "New Chat",
          messages: [],
        };
        setActiveChatId(newChat.id);
        return [newChat];
      }

      // PINDAH KE CHAT LAIN JIKA YANG DIHAPUS ADALAH ACTIVE CHAT
      if (id === activeChatId) {
        // Cari index chat yang baru saja dihapus
        const deletedIndex = prev.findIndex(c => c.id === id);
        // Pilih tetangga terdekat (sebelumnya atau sesudahnya)
        const nextChat = updated[deletedIndex] || updated[deletedIndex - 1] || updated[0];
        setActiveChatId(nextChat.id);
      }
      
      return updated;
    });
  };

  return (
    <div className="flex h-[100dvh] bg-[#09090b] text-white font-sans selection:bg-indigo-500/30">
      {/* OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-72 bg-[#111113] border-r border-white/5 flex flex-col z-50 transform transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* HEADER */}
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold heading-font tracking-tight gradient-text">
              Lumina AI
            </h1>
          </div>
          <button
            className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} className="text-zinc-400" />
          </button>
        </div>

        {/* NEW CHAT */}
        <div className="px-4 mb-4">
          <button
            onClick={handleNewChat}
            className="w-full group flex items-center justify-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98]"
          >
            <Plus
              size={18}
              className="text-indigo-400 group-hover:text-indigo-300"
            />
            <span className="text-sm font-medium text-zinc-200">New Chat</span>
          </button>
        </div>

        {/* LIST CHAT */}
        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar space-y-1">
          <div className="px-3 mb-2">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Recent Conversations
            </p>
          </div>
          
          {/* TOOLS LINK */}
          <Link
            to="/generator"
            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all duration-200 mb-2"
          >
            <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
              <Wand2 size={14} className="text-indigo-400" />
            </div>
            <span className="flex-1 text-sm text-zinc-400 group-hover:text-white font-medium">
              Content Generator
            </span>
          </Link>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setActiveChatId(chat.id);
                setIsSidebarOpen(false);
              }}
              className={`group flex items-center gap-3 p-3 cursor-pointer rounded-xl transition-all duration-200
              ${chat.id === activeChatId ? "bg-white/5 border border-white/5 shadow-inner" : "hover:bg-white/[0.03] border border-transparent"}`}
            >
              <MessageSquare
                size={16}
                className={
                  chat.id === activeChatId ? "text-indigo-400" : "text-zinc-500"
                }
              />
              <span
                className={`flex-1 text-sm truncate ${chat.id === activeChatId ? "text-white font-medium" : "text-zinc-400"}`}
              >
                {chat.title}
              </span>

              <button
                onClick={(e) => handleDeleteChat(e, chat.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-400 text-zinc-500 rounded-lg transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* FOOTER SIDEBAR */}
        <div className="p-4 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-bold">
              User
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Guest User</p>
              <p className="text-[10px] text-zinc-500">Free Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* HEADER */}
        <header className="h-16 glass sticky top-0 z-30 flex items-center px-4 md:px-6 justify-between border-b border-white/5">
          <div className="flex items-center">
            <button
              className="md:hidden p-2 -ml-2 mr-2 hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="md:hidden flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-400" />
              <h1 className="text-lg font-bold tracking-tight">Lumina</h1>
            </div>
            <button
              className="hidden md:flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <SidebarIcon size={18} />
              <span className="text-sm font-medium">Dashboard</span>
            </button>
            <div className="hidden md:flex items-center gap-2 text-zinc-400">
              <span className="text-zinc-600 ml-2">/</span>
              <span className="text-sm font-medium text-white truncate max-w-[200px]">
                {activeChat?.title || "No Active Chat"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-semibold hover:bg-indigo-500/20 transition-colors border border-indigo-500/20">
              <Sparkles size={12} />
              Upgrade Pro
            </button>
          </div>
        </header>

        {/* CHAT BOX */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-4xl mx-auto px-4 h-full">
            {isNewChat ? (
              /* HERO LANDING PAGE */
              <div className="h-full flex flex-col items-center justify-center text-center fade-in pb-20">
                <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center mb-8 border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                  <Sparkles size={40} className="text-indigo-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-font tracking-tight gradient-text">
                  How can I help you today?
                </h2>
                <p className="text-zinc-500 max-w-sm mb-10 text-sm md:text-base leading-relaxed">
                  Experience the power of Lumina AI. Ask me anything from coding
                  to creative writing.
                </p>
                <div className="w-full max-w-2xl px-4">
                  <ChatInput onSendMessage={handleSendMessage} />
                </div>
              </div>
            ) : (
              /* ACTIVE CHAT HISTORY */
              <div className="py-8 md:py-12">
                <div className="space-y-6">
                  {safeMessages.map((msg, index) => (
                    <MessageBubble
                      key={index}
                      message={msg.content}
                      isUser={msg.role === "user"}
                    />
                  ))}

                  {isTyping && (
                    <div className="flex justify-start items-end gap-3 fade-in">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/10 flex-shrink-0">
                        <Sparkles size={16} className="text-indigo-400" />
                      </div>
                      <div className="ai-bubble px-4 py-3 rounded-2xl flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={chatEndRef} className="h-4 mt-4"></div>
              </div>
            )}
          </div>
        </main>

        {/* FOOTER INPUT (Only visible in active chat) */}
        {!isNewChat && (
          <footer className="p-4 md:p-6 bg-linear-to-t from-[#09090b] via-[#09090b] to-transparent sticky bottom-0">
            <ChatInput onSendMessage={handleSendMessage} />
            <p className="text-center text-[10px] text-zinc-500 mt-4">
              Lumina AI can make mistakes. Check important info.
            </p>
          </footer>
        )}

      </div>
    </div>
  );
};

export default ChatPages;

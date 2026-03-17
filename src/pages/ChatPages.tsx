import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";

const ChatPages = () => {
  return (
    <>
      <div className="flex flex-col h-screen bg-zinc-900 text-white">
        {/* Header */}
        <header className="border-b border-zinc-800 p-4 text-xl font-semibold">
          Irfan AI
        </header>

        {/* Chat Area */}
        <main className="flex-1 p-4 overflow-y-auto">
          <MessageBubble message="Hello!  How can i help you?" />
          <MessageBubble message="What is React?" isUser />
          <MessageBubble message="React is a JavaScript library for building UI." />
        </main>

        {/* Input Area */}
        <footer className="border-t border-zinc-800 p-4">
          <ChatInput />
        </footer>
      </div>
    </>
  );
};
export default ChatPages;

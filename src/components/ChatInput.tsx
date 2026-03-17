import { useState } from "react";
const ChatInput = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    console.log(message);
    setMessage("");
  };
  return (
    <div className="flex gap-4">
      <input
        type="text"
        placeholder="Type your message ..."
        className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 hover:bg-blue-700 px-44 py-2 rounded-lg"
      >
        Send
      </button>
    </div>
  );
};
export default ChatInput;

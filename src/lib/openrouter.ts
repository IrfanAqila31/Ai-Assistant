export const sendMessageToAI = async (message: string) => {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat", 
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  });

  const data = await res.json();

  return data.choices?.[0]?.message?.content || "No response content from AI.";
};

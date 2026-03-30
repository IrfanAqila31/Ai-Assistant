export const sendMessageToAI = async (
  message: string,
  onChunk?: (chunk: string) => void
) => {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat",
      stream: !!onChunk, // Aktifkan stream jika callback tersedia
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  });

  if (!onChunk) {
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "No response content from AI.";
  }

  // LOGIKA STREAMING
  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  let fullContent = "";

  if (!reader) return "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const jsonStr = line.replace("data: ", "");
        if (jsonStr === "[DONE]") break;

        try {
          const data = JSON.parse(jsonStr);
          const content = data.choices?.[0]?.delta?.content || "";
          if (content) {
            fullContent += content;
            onChunk(content);
          }
        } catch {
          // Abaikan error parsing parsial
        }
      }
    }
  }

  return fullContent;
};

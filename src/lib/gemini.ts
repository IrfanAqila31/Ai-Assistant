import { GoogleGenerativeAI } from "@google/generative-ai";

// Mengambil API Key dari Environment Variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY tidak ditemukan di environment variables!");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const sendMessageToAI = async (
  message: string,
  onChunk?: (chunk: string) => void,
) => {
  try {
    // Inisialisasi model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // tidak membutuhkan streaming
    if (!onChunk) {
      const result = await model.generateContent(message);
      return result.response.text();
    }

    // membutuhkan streaming (mengetik otomatis / realtime)
    const result = await model.generateContentStream(message);

    // Fungsi untuk membuat jeda/delay
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    let fullResponse = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();

      // Mengeluarkan komponen teks satu per satu untuk efek "mengetik" yang halus
      for (let i = 0; i < chunkText.length; i++) {
        fullResponse += chunkText[i];
        onChunk(chunkText[i]);

        // Browser memperlambat/menghentikan `setTimeout` saat tab ditutup atau pindah aplikasi.
        // Solusinya: Hapus efek ketik saat window disembunyikan agar teks langsung selesai di latar belakang.
        if (typeof document !== "undefined" && !document.hidden) {
          await delay(2); // Kecepatan ketikan
        }
      }
    }

    return fullResponse;
  } catch (error) {
    console.error("Terjadi kesalahan saat memanggil Gemini API:", error);
    throw error;
  }
};

import { useState } from "react";
import { Link } from "react-router";
import { 
  ArrowLeft, 
  Sparkles, 
  Wand2, 
  Copy, 
  Loader2, 
  FileText, 
  Share2, 
  Mail, 
  Clapperboard, 
  PenTool, 
  Rocket 
} from "lucide-react";
import { sendMessageToAI } from "../lib/gemini";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

const Generator = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const suggestions = [
    { label: "Blog Post", prompt: "Tuliskan draf artikel blog menarik tentang [Topik Anda]", icon: FileText },
    { label: "Social Media", prompt: "Buatlah caption Instagram yang menarik untuk konten [Konteks Konten]", icon: Share2 },
    { label: "Email Bisnis", prompt: "Tuliskan email penawaran profesional untuk klien mengenai [Produk/Jasa]", icon: Mail },
    { label: "Script Video", prompt: "Buatlah naskah video pendek (60 detik) untuk promosi [Produk/Brand]", icon: Clapperboard },
  ];

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success("Konten berhasil disalin ke clipboard!");
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.warning("Silahkan masukkan topik atau prompt terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setOutput(""); // Reset output saat mulai streaming
    try {
      const systemInstruction =
        "Anda adalah Lumina AI Content Generator. Buatlah konten yang rapi, profesional, dan informatif. Gunakan pemformatan Markdown (seperti Bold, List, atau Heading) untuk struktur yang jelas, namun pastikan hasil akhirnya elegan.";

      const prompt = `${systemInstruction}\n\nTopik Utama: ${input}`;

      await sendMessageToAI(prompt, (chunk) => {
        setOutput((prev) => prev + chunk);
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Terjadi kesalahan koneksi saat membuat konten.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-indigo-500/30 flex flex-col">
      {/* HEADER */}
      <header className="h-16 glass sticky top-0 z-30 flex items-center px-4 md:px-6 justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
            title="Back to Chat"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold heading-font tracking-tight gradient-text">
              Lumina AI
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Content Generator
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
          {/* HERO SECTION */}
          <div className="text-center mb-12 fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
              <Rocket size={12} />
              <span>Premium AI Content Engine</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 heading-font tracking-tight text-white">
              Create <span className="gradient-text">Stunning</span> Content
            </h2>
            <p className="text-zinc-500 text-sm md:text-base max-w-lg mx-auto mb-10 leading-relaxed">
              Transform your ideas into professional articles, social media posts, 
              business emails, or viral scripts in seconds.
            </p>

            {/* CATEGORY GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
              {[
                { icon: FileText, label: "Articles" },
                { icon: Share2, label: "Social" },
                { icon: Mail, label: "Business" },
                { icon: PenTool, label: "Creative" },
              ].map((item, idx) => (
                <div key={idx} className="glass p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 group hover:border-indigo-500/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                    <item.icon size={20} />
                  </div>
                  <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* INPUT AREA */}
          <div className="w-full max-w-2xl glass p-5 md:p-6 rounded-3xl border border-white/10 shadow-2xl scale-in mb-6 flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute left-4 top-[18px] text-zinc-500">
                <Wand2 size={20} />
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Apa yang ingin Anda tulis hari ini? (Contoh: Buatkan artikel blog tentang masa depan internet...)"
                rows={3}
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none text-white focus:border-indigo-500/30 text-sm  focus:bg-white/[0.08] transition-all resize-none custom-scrollbar"
              />
            </div>
            
            <div className="flex justify-end w-full">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !input.trim()}
                className="px-8 py-3 bg-linear-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:-translate-y-0 transition-all min-w-[160px] flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="group-hover:animate-pulse" />
                    <span>Generate Content</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SUGGESTION CHIPS */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 fade-in">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setInput(s.prompt)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-zinc-500 hover:text-white hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-pointer"
              >
                <s.icon size={12} />
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* OUTPUT AREA */}
          {output && (
            <div className="w-full fade-in [animation-delay:0.2s]">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Generated Result
                </h3>
              </div>

              <div className="w-full ai-bubble p-8 rounded-3xl relative group border border-white/5 shadow-2xl transition-all hover:border-white/10">
                <button
                  onClick={handleCopy}
                  className="absolute top-6 right-6 px-3 py-1.5 glass hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 opacity-0 group-hover:opacity-100 border border-white/10 cursor-pointer"
                  title="Copy to clipboard"
                >
                  <Copy size={14} />
                  <span>Copy text</span>
                </button>
                {/* format respon ai */}
                <div className="text-zinc-300 leading-relaxed pr-8 prose-custom">
                  <ReactMarkdown
                    components={{
                      h1: ({ ...props }) => (
                        <h1
                          className="text-2xl font-bold mb-6 heading-font text-white border-b border-white/5 pb-2"
                          {...props}
                        />
                      ),
                      h2: ({ ...props }) => (
                        <h2
                          className="text-xl font-bold mt-10 mb-4 heading-font text-zinc-100"
                          {...props}
                        />
                      ),
                      h3: ({ ...props }) => (
                        <h3
                          className="text-lg font-bold mt-8 mb-3 heading-font text-zinc-200"
                          {...props}
                        />
                      ),
                      p: ({ ...props }) => (
                        <p
                          className="mb-6 last:mb-0 text-sm md:text-base"
                          {...props}
                        />
                      ),
                      ul: ({ ...props }) => (
                        <ul
                          className="list-disc pl-6 mb-6 space-y-3"
                          {...props}
                        />
                      ),
                      ol: ({ ...props }) => (
                        <ol
                          className="list-decimal pl-6 mb-6 space-y-3"
                          {...props}
                        />
                      ),
                      li: ({ ...props }) => (
                        <li className="text-zinc-400" {...props} />
                      ),
                      strong: ({ ...props }) => (
                        <strong className="font-medium text-zinc-200" {...props} />
                      ),
                      blockquote: ({ ...props }) => (
                        <blockquote
                          className="border-l-4 border-white/20 pl-4 py-1 my-6 text-zinc-400 italic bg-white/2 rounded-r-lg"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {output}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="p-6 text-center border-t border-white/5 bg-[#09090b]">
        <p className="text-[10px] text-zinc-600 font-medium tracking-widest">
          Powered by Lumina AI • Developed by Irfan Aqila Utama
        </p>
      </footer>
    </div>
  );
};

export default Generator;

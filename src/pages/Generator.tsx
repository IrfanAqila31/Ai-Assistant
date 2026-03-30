import { useState } from "react";
import { sendMessageToAI } from "../lib/openrouter";
import ReactMarkdown from "react-markdown";
import { Copy, Check, Sparkles, Wand2, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

const Generator = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      setOutput("Silahkan masukkan Topik terlebih dahulu");
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
      setOutput("Terjadi kesalahan saat membuat konten.");
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
              <Wand2 size={12} />
              AI Magic at your fingertips
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 heading-font tracking-tight">
              Create <span className="gradient-text">Stunning</span> Content
            </h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto">
              Transform your ideas into professional articles, blog posts, or
              social media content in seconds.
            </p>
          </div>

          {/* INPUT AREA */}
          <div className="w-full glass rounded-3xl p-2 mb-8 fade-in [animation-delay:0.1s] shadow-2xl shadow-indigo-500/5">
            <div className="relative">
              <textarea
                className="w-full bg-transparent p-6 min-h-[160px] text-zinc-200 placeholder:text-zinc-600 focus:outline-hidden resize-none text-base md:text-lg"
                placeholder="What would you like to generate today? (e.g. A blog post about future of AI)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate Content
                    </>
                  )}
                </button>
              </div>
            </div>
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
                  className="absolute top-6 right-6 px-3 py-1.5 glass hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 opacity-0 group-hover:opacity-100 border border-white/10"
                  title="Copy to clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                    </>
                  )}
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
        <p className="text-[10px] text-zinc-600 font-medium tracking-widest uppercase">
          Powered by Lumina AI • Premium Content Engine
        </p>
      </footer>
    </div>
  );
};

export default Generator;

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Bot, Mic, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

function useSpeechRecognition(onResult: (text: string) => void) {
  const [listening, setListening] = React.useState(false);
  const recRef = React.useRef<{
    start: () => void;
    stop: () => void;
    lang: string;
    onresult: ((e: unknown) => void) | null;
    onend: (() => void) | null;
  } | null>(null);

  const supported =
    typeof window !== "undefined" &&
    ((window as unknown as Record<string, unknown>).SpeechRecognition != null ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition != null);

  React.useEffect(() => {
    if (!supported) return;
    const w = window as unknown as Record<string, unknown>;
    const Ctor = (w.SpeechRecognition ??
      w.webkitSpeechRecognition) as unknown as new () => {
      start: () => void;
      stop: () => void;
      lang: string;
      onresult: ((e: unknown) => void) | null;
      onend: (() => void) | null;
    };
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.onresult = (e: unknown) => {
      const results = (e as { results: ArrayLike<ArrayLike<{ transcript: string }>> }).results;
      const text = Array.from(results)
        .map((r) => r[0].transcript)
        .join("");
      onResult(text);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    return () => {
      rec.onresult = null;
      rec.onend = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const rec = recRef.current;
    if (!rec) {
      toast.error("Voice input is not supported in this browser.");
      return;
    }
    if (listening) {
      rec.stop();
      setListening(false);
    } else {
      setListening(true);
      rec.start();
    }
  };

  return { toggle, listening, supported };
}

export function AiChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Sama Assistant. I can help you book an appointment, learn about our services, or answer recovery questions. How can I help?",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const onSpeech = React.useCallback((text: string) => setInput(text), []);
  const { toggle, listening, supported } = useSpeechRecognition(onSpeech);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || loading) return;
    const next: Message[] = [...messages, { role: "user", content: value }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json()) as { reply: string };
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, I couldn't reach the assistant. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        aria-label="Open AI assistant"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 end-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand to-accent text-white shadow-lift transition-transform hover:scale-110"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="b" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
              <Bot className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="glass-strong fixed bottom-24 end-5 z-50 flex h-[480px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl shadow-lift"
          >
            <div className="flex items-center gap-3 border-b border-border/40 bg-gradient-to-r from-brand to-accent p-4 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <p className="flex items-center gap-1.5 font-semibold">
                  Sama Assistant
                  <Sparkles className="h-3.5 w-3.5" />
                </p>
                <p className="text-xs text-white/70">AI-powered • replies instantly</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                    m.role === "assistant"
                      ? "rounded-ss-sm bg-muted/70"
                      : "ms-auto rounded-se-sm bg-primary text-white"
                  )}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="flex gap-1.5 rounded-2xl rounded-ss-sm bg-muted/70 px-4 py-3 w-fit">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.9, delay: d * 0.15 }}
                      className="h-2 w-2 rounded-full bg-muted-foreground/50"
                    />
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
              className="flex items-center gap-2 border-t border-border/40 p-3"
            >
              {supported && (
                <button
                  type="button"
                  onClick={toggle}
                  aria-label="Voice input"
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                    listening
                      ? "animate-pulse bg-red-500/15 text-red-500"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Mic className="h-5 w-5" />
                </button>
              )}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about services, bookings…"
                className="h-10 flex-1 rounded-xl border border-border/50 bg-background/60 px-3 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-opacity disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

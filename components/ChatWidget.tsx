"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const { user, isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    { id: "proximo", text: "¿Cuándo jugamos?", query: "¿Cuándo jugamos?" },
    { id: "asistencias", text: "¿Cuántos partidos fui?", query: "¿Cuántos partidos fui a ver?" },
    { id: "goleador", text: "¿Goleador histórico?", query: "¿Quién es el goleador histórico del club?" },
    { id: "clasico", text: "¿Clásico rival?", query: "¿Quién es nuestro clásico rival?" },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Inicializar mensaje de bienvenida cuando se abre el chat por primera vez
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `¡Hola, loco! ¿Cómo andás? Pasá, ponete cómodo acá en el vestuario de la Villa. 
          
Soy tu DT de confianza y estoy acá para analizar tu fidelidad con el Tricolor, debatir sobre tácticas, gritar los goles o palpitar el próximo partido. ¿De qué querés hablar hoy? ⚽🟢⚫⚪`,
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll al final con cada mensaje nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Ocultar si no está autenticado
  if (!isSignedIn) return null;

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    const assistantMessageId = crypto.randomUUID();
    const newAssistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, newAssistantMessage]);

    try {
      const apiMessages = updatedMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error("Fallo al conectar con el servidor.");
      }

      const data = await response.json();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: data.text }
            : msg
        )
      );
    } catch (error) {
      console.error("Chat fetch error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content:
                  "¡Che, loco! Se me cortó la señal del vestuario. Esperate un minuto y volvé a mandarme el mensaje, dale.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const handleSuggestionClick = async (id: string, query: string) => {
    if (isLoading) return;
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    await sendMessage(query);
  };

  return (
    <>
      {/* Estilos locales autocontenidos para la animación suave */}
      <style>{`
        @keyframes slideUpWidget {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up-widget {
          animation: slideUpWidget 0.25s ease-out forwards;
        }
      `}</style>

      {/* Botón Flotante y Globo Informativo */}
      <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 flex items-center gap-2">
        {/* Globo explicativo que aclara qué es el botón */}
        {!isOpen && (
          <div className="bg-[#1d211e]/95 backdrop-blur-sm border border-[#2d6a4f]/30 px-3 py-1.5 rounded-[8px] text-[9px] font-black text-zinc-300 tracking-wider shadow-lg animate-pulse whitespace-nowrap font-sans">
            {"💬 DT INTELIGENTE"}
          </div>
        )}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center shadow-2xl border transition-all duration-300 group cursor-pointer relative ${
            isOpen 
              ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-850 text-white" 
              : "bg-[#2d6a4f] border-[#377e5e] hover:bg-[#347a5b] text-white hover:scale-105 active:scale-95"
          }`}
          title="Hablar con el DT Inteligente"
        >
          {isOpen ? (
            <span className="text-sm font-bold font-sans">{"✕"}</span>
          ) : (
            <>
              <span className="text-xl sm:text-2xl transition-transform duration-300 group-hover:rotate-12">👔</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Ventana de Chat Flotante Pop-up (Fullscreen en móvil para evitar bugs de teclado, flotante en desktop) */}
      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-24 z-[60] w-full h-full md:w-96 md:h-[500px] flex flex-col bg-[#111412] md:border md:border-zinc-850 md:rounded-[16px] md:shadow-2xl overflow-hidden font-sans animate-slide-up-widget">
          {/* Cabezal del Widget (Con padding superior en móvil para liberar el notch) */}
          <div className="pt-10 md:pt-3.5 pb-3.5 px-4 border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative h-8 w-8 rounded-full border border-[#2d6a4f]/30 bg-[#1d211e] flex items-center justify-center overflow-hidden flex-shrink-0">
                <span className="text-base">👔</span>
              </div>
              <div>
                <h1 className="text-xs font-extrabold text-white tracking-wider uppercase leading-none flex items-center gap-1">
                  {"DT Inteligente"}
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                </h1>
                <p className="text-[7.5px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                  {"Táctica y Mística Tricolor"}
                </p>
              </div>
            </div>
            
            {/* Cerrar */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-white transition-colors p-1.5 hover:bg-zinc-900 rounded-[6px] cursor-pointer flex items-center justify-center"
              title="Cerrar chat"
            >
              <span className="text-[10px] font-bold font-sans">{"✕"}</span>
            </button>
          </div>

          {/* Historial de Mensajes */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#111412] scrollbar-thin"
          >
            {messages.map((message) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}
                >
                  <div
                    className={`max-w-[85%] rounded-[12px] p-3 text-xs leading-relaxed shadow-lg ${
                      isUser
                        ? "bg-[#2d6a4f] text-white border border-[#377e5e] rounded-tr-none font-medium"
                        : "bg-[#1d211e] text-zinc-200 border border-zinc-850 rounded-tl-none"
                    }`}
                  >
                    <span className="block text-[7.5px] font-black uppercase tracking-wider mb-1 text-zinc-400/80">
                      {isUser ? (user?.firstName || "Vos") : "DT Inteligente"}
                    </span>
                    <p className="whitespace-pre-line font-sans">{message.content}</p>
                  </div>
                </div>
              );
            })}
            {isLoading && messages[messages.length - 1]?.content === "" && (
              <div className="flex justify-start w-full">
                <div className="bg-[#1d211e] text-zinc-555 border border-zinc-850 rounded-[12px] rounded-tl-none p-3 text-xs italic tracking-wide animate-pulse">
                  {"DT Inteligente está escribiendo..."}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sugerencias de Preguntas */}
          {suggestions.length > 0 && (
            <div className="px-3 py-2 flex gap-1.5 overflow-x-auto scrollbar-none flex-nowrap whitespace-nowrap bg-zinc-950/20 border-t border-zinc-900/30 flex-shrink-0">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSuggestionClick(s.id, s.query)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-full border border-zinc-850 bg-[#1b1e1c] hover:bg-[#252a26] text-[8.5px] font-bold text-zinc-450 hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 active:scale-95"
                >
                  {s.text}
                </button>
              ))}
            </div>
          )}

          {/* Entrada de Chat (Con padding inferior en móvil para liberar barra de gestos de iOS/Android) */}
          <div className="p-3 pb-6 md:pb-3 bg-zinc-950/50 border-t border-zinc-900 flex-shrink-0">
            <form 
              onSubmit={handleSubmit}
              className="bg-[#1d211e] border border-zinc-850 p-1.5 rounded-[10px] flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Preguntale al DT..."
                className="flex-1 bg-transparent px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-3 rounded-[6px] bg-[#2d6a4f] hover:bg-[#2d6a4f]/90 active:scale-95 transition-all text-[10px] font-bold text-white uppercase tracking-wider flex items-center justify-center disabled:bg-zinc-800 disabled:text-zinc-650 cursor-pointer"
              >
                {"Enviar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setHasMounted(true); }, []);
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!hasMounted) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })) }),
      });

      if (!res.ok) throw new Error('Network error');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // Vercel AI SDK SSE format: lines starting with "0:" contain text
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('0:"')) {
              const parsed = JSON.parse(line.slice(2));
              assistantText += parsed;
              setMessages((prev) =>
                prev.map((m) => m.id === assistantId ? { ...m, content: assistantText } : m)
              );
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content: '申し訳ございません。現在お繋ぎできません。お電話（0800-888-8788）にてお問い合わせください。' }]);
    } finally {
      setIsLoading(false);
    }
  }

  const quickQuestions = [
    '本日の空席はありますか？',
    '本日の出勤キャストを教えてください',
    '予約の流れを教えてください',
  ];

  return (
    <>
      {/* フローティングボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#171717] hover:bg-gold text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="AIコンシェルジュ"
      >
        <MessageSquare size={22} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full animate-pulse text-[9px] text-black font-bold flex items-center justify-center">AI</span>
      </button>

      {/* チャットパネル */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm bg-white shadow-2xl rounded-sm border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
        style={{ height: '520px' }}
      >
        {/* Header */}
        <div className="bg-[#171717] px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
              <Sparkles size={14} className="text-gold" />
            </div>
            <div>
              <p className="text-white text-sm font-bold tracking-widest">Animo コンシェルジュ</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span className="text-white/50 text-[10px]">AIがリアルタイムでご案内</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors p-1">
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
          {messages.length === 0 && (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 bg-[#171717] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={11} className="text-gold" />
                </div>
                <div className="bg-white border border-gray-100 rounded-sm rounded-tl-none px-3 py-2 text-xs text-gray-700 max-w-[85%] shadow-sm leading-relaxed">
                  いらっしゃいませ。CLUB Animo コンシェルジュでございます。<br />
                  ご予約・空席状況・キャストに関するご質問など、お気軽にお申し付けください。
                </div>
              </div>
              <div className="space-y-2 pl-9">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="block w-full text-left text-[11px] text-gold border border-gold/30 hover:bg-gold/5 px-2.5 py-1.5 rounded-sm transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`flex items-start gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                m.role === 'user' ? 'bg-gray-200 text-gray-500' : 'bg-[#171717]'
              }`}>
                {m.role === 'user' ? '客' : <Sparkles size={11} className="text-gold" />}
              </div>
              <div className={`px-3 py-2 text-xs leading-relaxed shadow-sm max-w-[85%] ${
                m.role === 'user'
                  ? 'bg-[#171717] text-white rounded-sm rounded-tr-none'
                  : 'bg-white border border-gray-100 text-gray-700 rounded-sm rounded-tl-none'
              }`}>
                {m.content}
                {m.role === 'assistant' && m.content.includes('予約') && (
                  <Link href="/reserve" className="flex items-center gap-1 mt-2 text-gold text-[10px] font-bold border-t border-gray-100 pt-1.5">
                    <ExternalLink size={10} /> 予約ページはこちら
                  </Link>
                )}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#171717] rounded-full flex items-center justify-center">
                <Sparkles size={11} className="text-gold" />
              </div>
              <div className="bg-white border border-gray-100 rounded-sm px-3 py-2">
                <Loader2 size={12} className="animate-spin text-gray-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 bg-white shrink-0 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ご質問をどうぞ..."
            className="flex-1 text-xs border border-gray-200 rounded-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-9 h-9 bg-[#171717] hover:bg-gold text-white rounded-sm flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </form>
      </div>
    </>
  );
}

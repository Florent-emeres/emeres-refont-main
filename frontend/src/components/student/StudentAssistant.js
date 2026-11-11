import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { X, Send, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TypingDots = () => (
  <div className="flex items-center gap-1 px-1 py-2" aria-label="Émé est en train d'écrire">
    {[0, 150, 300].map((delay) => (
      <span
        key={delay}
        className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
        style={{ animationDelay: `${delay}ms` }}
      />
    ))}
  </div>
);

const StudentAssistant = ({ onNavigate }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [actions, setActions] = useState([]);
  const scrollRef = useRef(null);
  const greeted = useRef(false);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, []);

  const ask = useCallback(
    async (question) => {
      if (loading) return;
      setLoading(true);
      if (question) {
        setMessages((prev) => [...prev, { role: 'user', content: question }]);
      }
      setSuggestions([]);
      setActions([]);
      scrollToBottom();
      try {
        const { data } = await axios.post(`${API}/student/assistant`, { question });
        setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
        setSuggestions(data.suggestions || []);
        setActions(data.actions || []);
      } catch (e) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              "Oups, je n'ai pas réussi à répondre. Réessaie dans un instant — ou explore les sections du menu à gauche.",
          },
        ]);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    },
    [loading, scrollToBottom]
  );

  const openPanel = useCallback(() => {
    setOpen(true);
    if (!greeted.current) {
      greeted.current = true;
      ask('');
    }
  }, [ask]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    ask(q);
  };

  const handleAction = (action) => {
    setOpen(false);
    if (onNavigate && action?.path) {
      onNavigate(action.path);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={openPanel}
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-emeres-lg transition-transform duration-200 hover:scale-105 active:scale-95"
          aria-label="Ouvrir l'assistant Émé"
        >
          <Sparkles className="h-6 w-6" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
          </span>
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-5 right-5 z-50 flex h-[540px] max-h-[calc(100vh-2.5rem)] w-[380px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-emeres-lg"
          role="dialog"
          aria-label="Assistant Émé"
        >
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-3 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Émé</div>
              <div className="text-xs text-white/80">Ton assistant ÉMÉRÉS</div>
            </div>
            <button
              onClick={() => greeted.current && ask('')}
              className="rounded-full p-1.5 transition-colors hover:bg-white/15"
              title="Recommencer la conversation"
              aria-label="Recommencer la conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 transition-colors hover:bg-white/15"
              aria-label="Fermer l'assistant"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3 py-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-br-md bg-blue-600 text-white'
                      : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white">
                  <TypingDots />
                </div>
              </div>
            )}

            {!loading && (suggestions.length > 0 || actions.length > 0) && (
              <div className="space-y-2 pt-1">
                {actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {actions.map((a, i) => (
                      <button
                        key={i}
                        onClick={() => handleAction(a)}
                        className="group inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                        title={a.description}
                      >
                        {a.label}
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                )}
                {suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => ask(s)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pose ta question à Émé…"
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none transition-colors focus:border-blue-400 focus:bg-white"
              aria-label="Message pour Émé"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 text-white transition-opacity disabled:opacity-40"
              aria-label="Envoyer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default StudentAssistant;

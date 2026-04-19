import React, { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { SimulationInputs } from '../types';

interface NanobotExpertProps {
  currentInputs: SimulationInputs;
}

export const NanobotExpert: React.FC<NanobotExpertProps> = ({ currentInputs }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: "Protocol Advisor online. I am synced with your current synthesis parameters. Ask me how to optimize your results for size, stability, or yield." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const context = `[CURRENT PARAMETERS: Metal=${currentInputs.metal}, PlantSource=${currentInputs.plant}, Temp=${currentInputs.temperature}°C, pH=${currentInputs.ph}, Concentration=${currentInputs.concentration}mM]`;
      const fullPrompt = `${context}\nUser Question: ${userMsg}`;

      const res = await fetch("http://localhost:5000/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await res.json();

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.text ||
        "No response from backend";

      setMessages(prev => [...prev, { role: 'bot', content: text }]);

    } catch (error) {
      console.error('Backend Error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'bot', content: "Backend connection failed. Check server." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-dark-sidebar rounded-2xl overflow-hidden border border-dark-border shadow-2xl">
      
      {/* Header */}
      <div className="bg-dark-800 p-4 border-b border-dark-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-green/10 flex items-center justify-center border border-accent-green/20">
            <Bot className="w-4 h-4 text-accent-green" />
          </div>
          <div>
            <h3 className="font-serif font-light text-text-bright text-sm uppercase tracking-widest">NanoSynth Advisor</h3>
            <p className="text-[9px] text-text-dim font-mono uppercase tracking-[2px]">AI Protocol Database</p>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((ms, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: ms.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex gap-3 max-w-[85%]",
                ms.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className="w-7 h-7 rounded bg-dark-card border flex items-center justify-center">
                {ms.role === 'bot' ? <Bot size={14} /> : <User size={14} />}
              </div>

              <div className={cn(
                "p-4 rounded-xl text-xs",
                ms.role === 'bot'
                  ? "bg-dark-card border border-dark-border"
                  : "bg-accent-green/10 border border-accent-green/20"
              )}>
                {ms.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex gap-3">
            <Loader2 className="animate-spin text-accent-green" />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-dark-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-dark-card border border-dark-border px-3 py-2 text-sm"
            placeholder="Ask something..."
          />
          <button onClick={handleSend} disabled={isLoading}>
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};
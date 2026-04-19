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
({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: fullPrompt }] }
        ],
        config: {
          systemInstruction: `You are the Core Intelligence of the SYNTHESYS Green Engine, an expert Nano-Synthesis Advisor. 
          Your goal is to provide highly targeted scientific advice on green nanoparticle synthesis. 
          
          Guidelines:
          1. Use the [CURRENT PARAMETERS] provided in the prompt to give specific recommendations.
          2. Explain how the current pH and Temperature interact with the plant's phytochemicals (like polyphenols or flavonoids) to influence nucleation and LSPR behavior.
          3. If the user wants smaller particles, suggest increasing pH (to speed up reduction) or increasing Temperature (to favor nucleation over growth).
          4. If the user wants better stability, suggest using extracts with high-reducing power and capping agents (like Green Tea or Matcha) and maintaining pH around 8-9.
          5. Suggest optimal plant-metal combinations when appropriate (e.g., "For ultra-stable Gold particles, consider using Tannin-rich extracts like Cinnamon").
          6. Maintain a professional, scientifically rigorous, yet helpful laboratory tone. 
          7. Refer to characterization techniques like DLS, TEM, and XRD to validate theoretical predictions.`
        }
      });

      const text = response.text || "I'm sorry, I couldn't process that. Please try asking about plant extracts or nanoparticle characterization.";
      setMessages(prev => [...prev, { role: 'bot', content: text }]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      setMessages(prev => [...prev, { role: 'bot', content: "I encountered an error while connecting to the knowledge base. Please try again later." }]);
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
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent-green/5 border border-accent-green/10">
           <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
           <span className="text-[9px] font-bold text-accent-green uppercase tracking-tighter">Live</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-dark-border">
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
              <div className={cn(
                "w-7 h-7 rounded bg-dark-card border flex-shrink-0 flex items-center justify-center",
                ms.role === 'bot' 
                  ? "border-accent-green/30 text-accent-green" 
                  : "border-text-dim opacity-50 text-text-bright"
              )}>
                {ms.role === 'bot' ? <Bot size={14} /> : <User size={14} />}
              </div>
              <div className={cn(
                "p-4 rounded-xl text-xs leading-relaxed font-light",
                ms.role === 'bot' 
                  ? "bg-dark-card text-text-dim border border-dark-border shadow-sm" 
                  : "bg-accent-green/10 text-text-bright border border-accent-green/20"
              )}>
                {ms.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded bg-dark-card border border-accent-green/30 flex items-center justify-center">
              <Loader2 className="w-3 h-3 text-accent-green animate-spin" />
            </div>
            <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
              <div className="flex gap-1.5">
                <div className="w-1 h-1 bg-accent-green rounded-full animate-bounce [animation-duration:1s]" />
                <div className="w-1 h-1 bg-accent-green rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:1s]" />
                <div className="w-1 h-1 bg-accent-green rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:1s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-dark-800 border-t border-dark-border">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Search theoretical protocols..."
            className="w-full bg-dark-card border border-dark-border rounded-lg py-3 px-4 pr-12 text-xs text-text-bright focus:outline-none focus:border-accent-green/50 placeholder:text-text-dim/50 transition-all font-light"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 px-3 bg-accent-green text-black hover:brightness-110 disabled:opacity-20 disabled:grayscale rounded text-xs transition-all"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

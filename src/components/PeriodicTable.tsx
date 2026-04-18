import React from 'react';
import { MetalType } from '../types';
import { ALL_ELEMENTS, METAL_PROPERTIES } from '../constants';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface PeriodicTableProps {
  selectedMetal: MetalType;
  onSelect: (metal: MetalType) => void;
}

export const PeriodicTable: React.FC<PeriodicTableProps> = ({ selectedMetal, onSelect }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-text-dim uppercase tracking-[2px]">
          Universal Metallic Precursor
        </label>
        <span className="text-[10px] font-mono text-accent-green bg-accent-green/10 px-2 py-0.5 rounded border border-accent-green/20">
          Selected: {selectedMetal}
        </span>
      </div>

      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div 
          className="grid gap-1 min-w-[800px]" 
          style={{ 
            gridTemplateColumns: 'repeat(18, 1fr)',
            gridTemplateRows: 'repeat(9, 1fr)' 
          }}
        >
          {ALL_ELEMENTS.map((el) => {
            const isSelected = selectedMetal === el.m;
            const isSupported = !!METAL_PROPERTIES[el.m] && (METAL_PROPERTIES[el.m].potential > -1.0);
            
            return (
              <motion.button
                key={el.s}
                whileHover={{ scale: 1.1, zIndex: 50 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onSelect(el.m)}
                style={{ 
                  gridColumn: el.x, 
                  gridRow: el.y,
                }}
                className={cn(
                  "flex flex-col items-center justify-center p-1 rounded border transition-all relative group",
                  isSelected 
                    ? "bg-accent-green/30 border-accent-green z-20 shadow-[0_0_15px_rgba(80,200,120,0.4)]" 
                    : isSupported
                      ? "bg-dark-card border-dark-border hover:border-accent-green/50"
                      : "bg-dark-sidebar opacity-40 border-dark-border grayscale hover:grayscale-0 hover:opacity-100"
                )}
              >
                <span className="text-[6px] absolute top-0.5 left-0.5 opacity-40 font-mono leading-none">
                  {el.n}
                </span>
                <span className={cn(
                  "text-xs font-bold tracking-tighter leading-none mb-0.5",
                  isSelected ? "text-accent-green" : "text-text-bright"
                )}>
                  {el.s}
                </span>
                
                {isSelected && (
                  <motion.div 
                    layoutId="active-glow"
                    className="absolute inset-0 bg-accent-green/10 animate-pulse" 
                  />
                )}

                {/* Synthesis feasibility indicator */}
                <div 
                  className={cn(
                    "absolute bottom-0 inset-x-0 h-0.5 transition-all",
                    isSelected ? "bg-accent-green" : isSupported ? "bg-accent-green/30" : "bg-red-500/30"
                  )} 
                />
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-dark-sidebar/50 border border-dark-border/50 text-[10px] text-text-dim flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_8px_rgba(80,200,120,0.5)]" />
           <span>Synthesis Supported (Thermodynamically Viable)</span>
        </div>
        <div className="p-3 rounded-lg bg-dark-sidebar/50 border border-dark-border/50 text-[10px] text-text-dim flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-red-500/50" />
           <span>Synthesis Restricted (Negative Potential)</span>
        </div>
      </div>
    </div>
  );
};

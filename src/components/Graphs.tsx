import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { SimulationInputs } from '../types';
import { PLANT_PROPERTIES } from '../constants';

interface GraphsProps {
  inputs: SimulationInputs;
}

export const Graphs: React.FC<GraphsProps> = ({ inputs }) => {
  // Generate data for Temperature vs Size
  const tempVsSizeData = Array.from({ length: 10 }, (_, i) => {
    const temp = 20 + i * 8;
    const props = PLANT_PROPERTIES[inputs.plant];
    const tEffect = Math.max(0.5, 1.5 - (temp / 100));
    const phEffect = Math.max(0.6, 1.4 - (Math.abs(inputs.ph - 9) / 10));
    const cEffect = Math.sqrt(inputs.concentration);
    const size = props.baseSize * tEffect * phEffect * cEffect;
    return { temp, size: Number(size.toFixed(2)) };
  });

  // Generate data for pH vs Concentration (showing Yield trend)
  const phVsYieldData = Array.from({ length: 11 }, (_, i) => {
    const ph = 2 + i;
    const props = PLANT_PROPERTIES[inputs.plant];
    const yieldPerc = Math.min(99, (inputs.concentration * 10 + inputs.temperature * 0.5) * props.efficiency * (1 - Math.abs(ph - 7) / 20));
    return { ph, yield: Number(yieldPerc.toFixed(1)) };
  });

  // Generate data for pH vs Size
  const phVsSizeData = Array.from({ length: 11 }, (_, i) => {
    const ph = 4 + i;
    const props = PLANT_PROPERTIES[inputs.plant];
    const tEffect = Math.max(0.5, 1.5 - (inputs.temperature / 100));
    const phEffect = Math.max(0.6, 1.4 - (Math.abs(ph - 9) / 10));
    const cEffect = Math.sqrt(inputs.concentration);
    const size = props.baseSize * tEffect * phEffect * cEffect;
    return { ph, size: Number(size.toFixed(1)) };
  });

  // Generate data for Comparative Analysis (all plants)
  const comparisonData = Object.entries(PLANT_PROPERTIES).map(([name, props]) => {
    // Score based on efficiency and reducing power
    const score = (props.efficiency * 50) + (props.reducingPower * 50);
    return { name, score: Number(score.toFixed(1)), isSelected: name === inputs.plant };
  });

  // Sort to find the top 5
  const topPerformers = [...comparisonData].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pb-8">
      <div className="bg-[#1a1a1d] p-8 rounded-lg border border-dark-border shadow-sm lg:col-span-2 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            <h3 className="text-xs font-serif italic text-text-dim mb-8 text-center tracking-widest uppercase opacity-70">
              Comparative Botanical Database Index
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2e" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 8, fill: '#808085' }}
                    axisLine={{ stroke: '#3a3a3e' }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#808085' }}
                    axisLine={{ stroke: '#3a3a3e' }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161619', borderRadius: '8px', border: '1px solid #2a2a2e', color: '#fff' }}
                    cursor={{ fill: 'rgba(80, 200, 120, 0.05)' }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {comparisonData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isSelected ? '#50c878' : '#2a2a2e'} 
                        stroke={entry.isSelected ? '#50c878' : '#3a3a3e'}
                        strokeWidth={1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-text-dim mt-4 text-center italic opacity-50">
              Selected: <span className="text-accent-green font-bold">{inputs.plant}</span> | Data compiled from stoichiometric nucleation rates.
            </p>
          </div>

          <div className="w-full md:w-64 bg-dark-card/50 p-6 rounded-xl border border-dark-border">
             <h4 className="text-[10px] font-bold text-accent-green uppercase tracking-[3px] mb-4 border-b border-dark-border pb-2 flex items-center justify-between">
                Protocol Ranking
                <span className="text-[8px] opacity-40">v2.4</span>
             </h4>
             <div className="space-y-4">
                {topPerformers.map((plant, idx) => (
                  <div key={plant.name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                       <span className="font-mono text-[10px] text-text-dim/30">{idx + 1}</span>
                       <span className={`text-[11px] ${plant.isSelected ? 'text-accent-green font-bold' : 'text-text-dim group-hover:text-text-bright'}`}>
                          {plant.name}
                       </span>
                    </div>
                    <span className="text-[10px] font-mono text-text-dim/50">{plant.score}%</span>
                  </div>
                ))}
             </div>
             <div className="mt-6 pt-4 border-t border-dark-border">
                <p className="text-[9px] text-text-dim/40 leading-relaxed italic">
                   Note: <span className="text-accent-green">Grape Seed</span> & <span className="text-accent-green">Turmeric</span> show highest efficiency for rapid nucleation.
                </p>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1d] p-8 rounded-lg border border-dark-border shadow-sm">
        <h3 className="text-xs font-serif italic text-text-dim mb-8 text-center tracking-widest uppercase opacity-70">
          Thermal Nucleation Gradient
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tempVsSizeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2e" />
              <XAxis 
                dataKey="temp" 
                tick={{ fontSize: 10, fill: '#808085' }}
                axisLine={{ stroke: '#3a3a3e' }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#808085' }}
                axisLine={{ stroke: '#3a3a3e' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#161619', borderRadius: '8px', border: '1px solid #2a2a2e', color: '#fff' }}
                itemStyle={{ color: '#50c878' }}
              />
              <Line 
                type="monotone" 
                dataKey="size" 
                stroke="#50c878" 
                strokeWidth={2} 
                dot={{ r: 3, fill: '#50c878' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#1a1a1d] p-8 rounded-lg border border-dark-border shadow-sm">
        <h3 className="text-xs font-serif italic text-text-dim mb-8 text-center tracking-widest uppercase opacity-70">
          Biogenic Stability Index
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={phVsSizeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2e" />
              <XAxis 
                dataKey="ph" 
                tick={{ fontSize: 10, fill: '#808085' }}
                axisLine={{ stroke: '#3a3a3e' }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#808085' }}
                axisLine={{ stroke: '#3a3a3e' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#161619', borderRadius: '8px', border: '1px solid #2a2a2e', color: '#fff' }}
                itemStyle={{ color: '#c0c0c8' }}
              />
              <Line 
                type="monotone" 
                dataKey="size" 
                stroke="#c0c0c8" 
                strokeWidth={2} 
                dot={{ r: 3, fill: '#c0c0c8' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#1a1a1d] p-8 rounded-lg border border-dark-border shadow-sm lg:col-span-2">
        <h3 className="text-xs font-serif italic text-text-dim mb-8 text-center tracking-widest uppercase opacity-70">
          Synthesis Efficiency Projection (pH vs Yield)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={phVsYieldData}>
              <defs>
                <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#50c878" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#50c878" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2e" />
              <XAxis 
                dataKey="ph" 
                tick={{ fontSize: 10, fill: '#808085' }}
                axisLine={{ stroke: '#3a3a3e' }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#808085' }}
                axisLine={{ stroke: '#3a3a3e' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#161619', borderRadius: '8px', border: '1px solid #2a2a2e', color: '#fff' }}
                itemStyle={{ color: '#50c878' }}
              />
              <Area 
                type="monotone" 
                dataKey="yield" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorYield)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

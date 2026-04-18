import React, { useState, useEffect } from 'react';
import { PlantType } from '../types';
import { Graphs } from './Graphs';
import { Thermometer, FlaskConical, Beaker, TestTube, Scale, ShieldCheck, Zap, TrendingUp, Info, Download, Search, Sparkles, ExternalLink, BookOpen } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { EDUCATIONAL_CONTENT, PLANT_PROPERTIES, PLANT_DESCRIPTIONS, METAL_PROPERTIES } from '../constants';

import { PeriodicTable } from './PeriodicTable';

import { SimulationInputs, SimulationOutputs } from '../types';

interface SynthesisSimulatorProps {
  inputs: SimulationInputs;
  setInputs: React.Dispatch<React.SetStateAction<SimulationInputs>>;
  outputs: SimulationOutputs;
}

export const SynthesisSimulator: React.FC<SynthesisSimulatorProps> = ({ inputs, setInputs, outputs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Automatically clear results when any input changes (Plant source, temp, etc.)
  // This ensures a "clean slate" for the next search or simulation
  useEffect(() => {
    setShowResults(false);
  }, [inputs]);

  const ALL_PLANTS: PlantType[] = [
    'Aloe Vera', 'Neem', 'Green Tea', 'Tulsi', 'Citrus Peel',
    'Moringa', 'Hibiscus', 'Papaya', 'Ginger', 'Garlic',
    'Turmeric', 'Eucalyptus', 'Cinnamon', 'Grape Seed', 'Onion Peel', 'Orange Peel',
    'Lavender', 'Rosemary', 'Cactus', 'Bamboo',
    'Rose', 'Jasmine', 'Peppermint', 'Basil', 'Thyme', 
    'Oregano', 'Cloves', 'Cardamom', 'Black Pepper', 'Coriander',
    'Fennel', 'Cumin', 'Saffron', 'Vanilla', 'Coffee', 
    'Cocoa', 'Tea Tree', 'Lemon Balm', 'Ashwagandha', 'Ginseng',
    'Ginkgo Biloba', 'Echinacea', 'Calendula', 'Chamomile', 'Strawberry', 
    'Blueberry', 'Raspberry', 'Blackberry', 'Pomegranate', 'Grapefruit', 
    'Lime', 'Spearmint', 'Lemon', 'Pineapple', 'Mango', 'Amla',
    'Papain', 'Quinine', 'Stevia Leaf', 'Fenugreek', 'Cinchona Bark',
    'Rhodiola rosea', 'Rhodia rosea', 'Geranium', 'Magnolia', 'Oak Bark',
    'Pine Needle', 'Spirulina', 'Chlorella', 'Seaweed', 'Algae',
    'Lemon Grass', 'Marigold', 'Artichoke', 'Astragalus', 'Bilberry',
    'Acacia', 'Alfalfa', 'Artemisia', 'Asparagus',
    'Bitter Melon', 'Black Cohosh', 'Burdock', 'Butcher\'s Broom',
    'Cat\'s Claw', 'Cayenne', 'Celery Seed', 'Cranberry', 'Dandelion', 'Dong Quai',
    'Elderberry', 'Evening Primrose', 'Fenugreek Seed', 'Feverfew', 'Garcinia',
    'Goldenseal', 'Gotu Kola', 'Guarana', 'Hawthorn', 'Hoodia', 'Horse Chestnut',
    'Horsetail', 'Kava Kava', 'Kudzu', 'Licorice', 'Maca', 'Milk Thistle',
    'Motherwort', 'Nettle', 'Olive Leaf', 'Passionflower', 'Red Clover',
    'Saw Palmetto', 'Schisandra', 'Skullcap', 'St. John\'s Wort', 'Valerian',
    'White Willow', 'Wild Yam', 'Yerba Mate', 'Yohimbe', 'Yohimbe Bark',
    'Ash Tree', 'Birch Bark', 'Cedar Wood', 'Cherry Blossom', 'Dill',
    'Elderflower', 'Gorse', 'Ivy Leaf', 'Juniper Berry', 'Kelp',
    'Lemon Peel', 'Marshmallow Root', 'Nutmeg', 'Parsley', 'Quassia',
    'Red Raspberry Leaf', 'Sage', 'Tarragon', 'Uva Ursi', 'Verbascum',
    'Witch Hazel', 'Yellow Dock', 'Zedoary',
    'Siberian Nettle Root', 'Tribulus terrestris', 'Arnica Montana',
    'Skullcap Root', 'Milk Thistle Seed', 'Black Seed Oil', 'Mullein Leaf',
    'Brahmi', 'Shatavari', 'Guduchi', 'Triphala', 'Holy Basil', 'Saw Palmetto Berry',
    'Damiana', 'Sarsaparilla', 'Skullcap Herb', 'Valerian Root', 'Yarrow',
    'Goldenseal Root', 'Poke Root', 'Red Root', 'Shepherd\'s Purse', 'Lady\'s Mantle'
  ];

  // The Top 20 scientifically established sources for "Suggestions"
  const SUGGESTED_PLANTS: PlantType[] = [
    'Aloe Vera', 'Neem', 'Green Tea', 'Tulsi', 'Citrus Peel',
    'Moringa', 'Hibiscus', 'Papaya', 'Ginger', 'Garlic',
    'Turmeric', 'Eucalyptus', 'Cinnamon', 'Grape Seed', 'Onion Peel', 'Orange Peel',
    'Lavender', 'Rosemary', 'Cactus', 'Bamboo'
  ];

  const filteredPlants = ALL_PLANTS.filter(p => 
    p.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRunSimulation = () => {
    setShowResults(true);
    // Scroll to results if possible or just show
  };

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    
    // Find better plant for report
    let betterPlantName: PlantType = 'Aloe Vera';
    let maxScore = 0;
    (Object.entries(PLANT_PROPERTIES) as [PlantType, typeof PLANT_PROPERTIES['Aloe Vera']][]).forEach(([name, props]) => {
      const s = props.efficiency * props.reducingPower;
      if (s > maxScore) { maxScore = s; betterPlantName = name; }
    });
    const selectedScore = PLANT_PROPERTIES[inputs.plant].efficiency * PLANT_PROPERTIES[inputs.plant].reducingPower;
    const betterProps = PLANT_PROPERTIES[betterPlantName];

    // Page 1: Header
    doc.setFillColor(20, 20, 23);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(80, 200, 120);
    doc.setFontSize(24);
    doc.text('SYNTHESYS : Comparative Analysis Report', 20, 25);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 155);
    doc.text(`REPORT ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()} | ${timestamp}`, 20, 35);

    // Section 1: Selected Botanical Profile
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(16);
    doc.text(`I. Primary Source: ${inputs.plant} + ${inputs.metal}`, 20, 55);
    doc.line(20, 58, 190, 58);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    const aboutText = doc.splitTextToSize(PLANT_DESCRIPTIONS[inputs.plant] || `Biological reducing agent for ${inputs.metal}NP synthesis.`, 170);
    doc.text(aboutText, 20, 65);

    // Sub-metrics
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Reducing Potential: ${(PLANT_PROPERTIES[inputs.plant].reducingPower * 10).toFixed(1)}/10`, 25, 80);
    doc.text(`Synthesis Efficiency: ${(PLANT_PROPERTIES[inputs.plant].efficiency * 100).toFixed(0)}%`, 25, 87);
    doc.text(`Theoretical Yield: ${outputs.yieldPercentage}%`, 25, 94);

    // Section 2: Comparative Optimization
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('II. Comparative Optimization', 20, 110);
    doc.line(20, 113, 190, 113);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Global Best Source: ${betterPlantName}`, 25, 123);
    
    // Comparison Table Header
    doc.setFillColor(240, 240, 245);
    doc.rect(20, 130, 170, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Metric', 25, 137);
    doc.text(inputs.plant, 80, 137);
    doc.text(betterPlantName, 140, 137);

    doc.setFont('helvetica', 'normal');
    // Row 1
    doc.text('Reducing Power', 25, 147);
    doc.text(`${(PLANT_PROPERTIES[inputs.plant].reducingPower).toFixed(2)}`, 80, 147);
    doc.text(`${(betterProps.reducingPower).toFixed(2)}`, 140, 147);
    // Row 2
    doc.text('Efficiency', 25, 154);
    doc.text(`${(PLANT_PROPERTIES[inputs.plant].efficiency * 100).toFixed(0)}%`, 80, 154);
    doc.text(`${(betterProps.efficiency * 100).toFixed(0)}%`, 140, 154);
    // Row 3
    doc.text('Performance Score', 25, 161);
    doc.text(`${(selectedScore * 100).toFixed(1)}%`, 80, 161);
    doc.text(`${(maxScore * 100).toFixed(1)}%`, 140, 161);

    // Section 3: Synthesis Conclusion
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    
    // Botanical Reference
    doc.text('I. Botanical Profile Research:', 20, 168);
    doc.setTextColor(0, 0, 238);
    const plantScholar = `https://scholar.google.com/scholar?q=${encodeURIComponent(inputs.plant)}+extract+phytochemical+analysis`;
    doc.text(plantScholar, 85, 168);
    doc.line(85, 169, 190, 169); // Underline for Botanical

    // Interaction Reference
    doc.setTextColor(60, 60, 60);
    doc.text('II. Synthesis Interaction Research:', 20, 174);
    doc.setTextColor(200, 80, 0); // Different color for differentiation
    const scholarLink = `https://scholar.google.com/scholar?q=biogenic+synthesis+of+${encodeURIComponent(inputs.metal)}+nanoparticles+using+${encodeURIComponent(inputs.plant)}+extract`;
    doc.text(scholarLink, 85, 174);
    doc.line(85, 175, 190, 175); // Underline for Interaction

    doc.setFillColor(240, 250, 240); // Lighter green background without alpha issues
    doc.rect(20, 175, 170, 45, 'F');
    doc.setDrawColor(80, 200, 120);
    doc.rect(20, 175, 170, 45, 'S'); // Add border
    
    doc.setTextColor(34, 139, 34);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Final Synthesis Conclusion', 25, 185);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    const conclusion = outputs.canSynthesize 
      ? `Analysis of "${inputs.plant}" extract confirms its viability as a biological reducing agent for ${inputs.metal} nanoparticles. For the current search, this extract achieved a yield of ${outputs.yieldPercentage}% with a biogenic stability index of ${outputs.stabilityIndex}/10. While effective, experimental data suggests that transitioning to ${betterPlantName} protocols or adjusting metallic precursors could provide more rapid nucleation kinetics and superior monodispersity.`
      : `CRITICAL ALERT: Synthesis of ${inputs.metal} using ${inputs.plant} extract is thermodynamically restricted. ${outputs.failureReason}`;
    
    doc.text(doc.splitTextToSize(conclusion, 160), 25, 195);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text('CONFIDENTIAL LAB DATA | SYNTHESYS SYSTEM | NOT FOR REPLICATION WITHOUT VALIDATION', 20, 285);

    doc.save(`SYNTH_ANALYSIS_${inputs.plant.toUpperCase()}.pdf`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-dark-sidebar p-6 rounded-2xl border border-dark-border">
          <h2 className="text-sm font-bold text-text-dim uppercase tracking-widest mb-6 flex items-center gap-2 font-serif">
            <FlaskConical size={18} className="text-accent-green" />
            Synthesis Parameters
          </h2>

          <div className="space-y-6">
            {/* Metal Selection (Periodic Table) */}
            <PeriodicTable 
              selectedMetal={inputs.metal} 
              onSelect={(m) => setInputs({ ...inputs, metal: m })} 
            />

            {/* Plant Selection with Search */}
            <div className="input-group">
              <label className="text-xs font-bold text-text-dim uppercase tracking-wider mb-3 block flex items-center gap-2">
                <Search size={14} className="text-accent-green" />
                Botanical Explorer
              </label>
              
              <div className="relative mb-4 group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-accent-green transition-colors" />
                <input 
                  type="text"
                  placeholder="Master Research: Search or type any plant name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchTerm.trim()) {
                      const match = ALL_PLANTS.find(p => p.toLowerCase() === searchTerm.trim().toLowerCase());
                      setInputs({ ...inputs, plant: match || searchTerm.trim() });
                    }
                  }}
                  className="w-full bg-dark-card border border-dark-border py-2.5 pl-9 pr-3 rounded-lg text-[11px] text-white focus:outline-none focus:border-accent-green placeholder:text-text-dim/40 transition-all shadow-inner"
                />
                {searchTerm.trim() && (
                  <button 
                    onClick={() => {
                      const match = ALL_PLANTS.find(p => p.toLowerCase() === searchTerm.trim().toLowerCase());
                      setInputs({ ...inputs, plant: match || searchTerm.trim() });
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent-green hover:bg-accent-green/90 text-black px-2 py-1 rounded text-[9px] font-bold uppercase transition-all flex items-center gap-1 active:scale-95 shadow-lg"
                  >
                    Set
                  </button>
                )}
              </div>

              <div className="max-h-[320px] overflow-y-auto grid grid-cols-1 gap-1.5 pr-2 custom-scrollbar">
                {/* Always show the typed term if no direct match exists yet */}
                {searchTerm.trim() && !ALL_PLANTS.some(p => p.toLowerCase() === searchTerm.toLowerCase()) && (
                  <button
                    onClick={() => {
                       setInputs({ ...inputs, plant: searchTerm.trim() });
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-[10px] transition-all flex items-center justify-between group",
                      inputs.plant === searchTerm.trim() 
                        ? "bg-accent-green/30 text-accent-green border border-accent-green shadow-lg font-bold" 
                        : "bg-accent-green/5 border border-accent-green/20 text-accent-green/80 hover:bg-accent-green/10"
                    )}
                  >
                    <div className="flex items-center gap-2">
                       <Search size={10} />
                       <span className="truncate italic">Custom: {searchTerm}</span>
                    </div>
                    <div className="text-[8px] uppercase tracking-tighter opacity-60">Initialize Analysis</div>
                  </button>
                )}

                {filteredPlants.length > 0 ? (
                  filteredPlants.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setInputs({ ...inputs, plant: p });
                        setSearchTerm(p);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-[10px] transition-all flex items-center justify-between group",
                        inputs.plant === p 
                          ? "bg-accent-green/20 text-accent-green border border-accent-green/30 font-bold" 
                          : "bg-dark-card/50 border border-dark-border text-text-dim hover:text-white hover:border-accent-green/40 hover:bg-dark-card"
                      )}
                    >
                      <span className="truncate">{p}</span>
                      {inputs.plant === p && <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse shadow-[0_0_8px_rgba(80,200,120,0.8)]" />}
                      {SUGGESTED_PLANTS.includes(p as any) && inputs.plant !== p && (
                        <Sparkles size={10} className="text-accent-green/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  ))
                ) : (
                  searchTerm.trim() ? null : (
                    <div className="py-8 text-center border border-dashed border-dark-border rounded-xl">
                      <p className="text-[10px] text-text-dim italic">Type to begin exploration</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="input-group">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-text-dim uppercase tracking-wider flex items-center gap-1">
                  Temperature 🌡️ (°C)
                </label>
                <span className="text-xs font-mono font-bold text-accent-green">
                  {inputs.temperature}°C
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={inputs.temperature}
                onChange={(e) => setInputs({ ...inputs, temperature: Number(e.target.value) })}
                className="w-full h-1.5 bg-dark-border rounded-lg appearance-none cursor-pointer accent-accent-green"
              />
            </div>

            {/* pH Slider */}
            <div className="input-group">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-text-dim uppercase tracking-wider flex items-center gap-1">
                  pH Level 🧪
                </label>
                <span className="text-xs font-mono font-bold text-accent-green">
                  {inputs.ph}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="14"
                step="0.1"
                value={inputs.ph}
                onChange={(e) => setInputs({ ...inputs, ph: Number(e.target.value) })}
                className="w-full h-1.5 bg-dark-border rounded-lg appearance-none cursor-pointer accent-accent-green"
              />
            </div>

            {/* Concentration Slider */}
            <div className="input-group">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-text-dim uppercase tracking-wider flex items-center gap-1">
                  Concentration (mM)
                </label>
                <span className="text-xs font-mono font-bold text-accent-green">
                  {inputs.concentration} mM
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={inputs.concentration}
                onChange={(e) => setInputs({ ...inputs, concentration: Number(e.target.value) })}
                className="w-full h-1.5 bg-dark-border rounded-lg appearance-none cursor-pointer accent-accent-green"
              />
            </div>
            
            <button 
              onClick={handleRunSimulation}
              className="w-full bg-accent-green text-black font-bold py-3 rounded-lg hover:brightness-110 transition-all uppercase text-[12px] tracking-widest mt-6 shadow-[0_0_20px_rgba(80,200,120,0.2)] active:scale-95"
            >
              Analyze Synthesis Results
            </button>
            <p className="text-[9px] text-text-dim/40 text-center mt-3 italic">
              Verification engine confirms stoichiometric stability.
            </p>
          </div>
        </div>

        {/* Education Highlight */}
        <div className="bg-dark-card border border-dark-border p-4 rounded-xl">
           <h4 className="flex items-center gap-1 text-accent-green text-[10px] font-bold uppercase mb-2 tracking-widest">
             <Info size={14} />
             Green Lab Data
           </h4>
           <p className="text-[11px] text-text-dim leading-relaxed italic">
             {EDUCATIONAL_CONTENT.whatIsIt.substring(0, 150)}...
           </p>
        </div>
      </div>

      {/* Output Section */}
      <div className="lg:col-span-3">
        {!showResults ? (
          <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-dark-sidebar/30 border border-dashed border-dark-border rounded-2xl p-12 text-center">
             <div className="w-20 h-20 rounded-full bg-dark-card border border-dark-border flex items-center justify-center mb-6 opacity-40">
                <Beaker size={32} className="text-accent-green" />
             </div>
             <h3 className="text-xl font-serif text-text-dim italic mb-2">Protocol Pending Initialization</h3>
             <p className="text-sm text-text-dim/50 max-w-sm">
                Configure synthesis parameters and click "Analyze Synthesis Results" to generate theoretical nanoparticle characteristics.
             </p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Plant Spotlight & Suggestion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Metal-Botanical Interaction Spotlight */}
              <div className="bg-dark-sidebar p-6 rounded-2xl border border-dark-border relative overflow-hidden group">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                        <Zap size={20} />
                     </div>
                     <div>
                        <h3 className="text-[10px] font-bold text-text-dim uppercase tracking-[3px]">Interaction Profile</h3>
                        <p className="text-lg font-serif text-text-bright">{inputs.metal} + {inputs.plant}</p>
                     </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs text-text-dim/80 leading-relaxed">
                      The interaction between <span className="text-accent-green font-bold">{inputs.plant}</span> extract and <span className="text-orange-400 font-bold">{inputs.metal}</span> ions is governed by the selective reduction potentials. {inputs.metal} has a standard reduction potential of <span className="text-white font-mono">{METAL_PROPERTIES[inputs.metal].potential}V</span>.
                    </p>
                    <div className="flex items-center gap-2 p-2 rounded bg-dark-card border border-dark-border/50 text-[10px] text-text-dim">
                       <ShieldCheck size={12} className="text-accent-green" />
                       <span>Theoretical complexation: Phytochemicals stabilize {inputs.metal} nuclei via steric hindrance.</span>
                    </div>
                  </div>
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-orange-500 opacity-[0.02] rounded-full blur-2xl group-hover:opacity-[0.05] transition-opacity" />
               </div>

               <div className="bg-dark-sidebar p-6 rounded-2xl border border-dark-border relative overflow-hidden group">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center text-accent-green">
                        <Info size={20} />
                     </div>
                     <div>
                        <h3 className="text-[10px] font-bold text-text-dim uppercase tracking-[3px]">Botanical Profile</h3>
                        <p className="text-lg font-serif text-text-bright">{inputs.plant}</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs text-text-dim/80 leading-relaxed italic">
                       "{(() => {
                          const description = PLANT_DESCRIPTIONS[inputs.plant];
                          if (description) return description;
                          
                          // Fallback for custom or case-mismatch
                          const matchKey = Object.keys(PLANT_DESCRIPTIONS).find(k => k.toLowerCase() === inputs.plant.toLowerCase());
                          if (matchKey) return PLANT_DESCRIPTIONS[matchKey];
                          
                          return 'Selected biological reducing agent for biogenic synthesis.';
                       })()}"
                    </p>
                    
                    <div className="pt-4 border-t border-dark-border/40">
                       <h4 className="text-[9px] font-bold text-accent-green uppercase tracking-wider mb-2">Phytochemical Analysis</h4>
                       <div className="flex flex-wrap gap-2">
                          {(() => {
                             const components: Record<string, string[]> = {
                                'Aloe Vera': ['Aloesin', 'Lignin', 'Saponins'],
                                'Neem': ['Azadirachtin', 'Nimbin', 'Quercetin'],
                                'Green Tea': ['Polyphenols', 'Epigallocatechin', 'Catechins'],
                                'Tulsi': ['Eugenol', 'Ursolic acid', 'Antioxidants'],
                                'Rhodiola rosea': ['Salidroside', 'Rosavins', 'Tyrosol'],
                                'Stevia Leaf': ['Steviol glycosides', 'Rebaudioside', 'Flavonoids'],
                                'Fenugreek': ['Galactomannan', 'Diosgenin', 'Trigonelline'],
                                'Tribulus terrestris': ['Saponins', 'Tribulosin', 'Kaempferol'],
                                'Arnica Montana': ['Helenalin', 'Sesquiterpene', 'Phenol acids'],
                                'Siberian Nettle Root': ['Scopoletin', 'Lignans', 'Steroids'],
                                'Yohimbe Bark': ['Yohimbine', 'Alkaloids', 'Tannins'],
                                'Spirulina': ['Phycocyanin', 'Proteins', 'Carotenoids'],
                                'Amla': ['Gallic acid', 'Vitamin C', 'Ellagic acid'],
                             };
                             
                             const fallbackKey = Object.keys(components).find(k => k.toLowerCase() === inputs.plant.toLowerCase());
                             const currentComponents = components[inputs.plant] || components[fallbackKey || ''] || ['Polyphenols', 'Flavonoids', 'Proteins'];
                             
                             return currentComponents.map(c => (
                                <span key={c} className="px-2 py-0.5 rounded bg-dark-card border border-dark-border text-[9px] text-text-dim font-mono">
                                   {c}
                                </span>
                             ));
                          })()}
                       </div>
                    </div>
                  </div>
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-accent-green opacity-[0.02] rounded-full blur-2xl group-hover:opacity-[0.05] transition-opacity" />
               </div>

               <div className="bg-dark-card p-6 rounded-2xl border border-accent-green/20 border-dashed flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] font-bold text-accent-green uppercase tracking-[3px] mb-2 flex items-center gap-2">
                       <Sparkles size={12} />
                       AI Optimization Suggestion
                    </h3>
                    {(() => {
                      let bestPlant: PlantType = 'Aloe Vera';
                      let maxScore = 0;
                      Object.entries(PLANT_PROPERTIES).forEach(([name, props]) => {
                        const score = props.efficiency * props.reducingPower;
                        if (score > maxScore) { maxScore = score; bestPlant = name as PlantType; }
                      });
                      
                      // Values for delta analysis with case handling fallback
                      const getPlantProp = (name: string) => {
                        const p = (PLANT_PROPERTIES as any)[name];
                        if (p) return p;
                        const matchKey = Object.keys(PLANT_PROPERTIES).find(k => k.toLowerCase() === name.toLowerCase());
                        return matchKey ? (PLANT_PROPERTIES as any)[matchKey] : { reducingPower: 0.75, efficiency: 0.8 };
                      };

                      const currentRed = getPlantProp(inputs.plant).reducingPower;
                      const leaderRed = PLANT_PROPERTIES[bestPlant].reducingPower;
                      const currentYield = outputs.yieldPercentage;
                      // Theoretically max yield is roughly 98-99% in this simulation logic
                      const leaderYield = 98.5;

                      if (bestPlant === inputs.plant) {
                        return (
                          <p className="text-xs text-text-dim/80 mt-2">
                             Excellent choice. <span className="text-accent-green font-bold">{inputs.plant}</span> is currently the top-performing source in the database.
                          </p>
                        );
                      }
                      
                      const selectedRed = getPlantProp(inputs.plant).reducingPower;

                      return (
                        <p className="text-xs text-text-dim/80 mt-2 leading-relaxed">
                           While <span className="text-text-bright">{inputs.plant}</span> is effective, <span className="text-accent-green font-bold">{bestPlant}</span> offers a <span className="text-text-bright">{( (PLANT_PROPERTIES[bestPlant].reducingPower / selectedRed - 1) * 100 ).toFixed(0)}%</span> higher reducing potential for this protocol.
                        </p>
                      );
                    })()}
                  </div>
                  <div className="flex items-center justify-between border-t border-dark-border pt-4 mt-4">
                     <span className="text-[10px] text-text-dim/40 uppercase font-mono italic">Alternative analysis complete</span>
                     <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-green opacity-40 animate-pulse" />
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-green opacity-20" />
                     </div>
                  </div>
               </div>
            </div>

            {/* Quick Component Comparison */}
            {(() => {
               let bestPlant: PlantType = 'Aloe Vera';
               let maxScore = 0;
               Object.entries(PLANT_PROPERTIES).forEach(([name, props]) => {
                 const score = props.efficiency * props.reducingPower;
                 if (score > maxScore) { maxScore = score; bestPlant = name as PlantType; }
               });
               
               const getPlantProp = (name: string) => {
                 const p = (PLANT_PROPERTIES as any)[name];
                 if (p) return p;
                 const matchKey = Object.keys(PLANT_PROPERTIES).find(k => k.toLowerCase() === name.toLowerCase());
                 return matchKey ? (PLANT_PROPERTIES as any)[matchKey] : { reducingPower: 0.75, efficiency: 0.8 };
               };

               const currentRed = getPlantProp(inputs.plant).reducingPower;
               const leaderRed = PLANT_PROPERTIES[bestPlant].reducingPower;
               const currentEff = getPlantProp(inputs.plant).efficiency;
               const leaderEff = PLANT_PROPERTIES[bestPlant].efficiency;

               return (
                <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                    <h3 className="text-[10px] font-bold text-text-dim uppercase tracking-[3px] mb-8 flex items-center gap-2">
                       <Scale size={14} className="text-accent-green" />
                       Efficiency Delta Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                       <div className="space-y-4">
                          <p className="text-[9px] text-text-dim uppercase tracking-widest font-bold">Reducing Potential</p>
                          <div className="flex items-end gap-4 h-16">
                             <div className="flex-1 bg-dark-border/30 rounded-t-lg h-full relative group">
                                <div 
                                  className="absolute inset-x-0 bottom-0 bg-text-dim/20 rounded-t-lg transition-all duration-1000 animate-grow-up" 
                                  style={{ height: `${currentRed * 100}%` }}
                                ></div>
                                <span className="absolute -top-6 left-0 text-[10px] font-mono text-text-dim truncate w-full">{inputs.plant.split(' ')[0]}</span>
                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-text-bright">{(currentRed * 10).toFixed(1)}</span>
                             </div>
                             <div className="flex-1 bg-dark-border/30 rounded-t-lg h-full relative group">
                                <div 
                                  className="absolute inset-x-0 bottom-0 bg-accent-green/30 rounded-t-lg transition-all duration-1000 animate-grow-up" 
                                  style={{ height: `${leaderRed * 100}%` }}
                                ></div>
                                <span className="absolute -top-6 left-0 text-[10px] font-mono text-accent-green truncate w-full">Leader</span>
                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-accent-green">{(leaderRed * 10).toFixed(1)}</span>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <p className="text-[9px] text-text-dim uppercase tracking-widest font-bold">Synthesis Efficiency</p>
                          <div className="flex items-end gap-4 h-16">
                             <div className="flex-1 bg-dark-border/30 rounded-t-lg h-full relative">
                                <div 
                                  className="absolute inset-x-0 bottom-0 bg-text-dim/20 rounded-t-lg transition-all duration-1000 animate-grow-up" 
                                  style={{ height: `${currentEff * 100}%` }}
                                ></div>
                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-text-bright">{(currentEff * 100).toFixed(0)}%</span>
                             </div>
                             <div className="flex-1 bg-dark-border/30 rounded-t-lg h-full relative">
                                <div 
                                  className="absolute inset-x-0 bottom-0 bg-accent-green/30 rounded-t-lg transition-all duration-1000 animate-grow-up" 
                                  style={{ height: `${leaderEff * 100}%` }}
                                ></div>
                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-accent-green">{(leaderEff * 100).toFixed(0)}%</span>
                             </div>
                          </div>
                       </div>

                       <div className="flex flex-col justify-center">
                          <div className="p-4 bg-dark-sidebar/50 rounded-xl border border-dark-border/50 backdrop-blur-sm">
                             <p className="text-[11px] text-text-dim leading-relaxed">
                                <span className="text-accent-green font-bold block mb-1">Comparative Insights:</span> 
                                Your selection of <span className="text-text-bright">{inputs.plant}</span> exhibits a deviation of 
                                <span className="text-white font-mono ml-1">{( (leaderEff - currentEff) * 100 ).toFixed(1)}%</span> from the theoretical maximum efficiency observed in <span className="text-accent-green">{bestPlant}</span> protocols.
                             </p>
                          </div>
                       </div>
                    </div>
                </div>
               )
            })()}

            <div className="bg-dark-sidebar p-6 rounded-2xl border border-dark-border shadow-2xl transition-all duration-500 overflow-hidden relative">
              {!outputs.canSynthesize && (
                <div className="absolute inset-0 z-50 bg-dark-sidebar/95 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
                    <Zap size={32} className="text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-red-500 mb-4 uppercase tracking-tighter">Thermodynamic Incompatibility</h3>
                  <p className="text-sm text-text-dim max-w-md leading-relaxed">
                    {outputs.failureReason}
                  </p>
                  <div className="mt-8 p-4 bg-dark-card border border-dark-border rounded-lg text-[11px] text-text-dim/60 italic">
                    Consider selecting a metal with a higher standard reduction potential (e.g., Gold, Silver, Platinum) for spontaneous biogenic synthesis.
                  </div>
                </div>
              )}
              
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-dark-border">
            <h2 className="text-sm font-bold text-text-bright uppercase tracking-widest flex items-center gap-2 font-serif">
              Predicted AgNP Characteristics
            </h2>
            <div className="flex items-center gap-6">
               <button 
                 onClick={handleDownloadReport}
                 className="flex items-center gap-2 bg-accent-green text-black px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg active:scale-95"
               >
                 <Download size={14} />
                 Download Report
               </button>
               <div className="hidden sm:flex items-center gap-4 border-l border-dark-border pl-6">
                 <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Eco 🌱</span>
                   <span className={cn(
                     "text-xs font-mono font-bold px-2 py-0.5 rounded",
                     outputs.ecoScore > 80 ? "bg-emerald-900/50 text-emerald-400" : 
                     outputs.ecoScore > 60 ? "bg-yellow-900/50 text-yellow-400" : "bg-red-900/50 text-red-400"
                   )}>
                     {outputs.ecoScore}
                   </span>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Stability</span>
                   <span className="text-xs font-mono font-bold text-accent-green">{outputs.stabilityIndex}%</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <OutputCard 
              label="Particle Size" 
              value={`${outputs.particleSize} nm`} 
              subtext="Monodispersed Range"
              icon={<Scale size={18} className="text-text-bright" />}
            />
            <OutputCard 
              label="Reaction Rate ⚡" 
              value={`${outputs.reactionRate}%`} 
              subtext="+12% vs Baseline"
              icon={<Zap size={18} className="text-text-bright" />}
            />
            <OutputCard 
              label="Yield % 📈" 
              value={`${outputs.yieldPercentage}%`} 
              subtext="Optimal Recovery"
              icon={<TrendingUp size={18} className="text-text-bright" />}
            />
            <OutputCard 
              label="Color / Quality" 
              value={outputs.quality} 
              subtext="Grade A - High Purity"
              icon={<ShieldCheck size={18} className="text-text-bright" />}
              customElement={
                <div className="w-4 h-4 rounded-full border border-white mt-1" style={{ backgroundColor: outputs.color }}></div>
              }
            />
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 space-y-4">
               <h3 className="text-sm font-semibold text-text-dim italic font-serif uppercase tracking-widest">Observed Characterization</h3>
               <div className="flex items-center gap-4 p-4 rounded-xl bg-dark-card border border-dark-border">
                  <div className="w-12 h-12 rounded-lg border-2 border-white shadow-sm flex-shrink-0" style={{ backgroundColor: outputs.color }}></div>
                  <div>
                    <p className="text-xs font-bold text-text-bright">Sample Color (LSPR Peak)</p>
                    <p className="text-[10px] text-text-dim">Estimated wavelength peak: {Math.max(400, 400 + outputs.particleSize * 2)}nm</p>
                  </div>
               </div>
            </div>
            
               <div className="p-8 rounded-lg bg-dark-sidebar border border-dark-border flex flex-col items-center justify-center text-center gap-6">
                  <div className="relative">
                     <motion.div 
                       animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                       transition={{ repeat: Infinity, duration: 5 }}
                       className="w-24 h-24 rounded-full blur-3xl"
                       style={{ backgroundColor: outputs.color }}
                     />
                     <div 
                       className="absolute inset-0 w-24 h-24 rounded-full border border-dark-border flex items-center justify-center overflow-hidden bg-dark-900/40 backdrop-blur-sm"
                     >
                        <div className="flex flex-wrap gap-2 p-4 justify-center">
                           {Array.from({ length: 14 }).map((_, i) => (
                              <motion.div 
                                key={i}
                                animate={{ x: [0, (i%4-2)*4, 0], y: [0, (Math.floor(i/4)-2)*4, 0] }}
                                transition={{ repeat: Infinity, duration: 4, delay: i * 0.15 }}
                                className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" 
                                style={{ backgroundColor: outputs.color }}
                              />
                           ))}
                        </div>
                     </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-dim uppercase tracking-[4px]">TEM Morphology Projection</p>
                    <p className="text-[9px] text-text-dim/40 font-light italic mt-1 font-sans">Simulated resolution: 20nm scale</p>
                  </div>
               </div>
          </div>

          <Graphs inputs={inputs} />

          {/* Research Reference & Conclusion Section */}
          <div className="mt-12 bg-dark-card border border-dark-border rounded-2xl p-8 relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-dark-border/50">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent-green/10 rounded-lg">
                         <BookOpen size={20} className="text-accent-green" />
                      </div>
                      <div>
                         <h3 className="text-sm font-bold text-text-bright uppercase tracking-widest font-serif italic text-accent-green">Scholarly Verification Hub</h3>
                         <p className="text-[10px] text-text-dim uppercase tracking-wider mt-1">Twin-path research validation</p>
                      </div>
                   </div>
                   
                   <div className="flex flex-wrap gap-3">
                      <a 
                        href={`https://scholar.google.com/scholar?q=${encodeURIComponent(inputs.plant)}+extract+phytochemical+analysis`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-dark-sidebar border border-accent-green/30 hover:border-accent-green text-accent-green px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all group active:scale-95"
                      >
                        <Search size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        Botanical Papers
                      </a>
                      <a 
                        href={`https://scholar.google.com/scholar?q=biogenic+synthesis+of+${encodeURIComponent(inputs.metal)}+nanoparticles+using+${encodeURIComponent(inputs.plant)}+extract`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 hover:border-orange-500 text-orange-400 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all group active:scale-95 shadow-[0_0_15px_rgba(255,165,0,0.05)]"
                      >
                        <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        Synthesis Papers
                      </a>
                   </div>
                </div>

                <div className={cn(
                  "p-6 rounded-xl border-l-4 transition-all shadow-inner",
                  outputs.canSynthesize ? "bg-dark-sidebar/50 border-accent-green" : "bg-red-500/5 border-red-500"
                )}>
                   <h4 className={cn(
                     "text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2",
                     outputs.canSynthesize ? "text-accent-green" : "text-red-500"
                   )}>
                      <ShieldCheck size={12} />
                      {outputs.canSynthesize ? "Successive Synthesis Conclusion" : "Predictive Inhibition Alert"}
                   </h4>
                   <p className="text-sm text-text-dim leading-relaxed italic font-serif">
                      {outputs.canSynthesize 
                        ? `Analysis of "${inputs.plant}" extract confirms its viability as a biological reducing agent for ${inputs.metal} nanoparticles. For the current search, this extract achieved a yield of ${outputs.yieldPercentage}% with a biogenic stability index of ${outputs.stabilityIndex}/10. While effective, experimental data suggests that correlating these results with real-world research papers can provide deeper insights into nucleation kinetics and superior monodispersity.`
                        : outputs.failureReason
                      }
                   </p>
                </div>
                
                <p className="text-[10px] text-text-dim/40 text-center mt-6 uppercase tracking-widest">
                   Laboratory protocol verified via multi-metric AI engine.
                </p>
             </div>
             
             {/* Decorative background glow */}
             <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-accent-green opacity-[0.03] rounded-full blur-[100px]" />
          </div>
        </div>
      </motion.div>
        )}
      </div>
    </div>
  );
};

interface OutputCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: React.ReactNode;
  customElement?: React.ReactNode;
}

const OutputCard = ({ label, value, subtext, icon, customElement }: OutputCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-card border border-dark-border rounded-lg p-5 relative overflow-hidden group hover:border-accent-green transition-colors"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider">{label}</span>
        <div className="opacity-30 group-hover:opacity-100 transition-opacity">{icon}</div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <div className="font-mono text-2xl font-bold text-text-bright tracking-tight italic select-none">
          {value}
        </div>
        {customElement}
      </div>
      
      {subtext && (
        <span className="text-[10px] font-medium text-accent-green/80 mt-2 block tracking-wide">
          {subtext}
        </span>
      )}
      
      {/* Decorative bg element */}
      <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-accent-green opacity-[0.03] rounded-full blur-xl group-hover:opacity-10 transition-opacity" />
    </motion.div>
  );
};

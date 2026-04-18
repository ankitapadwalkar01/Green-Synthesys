import React from 'react';
import { SynthesisSimulator } from './components/SynthesisSimulator';
import { NanobotExpert } from './components/NanobotExpert';
import { Leaf, GraduationCap, Microscope, Pill, FlaskConical, Github, HelpCircle } from 'lucide-react';
import { EDUCATIONAL_CONTENT } from './constants';
import { useSimulation } from './hooks/useSimulation';
import { motion } from 'motion/react';

export default function App() {
  const { inputs, setInputs, outputs } = useSimulation();

  return (
    <div className="min-h-screen bg-dark-900 text-text-bright font-sans selection:bg-accent-green/20 selection:text-accent-green">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-dark-800 border-b border-dark-border px-8 py-0 h-16 flex items-center shadow-xl">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded bg-dark-sidebar border border-dark-border flex items-center justify-center">
              <Leaf className="text-accent-green w-5 h-5" />
            </div>
            <h1 className="font-serif text-[18px] tracking-[0.1em] text-[#c0c0c8] uppercase">
              SYNTHESYS<span className="font-sans font-thin opacity-30 text-[10px] ml-1">Green Engine</span>
            </h1>
            <div className="ml-10 flex items-center gap-10 text-[10px] font-bold text-text-dim uppercase tracking-[3px]">
              <a href="#simulator" className="hover:text-accent-green transition-all">Simulator</a>
              <a href="#education" className="hover:text-accent-green transition-all">Library</a>
              <a href="#conclusion" className="hover:text-accent-green transition-all">Summary</a>
              <a href="#expert" className="hover:text-accent-green transition-all">AI Advisor</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-dark-card text-accent-green text-[10px] px-3 py-1 rounded border border-dark-border uppercase font-bold tracking-[0.2em]">
              Green Protocol Active v2.5
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-xl bg-dark-card pt-20 pb-16 px-8 md:px-16 border border-dark-border shadow-2xl">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-green/[0.02] to-transparent pointer-events-none" />
           
           <div className="relative z-10 max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-accent-green/5 border border-accent-green/10 text-accent-green text-[10px] font-bold uppercase tracking-[0.25em] mb-8"
              >
                <Microscope size={12} />
                Biosynthetic Laboratory Environment
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-serif font-light text-text-bright leading-[1.1] tracking-tight mb-8"
              >
                Green Synthesis & <br/>
                <span className="text-accent-green italic">Predictive Metrology</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm md:text-base text-text-dim font-light leading-relaxed mb-12 max-w-2xl font-sans"
              >
                Harnessing plant metabolites as biocompatible reducing agents for silver nanoparticle production. 
                Our engine utilizes stochastic modeling to predict particle size distribution, LSPR behavior, and eco-efficiency scores.
              </motion.p>
              
              <div className="flex flex-wrap gap-6">
                 <a href="#simulator" className="bg-accent-green text-black px-10 py-4 rounded-sm text-[11px] font-bold uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-xl shadow-accent-green/5">
                    Launch Simulator
                 </a>
                 <button className="bg-transparent text-text-bright px-10 py-4 rounded-sm text-[11px] font-bold uppercase tracking-[0.3em] border border-dark-border hover:bg-dark-sidebar transition-all">
                    Laboratory Protocol
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-dark-border/50">
              <HeroStat label="Active Source" value="Botanic Extraction" />
              <HeroStat label="Efficiency Threshold" value="94.2% Peak" />
              <HeroStat label="Environmental Impact" value="Zero Toxic Leach" />
              <HeroStat label="Metrology" value="DLS / TEM / XRD" />
           </div>
        </section>

        {/* Feature Grid */}
        <section id="learn" className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <FeatureCard 
             icon={<Leaf className="text-accent-green" />}
             title="Phyto-Reduction"
             description="Harnessing phenolics and terpenoids as high-efficiency reducing agents."
           />
           <FeatureCard 
             icon={<Pill className="text-accent-green" />}
             title="Biocompatibility"
             description="Green-synthesized NPs demonstrate superior cellular integration properties."
           />
           <FeatureCard 
             icon={<GraduationCap className="text-accent-green" />}
             title="Protocol Forge"
             description="Standardized stoichiometry and thermodynamic modeling for precision results."
           />
        </section>

        {/* Simulator Section */}
        <section id="simulator">
           <div className="mb-10 text-center md:text-left">
              <h2 className="text-2xl font-serif font-light text-white mb-2 tracking-wide uppercase">Engine Diagnostics</h2>
              <p className="text-text-dim text-sm max-w-2xl font-light italic">Configure synthesis parameters to observe real-time nanoparticle behavior and stability indexing.</p>
           </div>
           <SynthesisSimulator inputs={inputs} setInputs={setInputs} outputs={outputs} />
        </section>

        {/* Knowledge & AI Section */}
        <section id="expert" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
           <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-light text-white mb-6 tracking-wide uppercase">Core Intelligence</h2>
                <div className="prose prose-invert prose-sm">
                   <p className="text-text-dim leading-relaxed mb-6 font-light">
                     {EDUCATIONAL_CONTENT.whatIsIt}
                   </p>
                   <div className="bg-dark-800 rounded-lg border border-dark-border p-6 shadow-sm">
                      <h4 className="font-serif font-light flex items-center gap-2 mb-4 text-[#c0c0c8] uppercase text-sm tracking-widest">
                        <HelpCircle size={16} />
                        Mechanism Overview
                      </h4>
                      <p className="text-xs text-text-dim leading-6 italic font-light">
                        {EDUCATIONAL_CONTENT.howItWorks}
                      </p>
                   </div>
                </div>
              </div>

              <div>
                <h4 className="font-serif font-light text-white mb-4 uppercase text-sm tracking-widest">Industrial Applications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {EDUCATIONAL_CONTENT.applications.map((app, i) => (
                     <div key={i} className="flex items-center gap-3 p-3 bg-dark-sidebar border border-dark-border rounded text-[11px] font-light text-text-dim hover:border-accent-green/50 transition-colors">
                        <div className="w-1 h-1 bg-accent-green" />
                        {app}
                     </div>
                   ))}
                </div>
              </div>
           </div>

           <div className="sticky top-24">
             <div className="mb-6">
                <h2 className="text-2xl font-serif font-light text-white mb-2 tracking-wide uppercase">NanoBot Concierge</h2>
                <p className="text-text-dim text-xs font-light tracking-wide italic">Expert-level AI simulation support and theoretical guidance.</p>
             </div>
             <NanobotExpert currentInputs={inputs} />
           </div>
        </section>

        {/* Conclusion Section */}
        <section id="conclusion" className="relative py-24 mb-12">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block p-4 rounded-full bg-accent-green/5 border border-accent-green/10 text-accent-green"
            >
              <FlaskConical size={32} />
            </motion.div>
            <h2 className="text-4xl font-serif font-light text-text-bright tracking-tight">Synthesis Conclusion</h2>
            <p className="text-xl text-text-dim font-light leading-relaxed font-serif italic max-w-3xl mx-auto">
              "{EDUCATIONAL_CONTENT.conclusion}"
            </p>
            <div className="flex flex-wrap justify-center gap-12 pt-8">
               <div className="text-center group">
                  <p className="text-3xl font-serif text-accent-green group-hover:scale-110 transition-transform">100%</p>
                  <p className="text-[10px] text-text-dim uppercase tracking-[3px] mt-2">Biogenic Origin</p>
               </div>
               <div className="text-center group">
                  <p className="text-3xl font-serif text-accent-green group-hover:scale-110 transition-transform">Zero</p>
                  <p className="text-[10px] text-text-dim uppercase tracking-[3px] mt-2">Hazardous Waste</p>
               </div>
               <div className="text-center group">
                  <p className="text-3xl font-serif text-accent-green group-hover:scale-110 transition-transform">Eco</p>
                  <p className="text-[10px] text-text-dim uppercase tracking-[3px] mt-2">Validated Protocol</p>
               </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-dark-800 border-t border-dark-border mt-24 py-10 px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <h2 className="font-serif font-light text-lg tracking-wider text-[#c0c0c8] uppercase">
                SYNTHESYS <span className="font-sans font-thin opacity-30">| LAB</span>
              </h2>
            </div>
            <div className="flex items-center gap-8">
               <a href="#" className="text-text-dim hover:text-accent-green transition-colors"><Github size={18} /></a>
               <p className="text-text-dim text-[10px] font-light uppercase tracking-[2px]">© 2026 SYNTHESYS ENGINE. ENGINEERED PRECISION.</p>
            </div>
         </div>
      </footer>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-accent-green uppercase tracking-[2px] mb-1">{label}</p>
      <p className="text-white font-serif font-light text-sm">{value}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string, description: string }) {
  return (
    <div className="bg-dark-sidebar p-8 rounded-lg border border-dark-border shadow-sm hover:border-accent-green/30 transition-all group">
       <div className="w-10 h-10 rounded bg-dark-900 border border-dark-border flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
          {icon}
       </div>
       <h3 className="font-serif font-light text-lg text-white mb-3 tracking-wide">{title}</h3>
       <p className="text-text-dim text-xs font-light leading-relaxed">{description}</p>
    </div>
  );
}

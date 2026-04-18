import { useState, useMemo } from 'react';
import { SimulationInputs, SimulationOutputs, PlantType, MetalType } from '../types';
import { PLANT_PROPERTIES, METAL_PROPERTIES } from '../constants';

export function useSimulation() {
  const [inputs, setInputs] = useState<SimulationInputs>({
    plant: 'Green Tea',
    metal: 'Silver',
    temperature: 50,
    ph: 7,
    concentration: 1,
  });

  const outputs = useMemo<SimulationOutputs>(() => {
    const props = (PLANT_PROPERTIES as any)[inputs.plant] || { reducingPower: 0.75, baseSize: 25, efficiency: 0.8 };
    const metalProps = (METAL_PROPERTIES as any)[inputs.metal] || { potential: -2.0, atomicWeight: 0, baseColor: '#334155', lsprRange: 'None', group: 'Unknown' };
    
    // Size logic: Factors in metal reduction potential, temperature, pH, and concentration
    // T_Factor: Exponential decay (High T = Small size due to burst nucleation)
    const t_factor = Math.exp(-0.008 * (inputs.temperature - 25));
    
    // pH_Factor: High pH usually speeds up reduction -> smaller particles
    const ph_factor = 2 / (1 + Math.pow(1.15, inputs.ph - 4));
    
    // Conc_Factor: Logarithmic growth (Higher concentration = larger particles due to collision frequency)
    const conc_factor = 1 + 0.3 * Math.log10(inputs.concentration + 1);
    
    // Metal_Factor: Higher potential (Gold, Platinum) reduces more easily, forming smaller nuclei.
    const potential_factor = 1.5 / (metalProps.potential + 1.2);
    
    // Combine with plant's intrinsic base size and reducing power (stronger reducing power = smaller size)
    const size = props.baseSize * t_factor * ph_factor * conc_factor * potential_factor * (1.3 - props.reducingPower);

    // Synthesis feasibility logic
    // Metals with very high negative potential (Alkali, Earth Metals) are rarely synthesized in simple aqueous green protocols
    const canSynthesize = metalProps.potential > -0.8;
    const failureReason = !canSynthesize 
      ? `The standard reduction potential of ${inputs.metal} (${metalProps.potential}V) is too negative for spontaneous reduction using ${inputs.plant} polyphenols. This metal typically requires specialized non-aqueous or strong chemical reductants.` 
      : undefined;

    // Reaction rate: Arrhenius-inspired model factoring in pH activation and metal potential
    const rate_t = Math.exp(0.015 * (inputs.temperature - 20));
    const rate_ph = 1 + (inputs.ph - 7) * 0.1;
    const rate = canSynthesize 
      ? Math.min(100, (rate_t * rate_ph * props.reducingPower * Math.sqrt(metalProps.potential + 1)) * 15) 
      : 0;

    // Stability: Modeled around Zeta Potential optimization (typically around pH 8-9 for biogenic NPs)
    // Nobler metals form more stable cores.
    const phScale = 100 - Math.pow(Math.abs(inputs.ph - 8.8), 2) * 1.5;
    const metalScale = (metalProps.potential + 0.5) * 25;
    const stability = canSynthesize ? Math.min(100, (phScale + metalScale) * props.efficiency) : 0;

    // Yield: Depends on concentration and conversion efficiency at given T
    const conversion_efficiency = (inputs.temperature / 100) * props.efficiency;
    const yieldPerc = canSynthesize ? Math.min(99.5, (inputs.concentration * 5 + 20) * conversion_efficiency * 2) : 0;

    // Eco Score: Penalizes heating and extreme pH adjustments
    const energyPenalty = Math.pow(Math.max(0, inputs.temperature - 25), 1.2) * 0.15;
    const phPenalty = Math.pow(Math.abs(inputs.ph - 7), 1.5) * 3;
    const ecoValue = Math.max(0, 100 - energyPenalty - phPenalty);

    // Color determination based on metal
    let color = canSynthesize ? metalProps.baseColor : '#334155';
    if (canSynthesize && inputs.metal === 'Silver') {
      if (size < 20) color = '#fef08a'; // Yellow
      else if (size < 40) color = '#fbbf24'; // Amber
      else if (size < 60) color = '#d97706'; // Brown
      else color = '#451a03'; // Dark Brown
    } else if (canSynthesize && inputs.metal === 'Gold') {
      if (size < 20) color = '#ef4444'; // Red
      else if (size < 40) color = '#991b1b'; // Ruby
      else if (size < 60) color = '#4c0519'; // Purple
      else color = '#1e1b4b'; // Deep Indigo
    }

    // Quality
    let quality: SimulationOutputs['quality'] = 'Medium';
    if (!canSynthesize) quality = 'Failure';
    else if (stability > 85 && size < 30) quality = 'Premium';
    else if (stability > 70 && size < 50) quality = 'High';
    else if (stability < 40) quality = 'Low';

    return {
      particleSize: canSynthesize ? Number(size.toFixed(2)) : 0,
      reactionRate: Number(rate.toFixed(1)),
      stabilityIndex: Number(stability.toFixed(1)),
      yieldPercentage: Number(yieldPerc.toFixed(1)),
      ecoScore: Number(ecoValue.toFixed(0)),
      color,
      quality,
      canSynthesize,
      failureReason,
    };
  }, [inputs]);

  return { inputs, setInputs, outputs };
}


export type PlantType = string;

export type MetalType = string;

export interface SimulationInputs {
  plant: PlantType;
  metal: MetalType;
  temperature: number; // in Celsius
  ph: number;
  concentration: number; // in mM
}

export interface SimulationOutputs {
  particleSize: number; // in nm
  reactionRate: number; // arbitrary scale 0-100
  stabilityIndex: number; // arbitrary scale 0-100
  yieldPercentage: number;
  ecoScore: number; // 0-100
  color: string;
  quality: 'Low' | 'Medium' | 'High' | 'Premium' | 'Failure';
  canSynthesize: boolean;
  failureReason?: string;
}

export interface DataPoint {
  temperature?: number;
  ph?: number;
  size?: number;
  concentration?: number;
}

// src/lib/breathing/types.ts

export type TimerPattern = 'Incremental' | 'Decremental';

export interface BreathingAction {
  instruction: string;
  interval: number;
  timerPattern: TimerPattern;
  sound?: string;
  image?: string;
  description?: string;
}

export interface BreathingProgram {
  name: string;
  slug: string;
  origin: string;
  description: string;
  totalCycles: number;
  actions: BreathingAction[];
}
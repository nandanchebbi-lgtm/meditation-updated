export type TimerPattern = "Incremental" | "Decremental";

export interface BreathingAction {
  instruction: string;
  interval: number;
  timerPattern: TimerPattern;
  description?: string;
  sound?: string;
  image?: string;

  // ✅ NEW — Rive animation for this step
  rive?: string;
}

export interface BreathingProgram {
  name: string;
  slug: string;
  origin?: string;
  description?: string;
  totalCycles: number;
  actions: BreathingAction[];
}
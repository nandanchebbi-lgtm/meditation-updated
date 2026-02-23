import { writable } from 'svelte/store';

export type Screen =
  | 'splash'
  | 'conversation'
  | 'prep'
  | 'breathing'
  | 'safeHarbour'
  | 'completed';

export const currentScreen = writable<Screen>('splash');
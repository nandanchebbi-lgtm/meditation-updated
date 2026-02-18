import { writable } from 'svelte/store';

export type Screen =
  | 'splash'
  | 'conversation'
  | 'prep'
  | 'breathing';

export const currentScreen = writable<Screen>('splash');
// src/lib/breathing/programs.ts

import type { BreathingProgram } from './types';

export const BREATHING_PROGRAMS: BreathingProgram[] = [
  {
    name: "4-7-8 Breathing",
    slug: "4-7-8-breathing",
    origin: "Pranayama",
    description:
      "A powerful relaxation technique using a 4-7-8 rhythm to calm the nervous system and support sleep.",
    totalCycles: 4,
    actions: [
      {
        instruction: "Inhale deeply through your nose",
        interval: 4,
        timerPattern: "Incremental",
        description: "Inhale smoothly for 4 seconds",
        sound: "inhale.mp3",
        image: "/images/inhale.png"
      },
      {
        instruction: "Hold your breath",
        interval: 7,
        timerPattern: "Decremental",
        description: "Hold gently for 7 seconds",
        sound: "hold-7secs.mp3",
        image: "/images/hold.png"
      },
      {
        instruction: "Exhale slowly through your mouth",
        interval: 8,
        timerPattern: "Decremental",
        description: "Exhale slowly for 8 seconds",
        sound: "exhale-8secs.mp3",
        image: "/images/exhale.png"
      }
    ]
  },

  {
    name: "Balancing Breath",
    slug: "balancing-breath",
    origin: "Pranayama",
    description:
      "Equal-ratio breathing to restore balance and regulate stress.",
    totalCycles: 6,
    actions: [
      {
        instruction: "Inhale deeply",
        interval: 4,
        timerPattern: "Incremental",
        sound: "inhale.mp3",
        image: "/images/inhale.png"
      },
      {
        instruction: "Exhale gently",
        interval: 4,
        timerPattern: "Decremental",
        sound: "exhale.mp3",
        image: "/images/exhale.png"
      }
    ]
  }
];
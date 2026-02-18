<script lang="ts">
  import { onDestroy } from 'svelte';
  import Face from './Face.svelte';
  import { BREATHING_PROGRAMS } from '$lib/breathing/programs';
  import type { BreathingProgram } from '$lib/breathing/types';

  export let programSlug = '4-7-8-breathing';

  let state: 'idle' | 'playing' | 'paused' | 'completed' = 'idle';
  let actionIndex = 0;
  let elapsed = 0;
  let cycles = 0;
  let interval: ReturnType<typeof setInterval> | null = null;

  // Safe program lookup
  $: program = BREATHING_PROGRAMS.find(
    (p) => p.slug === programSlug
  ) as BreathingProgram;

  $: currentAction = program?.actions[actionIndex];

  // Extract image safely
  $: currentImage = currentAction?.image;

  // Handle decremental timers
  $: displayTime =
    currentAction?.timerPattern === 'Decremental'
      ? Math.max(currentAction.interval - elapsed, 0)
      : elapsed;

  function playSound(file?: string) {
    if (!file) return;
    const audio = new Audio(`/sounds/${file}`);
    audio.play().catch(() => {});
  }

  function startSession() {
    if (!currentAction) return;

    state = 'playing';
    actionIndex = 0;
    elapsed = 0;
    cycles = 0;

    playSound(currentAction.sound);
    runTimer();
  }

  function pauseSession() {
    state = 'paused';
  }

  function resumeSession() {
    state = 'playing';
  }

  function restartSession() {
    clearTimer();
    state = 'idle';
    actionIndex = 0;
    elapsed = 0;
    cycles = 0;
  }

  function runTimer() {
    clearTimer();

    interval = setInterval(() => {
      if (state !== 'playing' || !currentAction) return;

      elapsed += 1;

      if (elapsed >= currentAction.interval) {
        nextAction();
      }
    }, 1000);
  }

  function nextAction() {
    if (!program) return;

    elapsed = 0;
    actionIndex++;

    if (actionIndex >= program.actions.length) {
      actionIndex = 0;
      cycles++;

      if (cycles >= program.totalCycles) {
        completeSession();
        return;
      }
    }

    playSound(program.actions[actionIndex].sound);
  }

  function completeSession() {
    clearTimer();
    state = 'completed';
  }

  function clearTimer() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  onDestroy(clearTimer);
</script>

{#if currentAction}
  <Face
    state={state}
    elapsedTime={displayTime}
    totalDuration={currentAction.interval}
    instruction={currentAction.instruction}
    image={currentImage}
    showFaceUI={true}
    cycleText={state === 'playing' || state === 'paused' ? `Cycle ${cycles + 1} of ${program.totalCycles}` : ''}
    on:start={startSession}
    on:pause={pauseSession}
    on:resume={resumeSession}
    on:restart={restartSession}
  />
{/if}
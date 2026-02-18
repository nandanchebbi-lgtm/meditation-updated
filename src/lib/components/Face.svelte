<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  export let elapsedTime: number = 0;
  export let totalDuration: number = 15;
  export let instruction: string = '';
  export let state: 'idle' | 'playing' | 'paused' | 'completed' = 'idle';
  export let image: string | undefined = undefined;
  export let showFaceUI: boolean = true;
  export let cycleText: string = '';

  const dispatch = createEventDispatcher();

  const size = 580;
  const strokeWidth = 20;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  $: progress =
    totalDuration > 0
      ? Math.min(elapsedTime / totalDuration, 1)
      : 0;

  $: dashOffset = circumference * (1 - progress);

  // Remaining seconds shown in the circle
  $: displaySeconds = Math.max(totalDuration - elapsedTime, 0);

  function activate() {
    if (state === 'idle') dispatch('start');
    else if (state === 'playing') dispatch('pause');
    else if (state === 'paused') dispatch('resume');
    else if (state === 'completed') dispatch('restart');
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate();
    }
  }
</script>

<div
  class="face"
  role="button"
  tabindex="0"
  aria-label="Meditation control"
  on:click={activate}
  on:keydown={handleKeydown}
>

  <!-- Black Circle -->
  <div class="circle"></div>

  <!-- Progress Ring -->
  <svg width={size} height={size} class="ring">
    <circle cx={size / 2} cy={size / 2} r={radius} class="bg" />
    <circle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      class="progress"
      style="stroke-dasharray:{circumference};stroke-dashoffset:{dashOffset};"
    />
  </svg>

  {#if showFaceUI}
    <div class="inner">

      {#if state === 'idle'}
        <div class="message">Tap to begin</div>
        <div class="sub">Press space or enter to start</div>

      {:else if state === 'playing'}
        {#if instruction}
          <div class="instruction" in:fade={{ duration: 200 }}>{instruction}</div>
        {/if}

        <!-- Large countdown number -->
        <div class="timer" in:fade={{ duration: 100 }}>{displaySeconds}</div>

        {#if cycleText}
          <div class="cycle">{cycleText}</div>
        {/if}

      {:else if state === 'paused'}
        <div class="message">Paused</div>
        <div class="sub">Tap to continue</div>

      {:else if state === 'completed'}
        <div class="message">Session complete</div>
        <div class="sub">Tap to restart</div>
      {/if}

    </div>
  {/if}

</div>

<style>
.face {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 580px;
  height: 580px;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
}

.face:focus-visible {
  box-shadow: 0 0 0 4px rgba(127, 156, 245, 0.5);
  border-radius: 50%;
}

.circle {
  position: absolute;
  width: 540px;
  height: 540px;
  border-radius: 50%;
  background: #111;
}

.ring { position: absolute; }

.bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 20;
}

.progress {
  fill: none;
  stroke: #7f9cf5;
  stroke-width: 20;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset 0.8s linear;
}

.inner {
  position: absolute;
  width: 380px;
  height: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  pointer-events: none;
  gap: 8px;
}

.instruction {
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: rgba(255,255,255,0.85);
}

.timer {
  font-size: 5rem;
  font-weight: 200;
  line-height: 1;
  letter-spacing: -0.04em;
  color: white;
}

.cycle {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.45);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 4px;
}

.message {
  font-size: 1.3rem;
  font-weight: 400;
  color: white;
}

.sub {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.05em;
}
</style>

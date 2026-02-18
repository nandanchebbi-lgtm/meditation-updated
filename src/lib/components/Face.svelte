<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  export let elapsedTime: number = 0;
  export let totalDuration: number = 15;
  export let instruction: string = '';
  export let state: 'idle' | 'playing' | 'paused' | 'completed' = 'idle';
  export let image: string | undefined = undefined;
  export let showFaceUI: boolean = true;

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

  function activate() {
    if (state === 'idle') dispatch('start');
    else if (state === 'playing') dispatch('pause');
    else if (state === 'paused') dispatch('resume');
    else if (state === 'completed') dispatch('restart');
  }

  // Keyboard support (Enter / Space)
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
    <circle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      class="bg"
    />
    <circle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      class="progress"
      style="
        stroke-dasharray:{circumference};
        stroke-dashoffset:{dashOffset};
      "
    />
  </svg>

  <!-- Optional Inner UI -->
  {#if showFaceUI}
    <div class="inner">

      {#if state === 'idle'}
        <div class="message">Tap when you’re ready 💛</div>
      {/if}

      {#if state === 'playing'}
        {#if image}
          <img
            src={image}
            alt={instruction}
            class="image"
            in:fade={{ duration: 200 }}
            out:fade={{ duration: 150 }}
          />
        {/if}

        {#if instruction}
          <div class="instruction">{instruction}</div>
        {/if}
      {/if}

      {#if state === 'paused'}
        <div class="message">Paused 🌬️</div>
      {/if}

      {#if state === 'completed'}
        <div class="message">Session complete ✨ Tap to restart</div>
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

/* focus ring for keyboard users */
.face:focus-visible {
  box-shadow: 0 0 0 4px rgba(127, 156, 245, 0.5);
  border-radius: 50%;
}

.circle {
  position: absolute;
  width: 540px;
  height: 540px;
  border-radius: 50%;
  background: black;
}

.ring {
  position: absolute;
}

.bg {
  fill: none;
  stroke: rgba(0, 0, 0, 0.1);
  stroke-width: 20;
}

.progress {
  fill: none;
  stroke: #7f9cf5;
  stroke-width: 20;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset 0.2s linear;
}

.inner {
  position: absolute;
  width: 360px;
  height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  pointer-events: none;
}

.image {
  width: 150px;
  margin-bottom: 12px;
}

.instruction {
  font-size: 1.1rem;
  font-weight: 500;
}

.message {
  font-size: 1.2rem;
  font-weight: 600;
}
</style>
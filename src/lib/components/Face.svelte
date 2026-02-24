<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";

  export let elapsedTime: number = 0;
  export let totalDuration: number = 15;
  export let instruction: string = "";
  export let state: "idle" | "playing" | "paused" | "completed" = "idle";
  export let riveSrc: string | undefined = undefined;
  export let showFaceUI: boolean = true;
  export let cycleText: string = "";

  export let mode: "breathing" | "celebration-explosion" | "celebration-loop" =
    "breathing";

  const dispatch = createEventDispatcher();

  let canvas: HTMLCanvasElement | null = null;
  let riveInstance: any = null;

  async function loadRive() {
    if (!browser || !canvas || !riveSrc) return;

    const rivePkg = await import("@rive-app/canvas");
    const { Rive, Layout, Fit, Alignment } = rivePkg;

    riveInstance?.cleanup?.();

    riveInstance = new Rive({
      src: riveSrc,
      canvas,
      autoplay: true,
      layout: new Layout({
        fit: Fit.Cover, // 🔥 ensures full circular coverage
        alignment: Alignment.Center
      }),
      onLoad: () => {
        riveInstance.resizeDrawingSurfaceToCanvas();
      }
    });
  }

  onMount(loadRive);
  $: if (riveSrc && canvas) loadRive();
  onDestroy(() => riveInstance?.cleanup?.());

  /* ---------------- PROGRESS RING ---------------- */

  const size = 580;
  const strokeWidth = 20;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  $: progress =
    totalDuration > 0
      ? Math.min(elapsedTime / totalDuration, 1)
      : 0;

  $: dashOffset = circumference * (1 - progress);
  $: displaySeconds = Math.max(totalDuration - elapsedTime, 0);

  /* ---------------- INTERACTION ---------------- */

  function activate() {
    if (mode !== "breathing") return;

    if (state === "idle") dispatch("start");
    else if (state === "playing") dispatch("pause");
    else if (state === "paused") dispatch("resume");
    else if (state === "completed") dispatch("restart");
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
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
  <!-- Outer Black Circle -->
  <div class="circle"></div>

  <!-- Rive Animation -->
  {#if riveSrc}
    <div class="riveWrapper">
      <canvas bind:this={canvas}></canvas>
    </div>
  {/if}

  <!-- Progress Ring (Breathing Only) -->
  {#if mode === "breathing"}
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
  {/if}

  <!-- Inner Content -->
  {#if showFaceUI}
    <div class="inner">

      <!-- 🔥 Custom Slot Content -->
      <slot />

      <!-- Default Breathing UI (if no slot provided) -->
      {#if !$$slots.default && mode === "breathing"}

        {#if state === "idle"}
          <div class="message">Tap to begin</div>
          <div class="sub">Press space or enter to start</div>

        {:else if state === "playing"}
          {#if instruction}
            <div class="instruction" in:fade={{ duration: 200 }}>
              {instruction}
            </div>
          {/if}

          <div class="timer" in:fade={{ duration: 100 }}>
            {displaySeconds}
          </div>

          {#if cycleText}
            <div class="cycle">{cycleText}</div>
          {/if}

        {:else if state === "paused"}
          <div class="message">Paused</div>
          <div class="sub">Tap to continue</div>

        {:else if state === "completed"}
          <div class="message">Session complete</div>
          <div class="sub">Tap to restart</div>
        {/if}

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
  outline: none;
}

/* Black Inner Circle */
.circle {
  position: absolute;
  width: 540px;
  height: 540px;
  border-radius: 50%;
  background: #111;
}

/* 🔥 Rive Now Fills Entire Circle */
.riveWrapper {
  position: absolute;
  width: 540px;   /* match .circle */
  height: 540px;  /* match .circle */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden; /* keeps it circular */
}

.riveWrapper canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* Progress Ring */
.ring {
  position: absolute;
}

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

/* Inner Content */
.inner {
  position: absolute;
  width: 380px;
  height: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  gap: 16px;
  pointer-events: none;
}

.timer {
  font-size: 5rem;
  font-weight: 200;
}

.message {
  font-size: 1.4rem;
}

.sub {
  font-size: 0.85rem;
  opacity: 0.6;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

button {
  padding: 12px 28px;
  border-radius: 999px;
  background: black;
  color: white;
  border: none;
  cursor: pointer;
  pointer-events: auto;
}
</style>
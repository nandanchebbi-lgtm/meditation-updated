<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { currentScreen } from '$lib/stores/appStore';
  import { sendCommand, agentTranscript, agentStatus } from '$lib/services/livekit';
  import { browser } from '$app/environment';

  let canvas: HTMLCanvasElement;
  let rive: any;

  // Local reactive copies of stores
  let transcript: string = '';
  let status: 'waiting' | 'speaking' | 'listening' = 'waiting';

  // Subscribe to stores with proper types
  const unsubscribeTranscript = agentTranscript.subscribe((value: string) => {
    transcript = value;
  });

  const unsubscribeStatus = agentStatus.subscribe((value: 'waiting' | 'speaking' | 'listening') => {
    status = value;
  });

  onMount(async () => {
    sendCommand('start_prep');

    if (!browser) return;

    const riveModule = await import('@rive-app/canvas');
    const { Rive } = riveModule;

    rive = new Rive({
      src: '/narrative_screen_.riv',
      canvas,
      autoplay: true,
      onLoad: () => {
        rive.resizeDrawingSurfaceToCanvas(); // center & scale
      }
    });

    const handleResize = () => rive?.resizeDrawingSurfaceToCanvas();
    window.addEventListener('resize', handleResize);

    onDestroy(() => {
      window.removeEventListener('resize', handleResize);
    });
  });

  onDestroy(() => {
    rive?.cleanup();
    rive = null;
    unsubscribeTranscript();
    unsubscribeStatus();
  });

  function startBreathing() {
    sendCommand('start_breathing');
    currentScreen.set('breathing');
  }

  const statusLabel: Record<'waiting' | 'speaking' | 'listening', string> = {
    waiting: 'Guide is preparing...',
    speaking: 'Guide is speaking',
    listening: 'Your turn to speak'
  };
</script>

<div class="screen">
  <div class="circle">
    <!-- Rive animation canvas -->
    <canvas bind:this={canvas} class="rive-bg"></canvas>

    <!-- Overlay content -->
    <div class="content">
      <p class="title">Your session</p>

      <div class="badge {status}">
        <span class="dot {status === 'speaking' ? 'pulse' : ''}"></span>
        {statusLabel[status]}
      </div>

      {#if status === 'speaking'}
        <div class="wave">
          {#each Array(5) as _, i}
            <span class="bar" style="animation-delay:{i * 0.1}s"></span>
          {/each}
        </div>
      {/if}

      <div class="transcript">
        {#if transcript}
          <p>"{transcript}"</p>
        {:else}
          <p class="muted">Your guide will explain the exercise shortly...</p>
        {/if}
      </div>

      {#if status === 'speaking' || status === 'listening'}
        <button on:click={startBreathing}>Start breathing exercise</button>
      {/if}
    </div>
  </div>
</div>

<style>
  .screen {
    display:flex; 
    align-items:center; 
    justify-content:center; 
    height:100vh;
  }

  .circle {
    position: relative;
    width: 580px;
    height: 580px;
    border-radius: 50%;
    overflow: hidden;
    background: #111;
  }

  .rive-bg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .content {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    text-align: center;
    padding: 40px;
  }

  .title {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #999;
    margin: 0 0 16px;
  }

  .badge {
    display:flex; 
    align-items:center; 
    gap:8px; 
    padding:6px 16px; 
    border-radius:999px; 
    font-size:0.85rem; 
    font-weight:500; 
    background:#f0f0f0; 
    color:#444;
    margin-bottom: 16px;
  }
  .badge.speaking { background:#e8f5e9; color:#2e7d32; }
  .badge.listening { background:#e3f2fd; color:#1565c0; }
  .badge.waiting { background:#fff8e1; color:#f57f17; }

  .dot { width:8px;height:8px;border-radius:50%;background:currentColor; }
  .dot.pulse { animation:blink 1s infinite; }
  @keyframes blink { 0%,100%{opacity:1}50%{opacity:.3} }

  .wave { display:flex;gap:4px;height:36px;margin-bottom:16px; }
  .bar { width:4px;border-radius:2px;background:#2e7d32;animation:wave .8s infinite alternate; }
  .bar:nth-child(1){height:12px}
  .bar:nth-child(2){height:24px}
  .bar:nth-child(3){height:36px}
  .bar:nth-child(4){height:24px}
  .bar:nth-child(5){height:12px}
  @keyframes wave { from{transform:scaleY(.4)} to{transform:scaleY(1)} }

  .transcript { min-height:60px;font-size:1rem;line-height:1.6;color:#fff;margin-bottom:16px; }
  .transcript .muted { color:#aaa;font-style:italic;font-size:.9rem; }

  button {
    padding:12px 32px;
    font-size:15px;
    border:none;
    border-radius:999px;
    background:#fff;
    color:#111;
    cursor:pointer;
    letter-spacing:0.05em;
    transition:opacity 0.2s ease;
  }
  button:hover { opacity:0.9; }
</style>
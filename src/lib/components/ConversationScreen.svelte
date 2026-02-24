<script lang="ts">
  import { currentScreen } from '$lib/stores/appStore';
  import { agentTranscript, agentStatus } from '$lib/services/livekit';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  let canvas: HTMLCanvasElement;
  let rive: any;

  onMount(async () => {
    if (!browser) return;

    const riveModule = await import('@rive-app/canvas');
    const { Rive } = riveModule;

    rive = new Rive({
      src: '/narrative_screen_.riv', // same as before
      canvas,
      autoplay: true,
      onLoad: () => {
        rive.resizeDrawingSurfaceToCanvas(); // ✅ properly scale & center
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
  });

  function next() {
    currentScreen.set('prep');
  }

  const statusLabel: Record<string, string> = {
    waiting: 'Guide is preparing...',
    speaking: 'Guide is speaking',
    listening: 'Your turn to speak'
  };

  const statusHint: Record<string, string> = {
    waiting: 'Audio is generating — this takes a few seconds.',
    speaking: 'Listen to your guide. Press Continue when ready.',
    listening: 'The guide is listening to you.'
  };
</script>

<div class="screen">
  <!-- Rive Background -->
  <div class="circle">
    <canvas bind:this={canvas} class="rive-bg"></canvas>

    <div class="content">
      <div class="badge {$agentStatus}">
        <span class="dot { $agentStatus === 'speaking' ? 'pulse' : '' }"></span>
        {statusLabel[$agentStatus] ?? 'Connecting...'}
      </div>

      {#if $agentStatus === 'speaking'}
        <div class="wave">
          {#each Array(5) as _, i}
            <span class="bar" style="animation-delay:{i * 0.1}s"></span>
          {/each}
        </div>
      {/if}

      <div class="transcript">
        {#if $agentTranscript}
          <p>"{$agentTranscript}"</p>
        {:else}
          <p class="muted">{statusHint[$agentStatus]}</p>
        {/if}
      </div>

      {#if $agentStatus === 'speaking' || $agentStatus === 'listening'}
        <button on:click={next}>Continue →</button>
      {/if}
    </div>
  </div>
</div>

<style>
  .screen { display:flex; align-items:center; justify-content:center; height:100vh; }
  .circle {
    position: relative;
    width: 580px;
    height: 580px;
    border-radius:50%;
    overflow:hidden;
    background:#111;
  }
  .rive-bg { width:100%; height:100%; display:block; }
  .content {
    position:absolute;
    inset:0;
    z-index:2;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    color:white;
    text-align:center;
    padding:40px;
  }

  /* Badge, wave, transcript, button styles same as before */
  .badge { display:flex; align-items:center; gap:8px; padding:6px 16px; border-radius:999px; font-size:0.85rem; font-weight:500; background:#f0f0f0; color:#444; }
  .badge.speaking{ background:#e8f5e9; color:#2e7d32;}
  .badge.listening{ background:#e3f2fd; color:#1565c0;}
  .badge.waiting{ background:#fff8e1; color:#f57f17;}
  .dot{ width:8px;height:8px;border-radius:50%;background:currentColor;}
  .dot.pulse{animation:blink 1s infinite;}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  .wave{display:flex;gap:4px;height:36px}
  .bar{width:4px;border-radius:2px;background:#2e7d32;animation:wave .8s infinite alternate}
  .bar:nth-child(1){height:12px}
  .bar:nth-child(2){height:24px}
  .bar:nth-child(3){height:36px}
  .bar:nth-child(4){height:24px}
  .bar:nth-child(5){height:12px}
  @keyframes wave{from{transform:scaleY(.4)}to{transform:scaleY(1)}}
  .transcript{min-height:60px;font-size:1rem;line-height:1.6;color:#fff}
  .transcript .muted{color:#aaa;font-style:italic;font-size:.9rem}
  button{padding:12px 32px;font-size:15px;border:none;border-radius:999px;background:#fff;color:#111;cursor:pointer}
  button:hover{opacity:0.9;}
</style>
<script lang="ts">
  import { currentScreen } from '$lib/stores/appStore';
  import { browser } from '$app/environment';
  import { onMount, onDestroy } from 'svelte';

  let step = '';
  let errorMessage = '';
  let loading = false;

  let canvas: HTMLCanvasElement;
  let rive: any;

  onMount(async () => {
    if (!browser) return;

    const riveModule = await import('@rive-app/canvas');
    const { Rive } = riveModule;

    rive = new Rive({
      src: '/boot_up.riv',
      canvas,
      autoplay: true,
      onLoad: () => {
        // ✅ This properly centers & scales in latest Rive runtime
        rive.resizeDrawingSurfaceToCanvas();
      }
    });

    // Optional: handle window resize
    const handleResize = () => {
      rive?.resizeDrawingSurfaceToCanvas();
    };

    window.addEventListener('resize', handleResize);

    onDestroy(() => {
      window.removeEventListener('resize', handleResize);
    });
  });

  onDestroy(() => {
    if (rive) {
      rive.cleanup();
      rive = null;
    }
  });

  async function start(): Promise<void> {
    if (!browser) return;

    loading = true;
    errorMessage = '';

    try {
      const { connectToRoom } = await import('$lib/services/livekit');

      step = 'Fetching session token...';
      const res = await fetch('/api/livekit-token', { method: 'POST' });

      if (!res.ok) throw new Error(`Token request failed (${res.status})`);

      const { token, url } = await res.json();
      if (!token || !url) throw new Error('Invalid token response');

      step = 'Joining room...';
      await connectToRoom(token, url);

      step = 'Waiting for guide to arrive...';
      await new Promise((r) => setTimeout(r, 800));

      currentScreen.set('conversation');
    } catch (err) {
      console.error(err);
      errorMessage = 'Unable to start session. Please try again.';
      step = '';
    } finally {
      loading = false;
    }
  }
</script>

<div class="screen">
  <div class="circle">
    <canvas bind:this={canvas} class="rive-bg"></canvas>

    <div class="content">
      <h1>WELCOME</h1>
      <p class="subtitle">Your guided meditation session</p>

      {#if errorMessage}
        <p class="error">{errorMessage}</p>
      {/if}

      {#if loading}
        <div class="step-row">
          <span class="spinner"></span>
          <span class="step-text">{step}</span>
        </div>
      {:else}
        <button on:click={start}>BEGIN</button>
      {/if}
    </div>
  </div>
</div>

<style>
  .screen {
    position: relative;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: black;
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

  h1 {
    font-size: 2rem;
    font-weight: 300;
    letter-spacing: 0.15em;
    margin-bottom: 10px;
  }

  .subtitle {
    color: #aaa;
    margin-bottom: 40px;
    font-size: 0.95rem;
  }

  button {
    padding: 14px 36px;
    font-size: 14px;
    border: none;
    border-radius: 999px;
    background: white;
    color: black;
    cursor: pointer;
    letter-spacing: 0.1em;
    transition: opacity 0.2s ease;
  }

  button:hover {
    opacity: 0.9;
  }

  .step-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #ccc;
    font-size: 0.9rem;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #555;
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error {
    color: #e74c3c;
    margin-bottom: 16px;
    font-size: 0.9rem;
  }
</style>
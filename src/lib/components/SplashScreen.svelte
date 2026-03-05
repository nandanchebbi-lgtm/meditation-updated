<script lang="ts">
  import { currentScreen } from '$lib/stores/appStore';
  import { browser } from '$app/environment';
  import { onMount, onDestroy } from 'svelte';
  import { sendCommand } from '$lib/services/nats';

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
        rive.resizeDrawingSurfaceToCanvas();
      }
    });

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

      // 🚀 SEND NATS COMMAND
      await sendCommand('start_prep');

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
      <p class="subtitle"></p>

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
/* same styles unchanged */
</style>
<script lang="ts">
  import { currentScreen } from '$lib/stores/appStore';
  import { browser } from '$app/environment';

  let loading = false;
  let errorMessage = '';

  async function start(): Promise<void> {
    if (!browser) return;

    loading = true;
    errorMessage = '';

    try {
      // Dynamic import avoids SSR issues
      const { connectToRoom } = await import('$lib/services/livekit');

      // MUST be POST (matches +server.ts)
      const res = await fetch('/api/livekit-token', {
        method: 'POST'
      });

      if (!res.ok) {
        throw new Error(`Failed to get LiveKit token (${res.status})`);
      }

      const { token, url } = await res.json();

      if (!token || !url) {
        throw new Error('Invalid token response');
      }

      await connectToRoom(token, url);

      currentScreen.set('conversation');
    } catch (err) {
      console.error(err);
      errorMessage = 'Unable to start session. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="screen">
  <h1>Welcome</h1>

  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}

  <button on:click={start} disabled={loading}>
    {loading ? 'Connecting…' : 'Begin'}
  </button>
</div>

<style>
  .screen {
    text-align: center;
    margin-top: 120px;
  }

  button {
    padding: 12px 24px;
    font-size: 16px;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error {
    color: red;
    margin-bottom: 12px;
  }
</style>
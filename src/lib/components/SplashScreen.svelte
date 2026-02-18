<script lang="ts">
  import { currentScreen } from '$lib/stores/appStore';
  import { browser } from '$app/environment';

  let step = '';
  let errorMessage = '';
  let loading = false;

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
      // Small pause so the user can see the step
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
  <h1>Welcome</h1>
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
    <button on:click={start}>Begin</button>
  {/if}
</div>

<style>
  .screen {
    text-align: center;
    margin-top: 120px;
  }

  h1 {
    font-size: 2rem;
    font-weight: 300;
    margin-bottom: 8px;
  }

  .subtitle {
    color: #888;
    margin-bottom: 40px;
    font-size: 0.95rem;
  }

  button {
    padding: 14px 36px;
    font-size: 16px;
    border: none;
    border-radius: 999px;
    background: #111;
    color: white;
    cursor: pointer;
    letter-spacing: 0.05em;
  }

  button:hover { background: #333; }

  .step-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #555;
    font-size: 0.9rem;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #ccc;
    border-top-color: #333;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error {
    color: #c0392b;
    margin-bottom: 16px;
    font-size: 0.9rem;
  }
</style>

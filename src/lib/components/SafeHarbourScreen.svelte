<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { currentScreen } from '$lib/stores/appStore';
  import { sendCommand, agentTranscript, agentStatus } from '$lib/services/livekit';

  let autoTimer: ReturnType<typeof setTimeout> | null = null;

  onMount(() => {
    sendCommand('safe_harbour');
  });

  $: if ($agentStatus === 'waiting' && $agentTranscript && !autoTimer) {
    autoTimer = setTimeout(() => {
      currentScreen.set('completed');
    }, 4000);
  }

  function continueFlow() {
    if (autoTimer) {
      clearTimeout(autoTimer);
      autoTimer = null;
    }
    currentScreen.set('completed');
  }

  onDestroy(() => {
    if (autoTimer) clearTimeout(autoTimer);
  });
</script>

<div class="screen">
  <h2>Safe Harbour</h2>

  {#if $agentTranscript}
    <p class="message">{$agentTranscript}</p>
  {:else}
    <p class="muted">Take a moment to return gently.</p>
  {/if}

  <button on:click={continueFlow}>
    Continue
  </button>
</div>

<style>
.screen {
  text-align: center;
  max-width: 480px;
  margin: 120px auto;
  padding: 0 20px;
}

.message {
  font-size: 1.15rem;
  line-height: 1.8;
}

.muted {
  color: #999;
}

button {
  margin-top: 50px;
  padding: 12px 32px;
  border-radius: 999px;
  background: #111;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
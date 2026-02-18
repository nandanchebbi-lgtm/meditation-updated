<script lang="ts">
  import { onMount } from 'svelte';
  import { currentScreen } from '$lib/stores/appStore';
  import { sendCommand, agentTranscript } from '$lib/services/livekit';

  onMount(() => {
    sendCommand('start_prep');
  });

  function startBreathing(): void {
    sendCommand('start_breathing');
    currentScreen.set('breathing');
  }
</script>

<div class="screen">
  <h2>{$agentTranscript || 'Preparing...'}</h2>
  <button on:click={startBreathing}>Start</button>
</div>

<style>
.screen {
  text-align: center;
}
</style>
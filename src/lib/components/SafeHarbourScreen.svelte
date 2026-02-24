<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { currentScreen } from '$lib/stores/appStore';
  import { sendCommand, agentTranscript, agentStatus } from '$lib/services/livekit';
  import Face from '$lib/components/Face.svelte';

  let autoTimer: ReturnType<typeof setTimeout> | null = null;

  onMount(() => {
    sendCommand('safe_harbour');
  });

  // When agent finishes speaking → trigger explosion delay → go to completed
  $: if ($agentStatus === 'waiting' && $agentTranscript && !autoTimer) {
    autoTimer = setTimeout(() => {
      currentScreen.set('completed');
    }, 3500); // matches explosion duration
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

<div class="wrapper">

  <!-- 🎉 Confetti Explosion Inside Face -->
  <Face
    mode="celebration-explosion"
    state="completed"
    riveSrc="/confetti-explosion.riv"
    showFaceUI={true}
  />

  <!-- Transcript + Continue -->
  <div class="content">
    {#if $agentTranscript}
      <p class="message">{$agentTranscript}</p>
    {:else}
      <p class="muted">Take a moment to return gently.</p>
    {/if}

    <button on:click={continueFlow}>
      Continue
    </button>
  </div>

</div>

<style>
.wrapper {
  position: relative;
  height: 100vh;
}

.content {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  max-width: 480px;
  padding: 0 20px;
}

.message {
  font-size: 1.15rem;
  line-height: 1.8;
  margin-bottom: 32px;
}

.muted {
  color: #999;
  margin-bottom: 32px;
}

button {
  padding: 12px 32px;
  border-radius: 999px;
  background: #111;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
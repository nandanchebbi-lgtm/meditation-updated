<script lang="ts">
  import { currentScreen } from '$lib/stores/appStore';

  import SplashScreen from '$lib/components/SplashScreen.svelte';
  import ConversationScreen from '$lib/components/ConversationScreen.svelte';
  import PrepScreen from '$lib/components/PrepScreen.svelte';
  import BreathingScreen from '$lib/components/BreathingScreen.svelte';
  import Face from '$lib/components/Face.svelte';

  $: screen = $currentScreen;
</script>

<div class="app">

  <!-- Face is visual only -->
  <Face showFaceUI={false} />

  <!-- Overlay UI -->
  <div class="overlay">
    {#if screen === 'splash'}
      <SplashScreen />
    {:else if screen === 'conversation'}
      <ConversationScreen />
    {:else if screen === 'prep'}
      <PrepScreen />
    {:else if screen === 'breathing'}
      <BreathingScreen />
    {/if}
  </div>

</div>

<style>
.app {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: white;
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto; /* FIXED */
}
</style>
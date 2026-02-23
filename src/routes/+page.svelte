<script lang="ts">
  import { currentScreen } from '$lib/stores/appStore';

  import SplashScreen from '$lib/components/SplashScreen.svelte';
  import ConversationScreen from '$lib/components/ConversationScreen.svelte';
  import PrepScreen from '$lib/components/PrepScreen.svelte';
  import BreathingScreen from '$lib/components/BreathingScreen.svelte';
  import SafeHarbourScreen from '$lib/components/SafeHarbourScreen.svelte';
  import CompletedScreen from '$lib/components/CompletedScreen.svelte';
  import Face from '$lib/components/Face.svelte';

  $: screen = $currentScreen;
</script>

<div class="app {screen}">

  <!-- Background decorative circle -->
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
    {:else if screen === 'safeHarbour'}
      <SafeHarbourScreen />
    {:else if screen === 'completed'}
      <CompletedScreen />
    {/if}
  </div>

</div>

<style>
/* =========================
   GLOBAL BASE
========================= */

.app {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000; /* default black */
  font-family: 'Roboto', sans-serif;
  transition: background 0.6s ease;
}

/* =========================
   SCREEN THEMES
========================= */

/* Conversation – Soft Blue */
.app.conversation {
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  color: #1f2937;
}

/* Prep – Soft Green */
.app.prep {
  background: linear-gradient(135deg, #d4fc79, #96e6a1);
  color: #163a24;
}

/* Breathing – Calm Purple */
.app.breathing {
  background: linear-gradient(135deg, #e0c3fc, #8ec5fc);
  color: #2c1e40;
}

/* Safe Harbour – Soft Peach */
.app.safeHarbour {
  background: linear-gradient(135deg, #fbc2eb, #a6c1ee);
  color: #3a1f3d;
}

/* Completed – Neutral Calm */
.app.completed {
  background: linear-gradient(135deg, #cfd9df, #e2ebf0);
  color: #1f2937;
}

/* Splash stays black */
.app.splash {
  background: #000;
  color: #fff;
}

/* =========================
   TYPOGRAPHY
========================= */

h1, h2, h3 {
  font-family: 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: white;
  margin: 0;
}

p {
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  line-height: 1.6;
}

/* =========================
   OVERLAY LAYOUT
========================= */

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  text-align: center;
}

/* =========================
   BUTTON STYLE
========================= */

button {
  padding: 12px 32px;
  border-radius: 999px;
  border: none;
  cursor: pointer;

  font-family: 'Fredoka', sans-serif;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  background: #111;
  color: white;
  transition: all 0.3s ease;
}

button:hover {
  background: #333;
}
</style>
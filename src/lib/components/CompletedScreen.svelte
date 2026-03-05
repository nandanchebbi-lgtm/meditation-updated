<script lang="ts">
  import { currentScreen } from '$lib/stores/appStore';
  import Face from '$lib/components/Face.svelte';
  import { sendCommand } from '$lib/services/nats';

  function repeat() {
    currentScreen.set('breathing');
  }

  function chooseAnother() {
    currentScreen.set('prep');
  }

  function exit() {
    // 🚀 SEND STOP COMMAND
    sendCommand('stop');

    currentScreen.set('splash');
  }
</script>

<div class="screen-bg">
  <Face
    mode="celebration-loop"
    state="completed"
    riveSrc="/confetti-animation.riv"
  >
    <div>
      <h2>Session Complete 🎉</h2>
      <p class="sub">You showed up for yourself</p>

      <div class="actions">
        <button on:click={repeat}>Repeat</button>
        <button on:click={chooseAnother}>Try Another</button>
        <button on:click={exit}>Exit</button>
      </div>
    </div>
  </Face>
</div>

<style>
.screen-bg {
  position: absolute;
  inset: 0;
  background: url('/background.png') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

button {
  padding: 12px 32px;
  border-radius: 999px;
  background: #111;
  color: white;
  border: none;
  cursor: pointer;
}

.sub {
  opacity: 0.6;
  margin-top: 4px;
}
</style>
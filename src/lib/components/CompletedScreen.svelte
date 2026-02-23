<script lang="ts">
  import { currentScreen } from '$lib/stores/appStore';

  function repeat() {
    currentScreen.set('breathing');
  }

  function chooseAnother() {
    currentScreen.set('prep');
  }

  function exit() {
    currentScreen.set('splash');
  }
</script>

<div class="screen">

  <h2>Session Complete</h2>

  <p class="subtitle">
    You’ve completed your breathing session.
  </p>

  <div class="actions">
    <button on:click={repeat}>Repeat</button>
    <button on:click={chooseAnother}>Try another</button>
    <button on:click={exit}>Exit</button>
  </div>

</div>

<style>
.screen {
  text-align: center;
  max-width: 480px;
  margin: 120px auto;
  padding: 0 20px;
}

.subtitle {
  margin-top: 16px;
  color: #666;
}

.actions {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
<script lang="ts">
  import { currentScreen } from '$lib/stores/appStore';

  // simple placeholder message
  let text = "Listening...";

  function next() {
    currentScreen.set('prep');
  }
</script>

<div class="screen">
  <h2>{text}</h2>
  <button on:click={next}>Continue</button>
</div>

<style>
.screen {
  text-align: center;
}
</style>
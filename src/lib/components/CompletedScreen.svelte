<script lang="ts">
  import { currentScreen } from '$lib/stores/appStore';
  import Face from '$lib/components/Face.svelte';

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
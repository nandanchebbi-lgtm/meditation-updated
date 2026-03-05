<script lang="ts">
  import StepPlayer from './StepPlayer.svelte';
  import { sendCommand } from '$lib/services/nats';

  let programSlug = '4-7-8-breathing';

  function pause() {
    sendCommand('pause');
  }

  function resume() {
    sendCommand('resume');
  }
</script>

<div class="breathing-screen">

  <StepPlayer {programSlug} />

  <div class="controls">
    <button on:click={pause}>Pause</button>
    <button on:click={resume}>Resume</button>
  </div>

</div>

<style>
.controls{
  position:absolute;
  bottom:40px;
  display:flex;
  gap:20px;
}

button{
  padding:12px 28px;
  border-radius:999px;
  background:#111;
  color:white;
  border:none;
  cursor:pointer;
}
</style>
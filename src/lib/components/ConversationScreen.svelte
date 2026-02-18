<script lang="ts">
  import { currentScreen } from '$lib/stores/appStore';
  import { agentTranscript, agentStatus } from '$lib/services/livekit';

  function next() {
    currentScreen.set('prep');
  }

  const statusLabel: Record<string, string> = {
    waiting:   'Guide is preparing...',
    speaking:  'Guide is speaking',
    listening: 'Your turn to speak',
  };

  const statusHint: Record<string, string> = {
    waiting:   'Audio is generating — this takes a few seconds.',
    speaking:  'Listen to your guide. Press Continue when ready.',
    listening: 'The guide is listening to you.',
  };
</script>

<div class="screen">

  <!-- Status badge -->
  <div class="badge {$agentStatus}">
    {#if $agentStatus === 'speaking'}
      <span class="dot pulse"></span>
    {:else}
      <span class="dot"></span>
    {/if}
    {statusLabel[$agentStatus] ?? 'Connecting...'}
  </div>

  <!-- Waveform animation while speaking -->
  {#if $agentStatus === 'speaking'}
    <div class="wave" aria-hidden="true">
      {#each Array(5) as _, i}
        <span class="bar" style="animation-delay:{i * 0.1}s"></span>
      {/each}
    </div>
  {/if}

  <!-- Transcript -->
  <div class="transcript">
    {#if $agentTranscript}
      <p>"{$agentTranscript}"</p>
    {:else}
      <p class="muted">{statusHint[$agentStatus] ?? 'Establishing connection...'}</p>
    {/if}
  </div>

  <!-- Continue button — only show once agent has spoken -->
  {#if $agentStatus === 'speaking' || $agentStatus === 'listening'}
    <button on:click={next}>Continue →</button>
  {/if}

</div>

<style>
  .screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    max-width: 420px;
    text-align: center;
  }

  /* Badge */
  .badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 500;
    background: #f0f0f0;
    color: #444;
    transition: background 0.3s, color 0.3s;
  }

  .badge.speaking  { background: #e8f5e9; color: #2e7d32; }
  .badge.listening { background: #e3f2fd; color: #1565c0; }
  .badge.waiting   { background: #fff8e1; color: #f57f17; }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }

  .dot.pulse {
    animation: blink 1s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }

  /* Wave */
  .wave {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 36px;
  }

  .bar {
    display: block;
    width: 4px;
    border-radius: 2px;
    background: #2e7d32;
    animation: wave 0.8s ease-in-out infinite alternate;
  }

  .bar:nth-child(1) { height: 12px; }
  .bar:nth-child(2) { height: 24px; }
  .bar:nth-child(3) { height: 36px; }
  .bar:nth-child(4) { height: 24px; }
  .bar:nth-child(5) { height: 12px; }

  @keyframes wave {
    from { transform: scaleY(0.4); }
    to   { transform: scaleY(1); }
  }

  /* Transcript */
  .transcript {
    min-height: 60px;
    font-size: 1rem;
    line-height: 1.6;
    color: #222;
  }

  .transcript .muted {
    color: #aaa;
    font-style: italic;
    font-size: 0.9rem;
  }

  /* Button */
  button {
    padding: 12px 32px;
    font-size: 15px;
    border: none;
    border-radius: 999px;
    background: #111;
    color: white;
    cursor: pointer;
    letter-spacing: 0.04em;
  }

  button:hover { background: #333; }
</style>

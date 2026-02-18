import { connectToVoiceSession } from '$lib/voice/livekit';

async function startVoiceMeditation() {
  const res = await fetch('/api/voice-session', {
    method: 'POST',
  });

  const { token } = await res.json();

  await connectToVoiceSession(token);
}
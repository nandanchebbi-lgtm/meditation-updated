import { Room, RoomEvent, Track } from 'livekit-client';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Global room instance
 */
let room: Room | null = null;

/**
 * Agent transcript store
 */
export const agentTranscript = writable<string>('');

/**
 * Agent status store
 */
export type AgentStatus = 'idle' | 'waiting' | 'speaking' | 'listening';
export const agentStatus = writable<AgentStatus>('idle');

/**
 * Connect to LiveKit room
 */
export async function connectToRoom(
  token: string,
  url: string
): Promise<Room> {
  if (!browser) {
    throw new Error('LiveKit runs only in browser');
  }

  room = new Room();

  await room.connect(url, token);

  console.log('✅ Connected to LiveKit');

  agentStatus.set('waiting');

  // Explicitly attach remote audio tracks and track speaking state
  room.on(RoomEvent.TrackSubscribed, (track, _publication, participant) => {
    if (track.kind === Track.Kind.Audio) {
      const audioEl = track.attach();
      audioEl.autoplay = true;
      document.body.appendChild(audioEl);
      console.log('🔊 Audio track attached from', participant.identity);

      audioEl.addEventListener('play',  () => agentStatus.set('speaking'));
      audioEl.addEventListener('pause', () => agentStatus.set('listening'));
      audioEl.addEventListener('ended', () => agentStatus.set('listening'));

      audioEl.play().catch((e) => console.warn('Audio play blocked:', e));
    }
  });

  room.on(RoomEvent.TrackUnsubscribed, (track) => {
    if (track.kind === Track.Kind.Audio) {
      track.detach().forEach((el) => el.remove());
      agentStatus.set('waiting');
    }
  });

  // Receive messages from server / agent
  room.on(RoomEvent.DataReceived, (payload) => {
    try {
      const text = new TextDecoder().decode(payload);
      const parsed = JSON.parse(text);
      if (parsed.type === 'transcript' && parsed.text) {
        agentTranscript.set(parsed.text);
      }
    } catch (err) {
      console.error('Transcript decode failed:', err);
    }
  });

  return room;
}

/**
 * Send command to agent/backend
 */
export async function sendCommand(command: string): Promise<void> {
  if (!room) {
    console.warn('⚠️ No room connected');
    return;
  }

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify({ command }));

    // send reliable data message
    await room.localParticipant.publishData(data, {
      reliable: true
    });

    console.log('📤 Command sent:', command);
  } catch (err) {
    console.error('Failed to send command:', err);
  }
}

/**
 * Get room instance
 */
export function getRoom(): Room | null {
  return room;
}

/**
 * Disconnect
 */
export function disconnectRoom(): void {
  if (room) {
    room.disconnect();
    room = null;
    agentTranscript.set('');
    agentStatus.set('idle');
  }
}
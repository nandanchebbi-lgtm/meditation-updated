import { Room } from 'livekit-client';
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

  // Receive messages from server / agent
  room.on('dataReceived', (payload) => {
    try {
      const text = new TextDecoder().decode(payload);
      agentTranscript.set(text);
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
    const data = encoder.encode(command);

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
  }
}
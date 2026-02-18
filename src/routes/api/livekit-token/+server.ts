import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AccessToken, AgentDispatchClient } from 'livekit-server-sdk';

import {
  LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET,
  LIVEKIT_URL
} from '$env/static/private';

const ROOM_NAME = 'meditation-room';
const AGENT_NAME = 'meditation-voice-agent';

export const POST: RequestHandler = async () => {
  if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
    return json({ error: 'Env misconfigured' }, { status: 500 });
  }

  const token = new AccessToken(
    LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET,
    {
      identity: `user-${crypto.randomUUID()}`,
      ttl: 3600
    }
  );

  token.addGrant({
    roomJoin: true,
    room: ROOM_NAME,
    canPublish: true,
    canSubscribe: true
  });

  // Dispatch the voice agent to the room
  try {
    const dispatchClient = new AgentDispatchClient(
      LIVEKIT_URL,
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET
    );
    await dispatchClient.createDispatch(ROOM_NAME, AGENT_NAME);
  } catch (err) {
    console.error('Agent dispatch failed:', err);
  }

  return json({
    token: await token.toJwt(),
    url: LIVEKIT_URL
  });
};

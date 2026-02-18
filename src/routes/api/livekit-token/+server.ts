import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AccessToken } from 'livekit-server-sdk';

import {
  LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET,
  LIVEKIT_URL
} from '$env/static/private';

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
    room: 'meditation-room',
    canPublish: true,
    canSubscribe: true
  });

  return json({
    token: token.toJwt(),
    url: LIVEKIT_URL
  });
};
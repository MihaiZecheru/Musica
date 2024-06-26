import { Buffer } from 'buffer';
import { SpotifySongID } from '../database-types/ID';

const CLIENT_ID = '64298f7a2f344d86b9368930e6683cf3';
const CLIENT_SECRET = '218dfd4ac44e41148fd94b54d58e5a3b';

export interface SpotifyAPISong {
  album: {
    name: string,
    images: Array<{ url: string }>,
    release_date: string
  };
  artists: Array<{ name: string }>;
  external_urls: { spotify: string }
  name: string;
  preview_url: string;
  id: SpotifySongID;
}

async function getAccessToken(): Promise<string> {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get access token');
  }

  return (await response.json()).access_token;
}

export async function searchSongs(query: string): Promise<Array<SpotifyAPISong>> {
  const accessToken = await getAccessToken();
  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=21`;

  const response = await fetch(searchUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to search for songs');
  }

  return (await response.json()).tracks.items;
}

const YOUTUBE_API_KEY: string = "AIzaSyAhHbPmxPz5QLhpOcxtGITF7L-j70REHdI";

export interface YoutubeAPIVideo {
  url: string;
  duration: string;
}

function parseDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const minutes = parseInt(match[2]?.replace('M', '') || '0', 10) || 0;
  const seconds = parseInt(match[3]?.replace('S', '') || '0', 10) || 0;

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export async function searchYoutubeForMatchingVideo(song_name: string, artist_name: string): Promise<YoutubeAPIVideo> {
  try {
    const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(`${song_name} by ${artist_name} audio`)}&key=${YOUTUBE_API_KEY}&maxResults=1`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`YouTube API request failed: ${response.status} ${response.statusText}`);

    const data = await response.json();
    const videoId = data.items?.[0]?.id?.videoId;

    if (!videoId) throw new Error('No videos found');

    const videosEndpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    const videosResponse = await fetch(videosEndpoint);
    if (!videosResponse.ok) throw new Error(`YouTube API request failed: ${videosResponse.status} ${videosResponse.statusText}`);
    const videoData = await videosResponse.json();

    if (!videoData.items?.length) throw new Error('No video details found');

    const video = videoData.items[0];
    const result: YoutubeAPIVideo = {
      url: `https://www.youtube.com/watch?v=${video.id}`,
      duration: parseDuration(video.contentDetails.duration)
    };

    return result;
  } catch (error) {
    console.error('Error fetching data from YouTube API', error);
    throw new Error('Failed to fetch data from YouTube API');
  }
}
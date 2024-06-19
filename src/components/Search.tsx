import { useEffect, useState } from "react";
import { Input, initMDB, Modal } from 'mdb-ui-kit';
import { YoutubeAPIVideo } from "../types";
import YoutubeVideoCard from "./YoutubeVideoCard";
import supabase from "../config/supabase";

async function addSongToSupabase(video: YoutubeAPIVideo) {
  const { data, error } = await supabase
    .from('Songs')
    .insert([{
      videoURL: video.url,
      title: video.title,
      artist: null,
      year: null,
      duration: video.duration,
      imageURL: null
    }]);
}

const YOUTUBE_API_KEY: string = "AIzaSyAhHbPmxPz5QLhpOcxtGITF7L-j70REHdI";

async function searchYoutubeForVideos(query: string, lyricsOnly: boolean): Promise<Array<YoutubeAPIVideo>> {
  try {
    const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query + ' song' + (lyricsOnly ? ' lyrics' : ''))}&key=${YOUTUBE_API_KEY}&maxResults=10`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`YouTube API request failed: ${response.status} ${response.statusText}`);

    const data = await response.json();
    const videoIds = data.items?.map((item: any) => item.id.videoId).join(',');

    const videosEndpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    console.log(videosEndpoint);
    const videosResponse = await fetch(videosEndpoint);
    if (!videosResponse.ok) throw new Error(`YouTube API request failed: ${videosResponse.status} ${videosResponse.statusText}`);
    const videosData = await videosResponse.json();

    const videos: Array<YoutubeAPIVideo> = videosData.items?.map((item: any) => ({
      title: item.snippet.title || '',
      description: item.snippet.description || '',
      url: `https://www.youtube.com/watch?v=${item.id}`,
      thumbnail: item.snippet.thumbnails.medium.url || '',
      duration: parseDuration(item.contentDetails.duration)
    })) || [];

    return videos;
  } catch (error) {
    console.error('Error fetching data from YouTube API', error);
    throw new Error('Failed to fetch data from YouTube API');
  }
}

function parseDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  let hours = parseInt(match[1]?.replace('H', '') || '0', 10) || 0;
  const minutes = parseInt(match[2]?.replace('M', '') || '0', 10) || 0;
  const seconds = parseInt(match[3]?.replace('S', '') || '0', 10) || 0;

  // Remove leading zero from hours if it exists
  const hoursString = hours > 0 ? hours.toString() : '';

  return `${hoursString}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const Search = () => {
  const [searchResults, setSearchResults] = useState<Array<YoutubeAPIVideo>>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lyricsOnly, setLyricsOnly] = useState<boolean>(true);
  const [lastCheckboxSwitch, setLastCheckboxSwitch] = useState<number>(0);

  useEffect(() => {
    initMDB({ Input });
  }, []);

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const s = (e.target as HTMLInputElement).value.trim();
      if (s.length === 0) return;
      setSearchQuery(s);
      searchYoutubeForVideos(searchQuery, lyricsOnly).then((videos: Array<YoutubeAPIVideo>) => {
        setSearchResults(videos);
      });
    }
  }

  const handleCheckboxClick = async () => {
    if (Date.now() - lastCheckboxSwitch < 500) return;
    setLastCheckboxSwitch(Date.now());
    setLyricsOnly(!lyricsOnly);
    if (searchQuery.length !== 0) {
      // Redo the search with the new checkbox value
      searchYoutubeForVideos(searchQuery, lyricsOnly).then((videos: Array<YoutubeAPIVideo>) => {
        setSearchResults(videos);
      });
    }
  } 

  return (
    <div>
      <div>
        <div className="form-outline" data-mdb-input-init>
          <input type="text" id="searchbox" className="form-control" onKeyDown={ handleKeyPress }/>
          <label className="form-label" htmlFor="searchbox">Find new music</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="" id="lyrics-only-checkbox" onClick={ handleCheckboxClick } defaultChecked={ lyricsOnly }/>
          <label className="form-check-label" htmlFor="lyrics-only-checkbox">Lyric videos only</label>
        </div>
      </div>
      <div id="results">
        { searchResults.length > 0 ? searchResults.map((video: YoutubeAPIVideo, index: number) => (
          <YoutubeVideoCard key={index} video={video} />
        )) : <p>No results found</p> }
      </div>
    </div>
  );
}
 
export default Search;
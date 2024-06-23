import { useEffect, useState } from "react";
import { Input, initMDB, Modal } from 'mdb-ui-kit';
import SpotifySongCard from "./SpotifySongCard";
import { searchSongs, SpotifyAPISong } from "../functions/spotifyService";
import supabase from "../config/supabase";

const getExistingMusicaSongIDs = async (): Promise<Array<string>> => {
  const { data, error } = await supabase
    .from('Songs')
    .select('spotifySongID');
  
  if (error) {
    console.error('Error retrieving existing songs from musica: ', error);
    throw error;
  }

  return data.map((song: { spotifySongID: string }) => song.spotifySongID);
}

function getAddedStatus(spotifySongID: string, existingMusicaSongIDs: Array<string>): "added" | "not-added" {
  return existingMusicaSongIDs.includes(spotifySongID) ? "added" : "not-added";
}

const Search = () => {
  const [searchResults, setSearchResults] = useState<Array<SpotifyAPISong>>([]);
  const [search_count, setSearchCount] = useState<number>(0); // the amount of times a search has been made
  const [existingMusicaSongIDs, setExistingMusicaSongIDs] = useState<Array<string>>([]);

  useEffect(() => {
    initMDB({ Input });
    getExistingMusicaSongIDs().then((songIDs) => setExistingMusicaSongIDs(songIDs));
  }, [search_count]);

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const s = (e.target as HTMLInputElement).value.trim();
      if (s.length === 0) return;
      setSearchResults(await searchSongs(s));
      setSearchCount(search_count + 1);
    }
  }

  return (
    <div>
      <div>
        <div className="form-outline" data-mdb-input-init>
          <input type="text" id="searchbox" className="form-control" onKeyDown={ handleKeyPress }/>
          <label className="form-label" htmlFor="searchbox">Find new music</label>
        </div>
      </div>
      <div id="results">
        { searchResults.length > 0 ? searchResults.map((song: SpotifyAPISong, index: number) => (
          <SpotifySongCard key={search_count * 100 + index} song={song} _addedStatus={ getAddedStatus(song.id, existingMusicaSongIDs) } />
        )) : <p>No results found</p> }
      </div>
    </div>
  );
}
 
export default Search;
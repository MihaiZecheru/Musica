import { useEffect, useState } from "react";
import { Input, initMDB, Dropdown, Ripple } from 'mdb-ui-kit';
import NotAddedSpotifySongCard from "./NotAddedSpotifySongCard";
import { searchSongs, SpotifyAPISong } from "../functions/spotifyService";
import supabase from "../config/supabase";
import { SongID, SpotifySongID } from "../database-types/ID";
import GetUser from "../functions/GetUser";
import AddedSpotifySongCard from "./AddedSpotifySongCard";
import AddSongToMusica from "../functions/AddSongToMusica";
import { TLikedSongData } from "../database-types/ILikedSong";

const getExistingMusicaSongIDs = async (): Promise<Array<SpotifySongID>> => {
  const { data, error } = await supabase
    .from('Songs')
    .select('spotifySongID');
  
  if (error) {
    console.error('Error retrieving existing songs from musica: ', error);
    throw error;
  }

  return data.map((song: { spotifySongID: SpotifySongID }) => song.spotifySongID);
}

function getAddedStatus(spotifySongID: string, existingMusicaSongIDs: Array<string>): "added" | "not-added" {
  return existingMusicaSongIDs.includes(spotifySongID) ? "added" : "not-added";
}

function removeAllEventListeners(element: HTMLElement) {
  const newElement = element.cloneNode(true);
  element.parentNode?.replaceChild(newElement, element);
  return newElement;
}

async function getLikedSongs(): Promise<Array<TLikedSongData>> {
  const user = await GetUser();
  
  const { data, error } = await supabase
    .from('LikedSongs')
    .select('songs')
    .eq('userID', user.id);

  if (error) {
    console.error('Error retrieving liked songs: ', error);
    throw error;
  }

  return (data as Array<{ songs: Array<TLikedSongData> }>)[0].songs;
}

const Search = () => {
  const [searchResults, setSearchResults] = useState<Array<SpotifyAPISong>>([]);
  const [search_count, setSearchCount] = useState<number>(0); // the amount of times a search has been made
  const [existingMusicaSongIDs, setExistingMusicaSongIDs] = useState<Array<string>>([]);
  const [likedSongs, setLikedSongs] = useState<Array<TLikedSongData>>([]);
  const [spotifyIDToSongIDMap, setSpotifyIDToSongIDMap] = useState<{ [spotifyID: SpotifySongID]: SongID }>({});

  useEffect(() => {
    initMDB({ Input });
    getExistingMusicaSongIDs().then((songIDs) => setExistingMusicaSongIDs(songIDs));
    getLikedSongs().then((songs) => setLikedSongs(songs));

    (async () => {
      const { data, error } = await supabase
        .from('Songs')
        .select('id,spotifySongID');
  
      if (error) {
        console.error('Error retrieving song: ', error);
        throw error;
      }

      const map: { [spotifyID: SpotifySongID]: SongID } = {};
      for (let i = 0; i < data.length; i++) {
        map[data[i].spotifySongID] = data[i].id;
      }

      setSpotifyIDToSongIDMap(map);
    })();
  }, []);

  const toggleSongLikeStatus = async (songSpotifyID: SpotifySongID) => {
    const songID = spotifyIDToSongIDMap[songSpotifyID];
    const isLiked = likedSongs.some((likedSong: TLikedSongData) => likedSong.songID === songID);
    
    let newLikedSongs: Array<TLikedSongData>;
    if (isLiked) {
      // Unlike the song
      newLikedSongs = likedSongs.filter((song: TLikedSongData) => song.songID !== songID);
    } else {
      // Like the song
      newLikedSongs = [...likedSongs, {
        songID,
        dateAdded: Date.now()
      }];
    }
    
    setLikedSongs(newLikedSongs);
    const { error } = await supabase
        .from('LikedSongs')
        .update({ songs: newLikedSongs })
        .eq('userID', (await GetUser()).id);

      if (error) {
        console.error('Error updating liked songs: ', error);
        throw error;
      }
  }

  // false if closed, true if open
  const dropdownStatuses: { [id: string]: boolean } = {};
  useEffect(() => {
    setTimeout(() => {
      initMDB({ Ripple });
      document.querySelectorAll('.btn-spc-dropdown').forEach((dropdown) => {
        dropdownStatuses[dropdown.id] = false;
        const _d = new Dropdown(dropdown);
        
        dropdown.addEventListener('click', () => {
          if (dropdownStatuses[dropdown.id]) {
            dropdownStatuses[dropdown.id] = false;
            _d.hide();
          }
          else {
            Object.keys(dropdownStatuses).forEach((key) => {
              dropdownStatuses[key] = false;
            });
            dropdownStatuses[dropdown.id] = true;
            _d.show();
          }
        });

        dropdown.parentElement?.addEventListener('hidden.mdb.dropdown', () => {
          dropdownStatuses[dropdown.id] = false;
        });
      });
    }, 500);

    return () => {
      document.querySelectorAll('.btn-spc-dropdown').forEach((dropdown) => {
        removeAllEventListeners(dropdown as HTMLButtonElement);
      });
    }
  }, [searchResults]);

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const s = (e.target as HTMLInputElement).value.trim();
      if (s.length === 0) return;
      setSearchResults(await searchSongs(s));
      setSearchCount(search_count + 1);
    }
  }

  const onAdd = (song: SpotifyAPISong) => {
    setExistingMusicaSongIDs([...existingMusicaSongIDs, song.id]);
    AddSongToMusica(song);
  }

  return (
    <div>
      <div>
        <div className="form-outline" data-mdb-input-init>
          <input type="text" id="searchbox" className="form-control" onKeyDown={ handleKeyPress }/>
          <label className="form-label" htmlFor="searchbox">Find new music</label>
        </div>
      </div>
      {
        searchResults.length > 0 ? 
          <div id="results">
            {
              searchResults.map((song: SpotifyAPISong, index: number) => {
                const isAdded: boolean = getAddedStatus(song.id, existingMusicaSongIDs) === 'added';

                if (isAdded) {
                  return <AddedSpotifySongCard
                    key={search_count * 100 + index}
                    song={song}
                    songIsLiked={ likedSongs.some((likedSong: TLikedSongData) => likedSong.songID === spotifyIDToSongIDMap[song.id]) }
                    onSongLikeToggle={ () => { toggleSongLikeStatus(song.id as SpotifySongID) } }
                  />
                } else {
                  return <NotAddedSpotifySongCard
                    key={search_count * 100 + index}
                    song={song}
                    onAdd={ () => { onAdd(song) } }
                  />
                }
              })
            }
          </div>
        : <p>No results found</p>
      }
    </div>
  );
}
 
export default Search;

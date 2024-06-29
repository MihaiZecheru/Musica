import { useEffect, useState } from "react";
import { Input, initMDB, Dropdown, Ripple } from 'mdb-ui-kit';
import NotAddedSpotifySongCard from "./NotAddedSpotifySongCard";
import { searchSongs, SpotifyAPISong } from "../functions/spotifyService";
import supabase from "../config/supabase";
import { SongID, SpotifySongID, UserID } from "../database-types/ID";
import GetUser from "../functions/GetUser";
import AddedSpotifySongCard from "./AddedSpotifySongCard";
import AddSongToMusica from "../functions/AddSongToMusica";
import { TLikedSongData } from "../database-types/ILikedSong";
import IPlaylistSong from "../database-types/IPlaylistSong";
import IPlaylistReduced from "../database-types/IPlaylistReduced";
import { useSearchParams } from "react-router-dom";

const getExistingMusicaSongIDs = async (): Promise<SpotifySongID[]> => {
  const { data, error } = await supabase
    .from('Songs')
    .select('spotifySongID');
  
  if (error) {
    console.error('Error retrieving existing songs from musica: ', error);
    throw error;
  }

  return data.map((song: { spotifySongID: SpotifySongID }) => song.spotifySongID);
}

function getAddedStatus(spotifySongID: string, existingMusicaSongIDs: string[]): "added" | "not-added" {
  return existingMusicaSongIDs.includes(spotifySongID) ? "added" : "not-added";
}

function removeAllEventListeners(element: HTMLElement) {
  const newElement = element.cloneNode(true);
  element.parentNode?.replaceChild(newElement, element);
  return newElement;
}

async function getLikedSongsAndQueue(): Promise<{ likedSongs: TLikedSongData[], songQueue: SongID[] }> {
  const user = await GetUser();

  const { data, error } = await supabase
    .from('UserMusicLibrary')
    .select('likedSongs,songQueue')
    .eq('userID', user.id);

  if (error) {
    console.error('Error retrieving liked songs: ', error);
    throw error;
  }

  const likedSongs = data[0].likedSongs;
  const songQueue = data[0].songQueue;
  return { likedSongs, songQueue };
}

async function getPlaylists(userID: UserID): Promise<IPlaylistReduced[]> {
  const { data: data_playlistLibrary, error: error_playlistLibrary } = await supabase
    .from("UserMusicLibrary")
    .select('playlistLibrary')
    .eq("userID", userID);

  if (error_playlistLibrary) {
    console.error("error fetching UserMusicLibrary: ", data_playlistLibrary);
    throw error_playlistLibrary;
  }
  
  const { data: data_playlists, error: error_playlists } = await supabase
    .from('Playlists')
    .select('id,title,songs')
    .in('id', data_playlistLibrary![0].playlistLibrary);

  if (error_playlists) {
    console.error('Error retrieving playlists: ', error_playlists);
    throw error_playlists;
  }

  return data_playlists as IPlaylistReduced[];
}

const Search = () => {
  const [userID, setUserID] = useState<UserID | null>(null);
  const [searchResults, setSearchResults] = useState<SpotifyAPISong[]>([]);
  const [searchCount, setSearchCount] = useState<number>(0); // the amount of times a search has been made
  const [existingMusicaSongIDs, setExistingMusicaSongIDs] = useState<string[]>([]);
  const [likedSongs, setLikedSongs] = useState<TLikedSongData[]>([]);
  const [songsInQueue, setSongsInQueue] = useState<SongID[]>([]);
  const [spotifyIDToSongIDMap, setSpotifyIDToSongIDMap] = useState<{ [spotifyID: SpotifySongID]: SongID }>({});
  const [playlists, setPlaylists] = useState<IPlaylistReduced[]>([]);
  const [lastAddedSong, setLastAddedSong] = useState<SpotifyAPISong | null>(null); // Used to refresh the component when the user adds a song to musica, due to the dropdown not working otherwise
  const [searchParams] = useSearchParams();

  const handleKeyPress = async (e: any) => {
    if (e.key === "Enter") {
      const s = (e.target as HTMLInputElement).value.trim();
      if (s.length === 0) return;
      setSearchResults(await searchSongs(s));
      setSearchCount(searchCount + 1);
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      initMDB({ Input });

      // Check for redirect from another page
      const searchQuery = searchParams.get('q');
      if (searchQuery) {
        const searchbox = document.getElementById('searchbox-navbar') as HTMLInputElement;
        searchbox!.setAttribute('value', searchQuery);
        searchbox?.focus();
        // move cursor to end of input
        searchbox?.setSelectionRange(searchQuery.length, searchQuery.length);
        setSearchResults(await searchSongs(searchQuery));
        setSearchCount(searchCount + 1);
      }

      // Set handleKeyPress event listener to searchbox
      document.getElementById('searchbox-navbar')?.addEventListener('keypress', handleKeyPress);

      const user = await GetUser();
      setUserID(user.id as UserID);

      const musicaSongIDs = await getExistingMusicaSongIDs();
      setExistingMusicaSongIDs(musicaSongIDs);

      const likedSongsAndQueue = await getLikedSongsAndQueue();
      setLikedSongs(likedSongsAndQueue.likedSongs);
      setSongsInQueue(likedSongsAndQueue.songQueue);

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
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (userID) {
      (async () => {
        const userPlaylists = await getPlaylists(userID);
        setPlaylists(userPlaylists);
      })();
    }
  }, [userID]);

  const toggleSongLikeStatus = async (songID: SongID, userID: UserID) => {
    const isLiked = likedSongs.some((likedSong: TLikedSongData) => likedSong.songID === songID);

    let newLikedSongs: TLikedSongData[];
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
      .from('UserMusicLibrary')
      .update({ likedSongs: newLikedSongs })
      .eq('userID', userID);

    if (error) {
      console.error('Error updating liked songs: ', error);
      throw error;
    }
  }

  const onInQueueToggle = async (songID: SongID, userID: UserID) => {
    const isInQueue = songsInQueue.some((_songID: SongID) => _songID === songID);
    
    let newSongQueue: SongID[];
    if (isInQueue) {
      // Remove from queue
      newSongQueue = songsInQueue.filter((_songID: SongID) => _songID !== songID);
    } else {
      // Add to queue
      newSongQueue = [...songsInQueue, songID];
    }

    setSongsInQueue(newSongQueue);
    const { error } = await supabase
      .from('UserMusicLibrary')
      .update({ songQueue: newSongQueue })
      .eq('userID', userID);

    if (error) {
      console.error('Error updating song queue: ', error);
      throw error;
    }
  }

  const copyShareLink = (songID: SongID) => {
    navigator.clipboard.writeText(window.location.origin + '/song/' + songID);
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
  }, [searchResults, lastAddedSong]);

  const onAdd = async (song: SpotifyAPISong) => {
    setExistingMusicaSongIDs([...existingMusicaSongIDs, song.id]);
    const musicaSongID = await AddSongToMusica(song);
    setLastAddedSong(song);
    setSpotifyIDToSongIDMap({ ...spotifyIDToSongIDMap, [song.id]: musicaSongID });
  }

  const updateSongInPlaylist = async (playlistID: string, songID: SongID) => {
    const { data, error } = await supabase
        .from('Playlists')
        .select('songs')
        .eq('id', playlistID);
  
    if (error) {
      console.error('Error adding song to playlist: ', error);
      throw error;
    }
  
    let songs: IPlaylistSong[] = data![0].songs;
    const operation = songs.some((song) => song.songID === songID) ? 'remove' : 'add';
  
    if (operation === 'add') {
      songs.push({
        songID,
        position: songs.length + 1,
        dateAdded: Date.now()
      });
    } else {
      songs = songs.filter((song) => song.songID !== songID);
    }

    const { error: insertError } = await supabase
      .from('Playlists')
      .update({ songs })
      .eq('id', playlistID);

    if (insertError) {
      console.error('Error inserting updated songs array in playlist: ', insertError);
      throw insertError;
    }

    setPlaylists(
      playlists.map((playlist: IPlaylistReduced) => {
        if (playlist.id === playlistID)
          return { ...playlist, songs }
        return playlist
      })
    );
  }

  return (
    <div>
      {
        searchResults.length > 0 ? 
          <div id="results">
            {
              searchResults.map((song: SpotifyAPISong, index: number) => {
                const isAdded: boolean = getAddedStatus(song.id, existingMusicaSongIDs) === 'added';
                const songID: SongID = spotifyIDToSongIDMap[song.id];

                if (isAdded) {
                  return <AddedSpotifySongCard
                    key={searchCount * 100 + index}
                    song={song}
                    musicaSongID={ songID }
                    songIsLiked={ likedSongs.some((likedSong: TLikedSongData) => likedSong.songID === songID) }
                    onSongLikeToggle={ () => { toggleSongLikeStatus(songID, userID!) } }
                    songInQueue={ songsInQueue.some((_songID: SongID) => _songID === songID) }
                    onInQueueToggle={ () => { onInQueueToggle(songID, userID!) } }
                    onCopyShareLink={ () => { copyShareLink(songID) } }
                    playlists={ playlists }
                    updateSongInPlaylist={ updateSongInPlaylist }
                  />
                } else {
                  return <NotAddedSpotifySongCard
                    key={searchCount * 100 + index}
                    song={song}
                    onAdd={ () => { onAdd(song) } }
                  />
                }
              })
            }
          </div>
        : <></> // No search results yet. Note: Searches will always return results
      }
    </div>
  );
}
 
export default Search;

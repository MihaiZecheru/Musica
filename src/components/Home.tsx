import { Range, initMDB } from "mdb-ui-kit";
import { useCallback, useEffect, useRef, useState } from "react";
import IPlaylist from "../database-types/IPlaylist";
import SideNav from "./SideNav";
import ISong from "../database-types/ISong";
import supabase from "../config/supabase";
import { GetUserID } from "../functions/GetUser";
import { PlaylistID, SongID, UserID } from "../database-types/ID";
import Loading from "./Loading";
import { TLikedSongData } from "../database-types/ILikedSong";
import LikedSongsDisplay from "./LikedSongsDisplay";
import PlaylistDisplay from "./PlaylistDisplay";
import ExtractAudioURL from "../functions/ExtractAudioURL";
import GetSong from "../functions/GetSong";
import { getCurrentlyPlayingFromDB, setCurrentlyPlayingInDB } from "../functions/currentlyPlayingDB";
import formatDuration from "../functions/formatDuration";

const Home = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [likedSongs, setLikedSongs] = useState<TLikedSongData[]>([]);
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [queue, setQueue] = useState<ISong[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<IPlaylist | null>(null);
  const currentlyPlaying = useRef<ISong | null>(null);
  const currentlyPlayingAudioURL = useRef<string>('null');
  const [paused, setPaused] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(100);
  const [userID, setUserID] = useState<UserID | null>(null);
  const [loadingNextSong, setLoadingNextSong] = useState<boolean>(true);

  const audioRef = useRef<HTMLAudioElement>(null);
  const songPositionElement = useRef<HTMLInputElement>(null);
  const currentTimeDisplay = useRef<HTMLSpanElement>(null);
  const loadingStart = Date.now();

  useEffect(() => {
    (async () => {
      const _userID: UserID = await GetUserID();
      setUserID(_userID);

      const { data: data_UserMusicLibrary, error: error_UserMusicLibrary } = await supabase
        .from("UserMusicLibrary")
        .select()
        .eq("userID", _userID);

      if (error_UserMusicLibrary) {
        console.error("error fetching UserMusicLibrary: ", error_UserMusicLibrary);
        throw error_UserMusicLibrary;
      }

      const userMusicLibrary = data_UserMusicLibrary![0] as { likedSongs: TLikedSongData[], songQueue: SongID[], playlistLibrary: PlaylistID[], currentlyPlaying: SongID | null };
      setLikedSongs(userMusicLibrary.likedSongs);

      const { data: data_playlists, error: error_playlists } = await supabase
        .from("Playlists")
        .select()
        .in('id', userMusicLibrary.playlistLibrary);
      
      if (error_playlists) {
        console.error("error fetching playlists in library: ", error_playlists);
        throw error_playlists;
      }
        
      setPlaylists(data_playlists);

      const { data: data_queue, error: error_queue } = await supabase
        .from("Songs")
        .select()
        .in('id', userMusicLibrary.songQueue);

      if (error_queue) {
        console.error("error fetching queue: ", error_queue);
        throw error_queue;
      }

      setQueue(data_queue);

      const currentlyPlayingSongID: SongID | null = userMusicLibrary.currentlyPlaying;
      if (currentlyPlayingSongID) {
        const song = queue.find(song => song.id === currentlyPlayingSongID) || await GetSong(currentlyPlayingSongID);
        currentlyPlaying.current = song;
        currentlyPlayingAudioURL.current = await ExtractAudioURL(song.videoID);
      }
      setLoadingNextSong(false);

      // check if at least 1000ms have passed since loadingStart
      if (loadingStart + 1000 < Date.now()) {
        setLoading(false);
      } else {
        setTimeout(() => {
          setLoading(false);
        }, 1000 - (Date.now() - loadingStart));
      }
    })();
  }, []);

  useEffect(() => {
    initMDB({ Range });
  }, [loading]);

  useEffect(() => {
    const ele = audioRef.current as HTMLAudioElement;
    if (paused)
      ele?.pause();
    else
      ele?.play();
  }, [paused]);

  const onClickPlaySong = async (song: ISong) => {
    setLoadingNextSong(true);
    const ele = audioRef.current as HTMLAudioElement;
    setPaused(true);
    currentlyPlayingAudioURL.current = "null";
    ele.src = "null";
    if (song.id === await getCurrentlyPlayingFromDB(song)) return;
    currentlyPlaying.current = song;
    currentlyPlayingAudioURL.current = await ExtractAudioURL(song.videoID);
    ele.src = currentlyPlayingAudioURL.current;
    setCurrentlyPlayingInDB(song);
    ele.oncanplay = () => setTimeout(() => {
      setPaused(false);
      setLoadingNextSong(false);
    }, 1000);
  }

  const onVolumeChange = (e: any) => {
    const ele = audioRef.current as HTMLAudioElement;
    const volume = e.target.value;
    ele.volume = Number(volume) / 100;
    setVolume(volume);
  }

  const handleAudioError = async () => {
    if (currentlyPlayingAudioURL.current === "null") return;
    currentlyPlayingAudioURL.current = "null";
    if (currentlyPlaying.current) {
      currentlyPlayingAudioURL.current = await ExtractAudioURL(currentlyPlaying.current.videoID);
      audioRef.current!.src = currentlyPlayingAudioURL.current;
    }
  }

  const playNextSong = async () => {
    if (queue.length === 0) {
      currentlyPlaying.current = null;
      currentlyPlayingAudioURL.current = "null";
      setCurrentlyPlayingInDB(null);
      setPaused(true);
      return;
    } else {
      setLoadingNextSong(true);
      const nextSong = queue.shift()!;
      currentlyPlaying.current = nextSong;
      currentlyPlayingAudioURL.current = await ExtractAudioURL(nextSong.videoID);
      if (audioRef.current)
        audioRef.current!.src = currentlyPlayingAudioURL.current;
      setCurrentlyPlayingInDB(nextSong);

      const { error } = await supabase
        .from("UserMusicLibrary")
        .update({ "songQueue": queue.map(song => song.id) })
        .eq("userID", userID);

      if (error) {
        console.error("error updating queue: ", error);
        throw error;
      }

      setLoadingNextSong(false);
    }
  }

  const onSongPositionChange = (e: any) => {
    const ele = audioRef.current as HTMLAudioElement;
    ele.currentTime = Number(e.target.value) * ele.duration / currentlyPlaying.current!.duration;
  }

  const onAudioTimeUpdate = (e: any) => {
    songPositionElement.current!.value = e.target.currentTime;
    currentTimeDisplay.current!.innerText = formatDuration(Math.round(e.target.currentTime));
  }

  const addToLikedSongs = async (songID: SongID) => {
    if (!currentlyPlaying.current) return;
    const likedSongData: TLikedSongData = { songID, dateAdded: Date.now() };
    const updatedSongData = [...likedSongs, likedSongData];
    setLikedSongs(updatedSongData);

    const { error } = await supabase
      .from("UserMusicLibrary")
      .update({ "likedSongs": updatedSongData })
      .eq("userID", userID);

    if (error) {
      console.error("error adding song to liked songs: ", error);
      throw error;
    }
  }

  const removeFromLikedSongs = async (songID: SongID) => {
    if (!currentlyPlaying.current) return;
    const updatedLikedSongs = likedSongs.filter((song: TLikedSongData) => song.songID !== songID);
    setLikedSongs(updatedLikedSongs);

    const { error } = await supabase
      .from("UserMusicLibrary")
      .update({ "likedSongs": updatedLikedSongs })
      .eq("userID", userID);

    if (error) {
      console.error("error removing song from liked songs: ", error);
      throw error;
    }
  }

  const onKeyDown = useCallback((e: any) => {
    // toggle play/pause on spacebar press
    if (e.code === "Space") {
      e.preventDefault();
      setPaused(prevPaused => !prevPaused);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  if (loading) {
    return ( <Loading /> );
  }

  return (
    <>
      <SideNav queue={ queue } playlists={ playlists } setActivePlaylist={ setActivePlaylist } />
      <main id="home-main">
        {
          activePlaylist
          ? <PlaylistDisplay playlist={ activePlaylist } />
          : <LikedSongsDisplay likedSongs={ likedSongs } onClickPlaySong={ onClickPlaySong } removeFromLikedSongs={ removeFromLikedSongs } addToLikedSongs={ addToLikedSongs } />
        }
      </main>
      <div id="audio-controls" className={ loadingNextSong ? "shadow-5-strong d-flex justify-content-center align-items-center" : "shadow-5-strong" }>
        {
          loadingNextSong &&
          <div className="d-flex justify-content-center align-items-center">
            {/* This image is here to make the spinner take up the whole box */}
            <img height="50px" className="mb-1" />
            <div className="loading-song-spinner">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        }
        { !loadingNextSong && <>
          {
            currentlyPlaying.current &&
            <div className="d-flex">
              {/* This image is here to make the spinner take up the whole box */}
              <img height="50px" className="mb-1" />
              <img src={ currentlyPlaying.current?.imageURL } alt={ currentlyPlaying.current?.title } height="50px" />
              <div className="ms-3">
                <h5>{ currentlyPlaying.current?.title }</h5>
                <h6>{ currentlyPlaying.current?.artists }</h6>
              </div>
              <div className="d-flex align-items-center">
                {
                  likedSongs.find((song: TLikedSongData) => song.songID === currentlyPlaying.current?.id)
                  ? <a role="button" onClick={ () => removeFromLikedSongs(currentlyPlaying.current!.id) }><i className="fas fa-heart ms-3 fa-lg musica-light-pink"></i></a>
                  : <a role="button" onClick={ () => addToLikedSongs(currentlyPlaying.current!.id) }><i className="far fa-heart ms-3 fa-lg musica-light-pink"></i></a>
                }
              </div>
            </div>
          }
          { !currentlyPlaying.current && <h5 className="text-center">No song currently playing</h5> }
          <audio className="ac-audio" controls src={ currentlyPlayingAudioURL.current } ref={ audioRef } onError={ handleAudioError } onEnded={ playNextSong } onTimeUpdate={ onAudioTimeUpdate }></audio>
          <div className="center-controls d-flex justify-content-center align-items-center">
            <div className="d-flex">
              <span className="me-2" ref={ currentTimeDisplay }>{ currentlyPlaying.current ? formatDuration(Math.round(audioRef.current?.currentTime || 0)) : "0.00" }</span>
              <div className="range" data-mdb-range-init>
                <input type="range" className="form-range" id="song-position" ref={ songPositionElement } onChange={ onSongPositionChange } max={ currentlyPlaying.current?.duration } value="0" />
              </div>
              <span className="ms-2">{ currentlyPlaying.current && formatDuration(currentlyPlaying.current!.duration) }</span>
            </div>
            <div>
              {
                paused
                ? <button className="btn-floating musica-btn" onClick={ () => { if (currentlyPlaying.current) setPaused(false) } }><i className="fas fa-circle-play"></i></button>
                : <button className="btn-floating musica-btn" onClick={ () => setPaused(true) }><i className="fas fa-pause"></i></button>
              }
            </div>
          </div>
          <div className="right-controls">
            <div className="d-flex align-items-center white-color">
              {
                volume == 0
                ? <i className="fas fa-volume-xmark me-2"></i>
                : volume <= 50
                ? <i className="fas fa-volume-low me-2"></i>
                : <i className="fas fa-volume-high me-2"></i>
              }
              <div className="range" data-mdb-range-init>
                <input type="range" className="form-range" id="volume-slider" onChange={ onVolumeChange } />
              </div>
            </div>
          </div>
        </> }
      </div>
    </>
  );
}
 
export default Home;
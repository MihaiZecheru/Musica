import supabase from "../config/supabase";
import ISong from "../database-types/ISong";
import ExtractAudioURL from "./ExtractAudioURL";
import { GetUserID } from "./GetUser";
import PlayAudio from "./PlayAudio";

export default async function playSong(song: ISong) {
  if (song.id === await getCurrentlyPlaying(song)) return;
  setCurrentlyPlaying(song);
  PlayAudio(await ExtractAudioURL(song.videoID));
}

async function setCurrentlyPlaying(song: ISong) {
  const { error } = await supabase
    .from("UserMusicLibrary")
    .update({ currentlyPlaying: song.id })
    .eq("userID", await GetUserID());

  if (error) {
    console.log("Error setting currently playing song:", error);
    throw error;
  }
}

async function getCurrentlyPlaying(song: ISong) {
  const { data, error } = await supabase
    .from("UserMusicLibrary")
    .select("currentlyPlaying")
    .eq("userID", await GetUserID());

  if (error) {
    console.log("Error getting currently playing song:", error);
    throw error;
  }

  return data[0].currentlyPlaying;
}
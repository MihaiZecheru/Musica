import supabase from "../config/supabase";
import ISong from "../database-types/ISong";
import { GetUserID } from "./GetUser";

export async function setCurrentlyPlayingInDB(song: ISong) {
  const { error } = await supabase
    .from("UserMusicLibrary")
    .update({ currentlyPlaying: song.id })
    .eq("userID", await GetUserID());

  if (error) {
    console.log("Error setting currently playing song:", error);
    throw error;
  }
}

export async function getCurrentlyPlayingFromDB(song: ISong) {
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
import supabase from "../config/supabase";
import { SongID, UserID } from "../database-types/ID";
import { GetUserID } from "./GetUser";

export async function getQueue(): Promise<SongID[]> {
  const userID: UserID = await GetUserID();

  const { data, error } = await supabase
    .from("UserMusicLibrary")
    .select('songQueue')
    .eq('userID', userID);

  if (error) {
    console.error('error fetching queue: ', error);
    throw error;
  }

  return data![0].songQueue;
}

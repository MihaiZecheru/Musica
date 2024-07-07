import supabase from "../config/supabase";
import { SongID, UserID } from "../database-types/ID";
import ISong from "../database-types/ISong";
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

export async function prependQueue(song: ISong) {
  const queue: SongID[] = await getQueue();
  queue.unshift(song.id);

  const { error: error_updateQueue } = await supabase
    .from("UserMusicLibrary")
    .update({ songQueue: queue })
    .eq('userID', await GetUserID());

  if (error_updateQueue) {
    console.error('error updating queue: ', error_updateQueue);
    throw error_updateQueue;
  }
}

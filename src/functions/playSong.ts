import supabase from "../config/supabase";
import { SongID } from "../database-types/ID";
import ISong from "../database-types/ISong";
import ExtractAudioURL from "./ExtractAudioURL";
import { GetUserID } from "./GetUser";
import PlayAudio from "./PlayAudio";
import getQueue from "./getQueue";

export default async function playSong(song: ISong) {
  const queue: SongID[] = await getQueue();
  if (queue.length > 0 && queue[0] === song.id) return;
  prependQueue(song, queue);
  PlayAudio(await ExtractAudioURL(song.videoID));
}

async function prependQueue(song: ISong, existingQueue: SongID[]) {
  existingQueue.unshift(song.id);

  const { error: error_updateQueue } = await supabase
    .from("UserMusicLibrary")
    .update({ songQueue: existingQueue })
    .eq('userID', await GetUserID());

  if (error_updateQueue) {
    console.error('error updating queue: ', error_updateQueue);
    throw error_updateQueue;
  }
}

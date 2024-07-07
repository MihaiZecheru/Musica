import supabase from "../config/supabase";
import { SongID, VideoID } from "../database-types/ID";

export default async function addSongToSupabase(videoID: VideoID, title: string, artists: string, year: number, duration: number, imageURL: string, spotifySongID: string): Promise<SongID> {
  const { data, error } = await supabase
    .from('Songs')
    .insert([{ videoID, title, artists, year, duration, imageURL, spotifySongID }])
    .select('id');

  if (error) {
    console.error('Error adding song to database:', error);
    throw error;
  }

  return data[0].id;
}
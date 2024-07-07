import supabase from "../config/supabase";
import { SongID } from "../database-types/ID";
import ISong from "../database-types/ISong";

export default async function GetSong(id: SongID): Promise<ISong> {
  const { data: data_song, error: error_song } = await supabase
    .from("Songs")
    .select()
    .eq('id', id);

  if (error_song) {
    console.error("error fetching song: ", error_song);
    throw error_song;
  }

  return data_song![0] as ISong;
}
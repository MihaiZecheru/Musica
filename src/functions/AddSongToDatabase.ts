import supabase from "../config/supabase";

export default async function addSongToSupabase(videoURL: string, title: string, artists: string, year: number, duration: number, imageURL: string, spotifySongID: string) {
  const { error } = await supabase
    .from('Songs')
    .insert([{ videoURL, title, artists, year, duration, imageURL, spotifySongID }]);

  if (error) {
    console.error('Error adding song to database:', error);
    return;
  }
}
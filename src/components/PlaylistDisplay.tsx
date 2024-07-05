import { useEffect, useState } from "react";
import IPlaylist from "../database-types/IPlaylist";
import { SongID } from "../database-types/ID";
import supabase from "../config/supabase";
import ISong from "../database-types/ISong";

interface Props {
  playlist: IPlaylist
}

const PlaylistDisplay = ({ playlist }: Props) => {
  const [songs, setSongs] = useState<ISong[]>([]);

  useEffect(() => {
    (async () => {
      const songIDs: SongID[] = playlist.songs.map(song => song.songID);
      const { data: songs, error } = await supabase
        .from("Songs")
        .select()
        .in('id', songIDs);

      if (error) {
        console.error(`error fetching songs from playlist '${playlist.id}': `, error);
        throw error;
      }

      setSongs(songs);
    })();
  }, []);
  
  return (
    <div>
      <h1>{ playlist.title }</h1>
      <h2>{ playlist.description }</h2>
      <img src={ playlist.imageURL } alt={playlist.title} />
      <ul>
        {
          songs.map(song => (
            <li key={ song.id }>
              <h3>{ song.title }</h3>
              <h4>{ song.artists }</h4>
              <img src={ song.imageURL } alt={ song.title } />
            </li>
          ))
        }
      </ul>
    </div>
  );
}
 
export default PlaylistDisplay;
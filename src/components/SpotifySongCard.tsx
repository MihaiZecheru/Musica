import { useEffect, useState } from 'react';
import AddSongToMusica from '../functions/AddSongToMusica';
import { SpotifyAPISong } from "../functions/spotifyService";

const SpotifySongCard = ( { song, _addedStatus }: { song: SpotifyAPISong, _addedStatus: "added" | "not-added" }) => {
  const [addedStatus, setAddedStatus] = useState<"added" | "not-added">("not-added");
  
  useEffect(() => {
    setAddedStatus(_addedStatus);
  }, []);

  // TODO: make the color alternate between cards, pink then blue, using the index. even index is blue odd is pink
  return (
    <div className="card-spc d-flex justify-content-center">
      <div className="card-body-spc">
        <div className="song-img-box">
          <img src={ song.album.images[1].url } className="card-img-spc" alt="song" />
        </div>
        <div className="song-info-box">
          <a href={ song.external_urls.spotify } target="_blank" className="card-link-spc" title="Listen on Spotify"><h5 className="card-title-spc text-truncate" style={{ "maxWidth": "300px" }}>{ song.name }</h5></a>
          <p className="card-artists-spc text-truncate" style={{ "maxWidth": "300px" }}>
            { song.artists.map((artist: { name: string }) => artist.name).join(', ') }
          </p>
        </div>
        {
          song.preview_url &&
          <audio className="audio-spc" controls>
            <source src={ song.preview_url } type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        }
        <button className="btn btn-spc" onClick={ () => {
          if (addedStatus === "added") return;
          setAddedStatus("added");
          AddSongToMusica(song);
          } }><i className={ addedStatus === "added" ? "fas fa-check fa-lg" : "fas fa-plus fa-lg" }></i><span> { addedStatus === "added" ? "Added" : "Add" } to Musica</span></button>
      </div>
    </div>
  );
}
 
export default SpotifySongCard;
import { MouseEventHandler, useEffect, useState } from 'react';
import AddSongToMusica from '../functions/AddSongToMusica';
import { SpotifyAPISong } from "../functions/spotifyService";
import { initMDB, Dropdown, Ripple } from 'mdb-ui-kit';

const AddedSpotifySongCard = ( { song, songIsLiked, onSongLikeToggle }: { song: SpotifyAPISong, songIsLiked: boolean, onSongLikeToggle: MouseEventHandler }) => {
  useEffect(() => {
    initMDB({ Dropdown, Ripple });
  }, []);

  const onCardContextMenu = (e: any) => {
    e.preventDefault();
    const card = e.target.closest('.card-spc');
    new Dropdown(card.querySelector('.btn-spc-dropdown')).toggle();
  }

  // TODO: make the color alternate between cards, pink then blue, using the index. even index is blue odd is pink
  return (
    <div className="card-spc d-flex justify-content-center" onContextMenu={ onCardContextMenu }>
      <div className="card-body-spc">
        <div className="song-img-box">
          <img src={ song.album.images[1].url } className="card-img-spc no-drag" alt="song" />
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
        {/* Do nothing on btn click since the song is already added */}
        <div className="btn-group w-100">
          <button className="btn btn-spc btn-added">
            <i className="fas fa-check fa-lg"></i><span> Added to Musica</span>
          </button>
          <button
            id={ 'dropdown-' + song.id }
            type="button"
            className="btn dropdown-toggle dropdown-toggle-split btn-spc-dropdown"
            data-mdb-dropdown-init
            data-mdb-toggle="dropdown"
            data-mdb-ripple-init
            aria-expanded="false"
          >
            <i className="fas fa-bars fa-lg"></i>
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#"><i className="fas fa-plus"></i> Add to playlist</a></li>
            <li><a className="dropdown-item" role="button" onClick={ onSongLikeToggle }> { songIsLiked ? <div><i className="fas fa-heart"></i><span> Remove liked song</span></div> : <div><i className="far fa-heart"></i><span> Like song</span></div> }</a></li>
            <li><a className="dropdown-item" href="#">Something else here</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#">Separated link</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
 
export default AddedSpotifySongCard;
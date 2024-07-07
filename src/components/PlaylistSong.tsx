import { useState } from "react";
import ISong from "../database-types/ISong";
import formatDate from "../functions/formatDate";
import formatDuration from "../functions/formatDuration";
import playSong from "../functions/playSong";

interface Props {
  song: ISong;
  position: number;
  dateAdded: number;
}

const PlaylistSong = ({ song, position, dateAdded }: Props) => {
  const [showPlayButton, setShowPlayButton] = useState<boolean>(false);

  const date = formatDate(new Date(dateAdded));
  
  return (
    <div key={ song.id } className="w-100 ps-3 mb-2 playlist-song no-drag" onMouseEnter={ () => setShowPlayButton(true) } onMouseLeave={ () => setShowPlayButton(false) }>
      <div className="w-100 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center" onClick={ showPlayButton ? () => { playSong(song) } : () => {} } >
          {
            showPlayButton
            ? <a role="button" onClick={ () => { playSong(song) } }><i className="fas fa-play me-3 white-color"></i></a>
            : <h5 className="musica-dark-pink me-3 no-drag">{ position + 1 }</h5>
          }
          <img src={ song.imageURL } alt={ song.title } height="60px" />
          <div className="v-stack ms-3">
            <h4 className="no-margin-bottom musica-dark-blue text-truncate song-title">{ song.title }</h4>
            <h6 className="white-color mb-0 text-truncate">{ song.artists }</h6>
          </div>
        </div>
        <div className="white-color">
          <h5 className="no-drag mb-0">{ date }</h5>
        </div>
        <div className="white-color pe-5 d-flex align-items-center duration">
          <i className="fas fa-heart white-color"></i>
          <i className="fas fa-ellipsis white-color ms-3 me-3"></i>
          <h5 className="no-drag mb-0">{ formatDuration(song.duration) }</h5>
        </div>
      </div>
    </div>
  );
}
 
export default PlaylistSong;
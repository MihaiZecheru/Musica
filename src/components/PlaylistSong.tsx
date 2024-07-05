import ISong from "../database-types/ISong";

interface Props {
  song: ISong;
  position: number;
  dateAdded: number;
}

function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const PlaylistSong = ({ song, position, dateAdded }: Props) => {
  const date = new Date(dateAdded);
  const dateString = `${months[date.getMonth() + 1]} ${date.getDate()}, ${date.getFullYear()}`;
  
  return (
    <div key={ song.id } className="w-100 ps-3 mb-2 playlist-song">
      <div className="w-100 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <h5 className="musica-dark-pink me-3 no-drag">{ position + 1 }</h5>
          <img src={ song.imageURL } alt={ song.title } height="60px" />
          <div className="v-stack ms-3">
            <h4 className="no-margin-bottom musica-dark-blue text-truncate song-title">{ song.title }</h4>
            <h6 className="white-color text-truncate">{ song.artists }</h6>
          </div>
        </div>
        <div className="white-color">
          <h5 className="no-drag">{ dateString }</h5>
        </div>
        {/* <i className="fas fa-heart musica-dark-pink"></i> */}
        <div className="white-color pe-4">
          <h5 className="no-drag">{ formatDuration(song.duration) }</h5>
        </div>
      </div>
    </div>
  );
}
 
export default PlaylistSong;
import { YoutubeAPIVideo } from '../types';

const YoutubeVideoCard = ({ video }: { video: YoutubeAPIVideo }) => {
  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col position-relative" style={{ "maxWidth": "fit-content" }}>
          <img src={video.thumbnail} alt={video.title} className="img-fluid" />
          <div className="duration-overlay">{video.duration}</div>
        </div>
        <div className="col">
          <div className="card-body">
            <h5 className="card-title">{video.title}</h5>
            <p className="card-text">{video.description}</p>
            <a href={video.url} target="_blank" rel="noreferrer" className="btn btn-primary">Watch</a>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default YoutubeVideoCard;
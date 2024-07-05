import { Link } from "react-router-dom";
import IPlaylist from "../database-types/IPlaylist";
import ISong from "../database-types/ISong";
import logo from "../musica.png"
import { PlaylistID } from "../database-types/ID";

interface Props {
  playlists: IPlaylist[];
  queue: ISong[];
  setActivePlaylist: (playlist: IPlaylist | null) => void;
}

const SideNav = ({ playlists, queue, setActivePlaylist }: Props) => {
  const playlistElementClick = (playlistID: PlaylistID) => {
    // show songs on playlist click
    const playlist: IPlaylist = playlists.find((p: IPlaylist) => p.id === playlistID) as IPlaylist;
    setActivePlaylist(playlist);
  }

  return (
    <nav
      data-mdb-sidenav-init
      id="sidenav-9"
      className="sidenav sidenav-sm no-drag"
      data-mdb-hidden="false"
      data-mdb-accordion="true"
    >
      <a
        data-mdb-ripple-init
        className="d-flex justify-content-center py-4 mb-3 no-drag"
        style={{ "borderBottom": "2px solid #f5f5f5", "maxHeight": "103.62px" }}
        href="#!"
        data-mdb-ripple-color="#FF5F89"
      >
        <div className="d-flex justify-content-center align-items-center">
          <img
            id="musica-logo"
            src={ logo }
            alt="Musica Logo"
            draggable="false"
            width="25%"
          />
          <h1 style={{ "color": "var(--musica-blue-dark)", "marginLeft": ".5rem" }}>Musica</h1>
        </div>
      </a>

      <ul className="sidenav-menu px-2 pb-5">
        <li className="sidenav-item">
          <span className="sidenav-subheading text-muted">Playlists</span>
          <Link className="sidenav-link no-drag" to="">
            <i className="fas fa-plus fa-fw me-3"></i><span>Create</span>
          </Link>
        </li>
        <li className="sidenav-item">
          <Link className="sidenav-link no-drag" to="">
            <i className="fas fa-magnifying-glass fa-fw me-3"></i><span>Discover</span>
          </Link>
        </li>

        <li className="sidenav-item pt-3">
          <span className="sidenav-subheading text-muted">Library</span>
          <a className="sidenav-link" role="button" onClick={ () => setActivePlaylist(null) }>
            <i className="fas fa-heart fa-fw me-3"></i><span>Liked Songs</span></a>
        </li>

        {
          playlists.reverse().map((playlist: IPlaylist) => (
            <li className="sidenav-item" key={ playlist.id }>
              <a className="sidenav-link" role="button" onClick={ () => playlistElementClick(playlist.id) }>
                <i className="fas fa-music fa-fw me-3"></i><span className="text-truncate">{ playlist.title }</span>
              </a>
            </li>
          ))
        }

        <li className="sidenav-item pt-3">
          <span className="sidenav-subheading text-muted">Queue</span>
          <Link className="sidenav-link no-drag" to="/search">
            <i className="fas fa-plus fa-fw me-3"></i><span>Add To Queue</span>
          </Link>
        </li>

        {
          queue.length > 0 &&
          queue.reverse().map((song: ISong) => (
            <li className="sidenav-item" key={ song.id }>
              <a className="sidenav-link" role="button">
                <i className="fas fa-music fa-fw me-3"></i><span className="text-truncate">{ song.title }</span>
              </a>
            </li>
          ))
        }
      </ul>
    </nav>
  );
}
 
export default SideNav;
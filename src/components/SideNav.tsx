import { Link } from "react-router-dom";
import IPlaylist from "../database-types/IPlaylist";
import ISong from "../database-types/ISong";
import logo from "../musica.png"

interface Props {
  playlists: IPlaylist[];
  queue: ISong[];
}

const SideNav = ({ playlists, queue }: Props) => {
  return (
    <nav
      data-mdb-sidenav-init
      id="sidenav-9"
      className="sidenav sidenav-sm"
      data-mdb-hidden="false"
      data-mdb-accordion="true"
    >
      <a
        data-mdb-ripple-init
        className="d-flex justify-content-center py-4 mb-3"
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
          <a className="sidenav-link" href="">
            <i className="fas fa-plus fa-fw me-3"></i><span>Create</span></a>
        </li>
        <li className="sidenav-item">
          <a className="sidenav-link" href="">
            <i className="fas fa-magnifying-glass fa-fw me-3"></i><span>Discover</span></a>
        </li>

        <li className="sidenav-item pt-3">
          <span className="sidenav-subheading text-muted">Library</span>
          <a className="sidenav-link" role="button">
            <i className="fas fa-heart fa-fw me-3"></i><span>Liked Songs</span></a>
        </li>

        {
          playlists.reverse().map((playlist: IPlaylist) => (
            <li className="sidenav-item" key={ playlist.id }>
              <a className="sidenav-link" role="button">
                <i className="fas fa-music fa-fw me-3"></i><span className="text-truncate">{ playlist.title }</span>
              </a>
            </li>
          ))
        }

        <li className="sidenav-item pt-3">
          <span className="sidenav-subheading text-muted">Queue</span>
          <Link className="sidenav-link" to="/search">
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
import logo from "../musica.png";
import { useEffect, useState } from "react";
import { initMDB, Input, Ripple } from 'mdb-ui-kit';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserID } from "../database-types/ID";
import GetUser from "../functions/GetUser";
import supabase from "../config/supabase";
import { User } from "@supabase/supabase-js";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/home';
  const [userPfp, setUserPfp] = useState<string>("https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png");
  const [userID, setUserID] = useState<UserID | null>(null);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [dropdownStatus, setDropdownStatus] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const user: User = await GetUser();
      setUserID(user.id as UserID);

      const userPFP = localStorage.getItem('userPFP');
      if (userPFP !== null) {
        setUserPfp(userPFP);
      } else {
        const { data, error } = await supabase
          .from("UserInfo")
          .select('imageURL')
          .eq('id', user.id);

        if (error) {
          console.error('Error fetching user info: ', error);
          throw error;
        }

        setUserPfp(data[0].imageURL);
        localStorage.setItem('userPFP', data[0].imageURL);
      }

      setShowContent(true);
    })();
  }, []);

  useEffect(() => {
    initMDB({ Input, Ripple });
  }, [showContent]);

  const handlePFPClick = () => {
    const dropdownMenu = document.getElementById('user-pfp-dropdown-navbar-menu') as HTMLUListElement;

    if (dropdownStatus) {
      console.log('hidden');
      setDropdownStatus(false);
      dropdownMenu.classList.remove('show');
    } else {
      console.log('showed');
      setDropdownStatus(true);
      dropdownMenu.classList.add('show');
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const searchbox = document.getElementById("searchbox-navbar") as HTMLInputElement;
      const searchQuery = searchbox.value.trim();
      if (!searchQuery) return;
      navigate(`/search/?q=${searchQuery}`);
    }
  }

  if (!showContent) return (<></>);
  return (
    <div id="navbar" className={ isHome ? 'navbar-home-left-margin': ''}>
      <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary pt-2 pb-2">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {
              !isHome &&
              <Link className="navbar-brand mt-2 mt-lg-0" to="/home">
                <img
                  src={ logo }
                  height="30"
                  alt="Musica Logo"
                  loading="lazy"
                />
              </Link>
            }
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex align-items-center">
              <li className="nav-item">
                <div className="d-flex align-items-center">
                  <div className="form-outline" data-mdb-input-init style={{ "maxWidth": "15rem" }}>
                    <i className="fas fa-magnifying-glass trailing"></i>
                    <input type="text" id="searchbox-navbar" className="form-control form-icon-trailing" onKeyDown={ handleKeyDown } />
                    <label className="form-label" htmlFor="searchbox-navbar">Find new music</label>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="d-flex align-items-center">
            <Link className="text-reset me-2" to="/queue">
              <i className="fas fa-stream"></i>
              <i className="fas fa-music"></i>
            </Link>

            <div className="dropdown" id="user-pfp-dropdown-navbar">
              <a
                data-mdb-dropdown-init
                className="dropdown-toggle d-flex align-items-center hidden-arrow"
                id="user-pfp-dropdown-navbar-button"
                role="button"
                aria-expanded="false"
                onClick={ handlePFPClick }
              >
                <img
                  src={ userPfp }
                  className="rounded-circle"
                  height="25"
                  alt="Profile"
                  loading="lazy"
                />
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="user-pfp-dropdown-navbar-button"
                id="user-pfp-dropdown-navbar-menu"
                style={{ "position": "absolute", "inset": "0px 0px auto auto", "margin": "0px", "transform": "translate(0px, 27px)" }}
              >
                <li>
                  <Link className="dropdown-item" to={ `/profile/${userID}` }>My profile</Link> { /* TODO: include friends here. display current pfp and allow change. have option to change username too */}
                </li>
                <li>
                  <Link className="dropdown-item" to="/search/playlist">Find Playlists</Link> { /* Search for a new playlist. have option for creating a new one yourself */ }
                </li>
                <li>
                  <Link className="dropdown-item" to="/create-playlist">Create Playlist</Link> { /* TODO: allow option for importing an existing playlist here, make it noticable, easily visible */ }
                </li>
                <li>
                  <Link className="dropdown-item" to="/logout">Logout</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
 
export default Navbar;
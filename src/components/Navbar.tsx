import logo from "../musica.png";
import { useEffect, useState } from "react";
import { initMDB, Input } from 'mdb-ui-kit';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [userPfp, setUserPfp] = useState<string>("https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"); // TODO: make dynamic

  useEffect(() => {
    initMDB({ Input });
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const searchbox = document.getElementById("searchbox-navbar") as HTMLInputElement;
      const searchQuery = searchbox.value.trim();
      navigate(`/search/?q=${searchQuery}`);
    }
  }

  return (
    <div id="navbar">      
      <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <a className="navbar-brand mt-2 mt-lg-0" href="/home">
              <img
                src={ logo }
                height="30"
                alt="Musica Logo"
                loading="lazy"
              />
            </a>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex align-items-center">
              <li className="nav-item">
                <a className="nav-link" href="/queue"><i className="fas fa-stream"></i><span> Queue</span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/search">
                  <div className="d-flex align-items-center">
                    <div className="form-outline" data-mdb-input-init style={{ "maxWidth": "15rem" }}>
                      <i className="fas fa-magnifying-glass trailing"></i>
                      <input type="text" id="searchbox-navbar" className="form-control form-icon-trailing" onKeyDown={ handleKeyDown } onClick={ (e) => e.preventDefault() }/>
                      <label className="form-label" htmlFor="searchbox-navbar">Find new music</label>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <div className="d-flex align-items-center">
            <a className="text-reset me-3" href="#">
              <i className="fas fa-shopping-cart"></i>
            </a>

            <div className="dropdown">
              <a
                data-mdb-dropdown-init
                className="text-reset me-3 dropdown-toggle hidden-arrow"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                aria-expanded="false"
              >
                <i className="fas fa-bell"></i>
                <span className="badge rounded-pill badge-notification bg-danger">1</span>
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <a className="dropdown-item" href="#">Some news</a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">Another news</a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">Something else here</a>
                </li>
              </ul>
            </div>
            <div className="dropdown">
              <a
                data-mdb-dropdown-init
                className="dropdown-toggle d-flex align-items-center hidden-arrow"
                href="#"
                id="navbarDropdownMenuAvatar"
                role="button"
                aria-expanded="false"
              >
                <img
                  src={ userPfp }
                  className="rounded-circle"
                  height="25"
                  alt="Porfile"
                  loading="lazy"
                />
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdownMenuAvatar"
              >
                <li>
                  <a className="dropdown-item" href="#">My profile</a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">Settings</a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">Logout</a>
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
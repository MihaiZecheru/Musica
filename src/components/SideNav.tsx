import IPlaylist from "../database-types/IPlaylist";

interface Props {
  playlists: IPlaylist[];
}

const SideNav = ({ playlists }: Props) => {
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
        style={{ "borderBottom": "2px solid #f5f5f5" }}
        href="#!"
        data-mdb-ripple-color="primary"
      >
        <img
          id="MDB-logo"
          src="https://mdbcdn.b-cdn.net/wp-content/uploads/2018/06/logo-mdb-jquery-small.webp"
          alt="MDB Logo"
          draggable="false"
        />
      </a>

      <ul className="sidenav-menu px-2 pb-5">
        <li className="sidenav-item">
          <a className="sidenav-link" href="">
            <i className="fas fa-tachometer-alt fa-fw me-3"></i><span>Overview</span></a>
        </li>

        <li className="sidenav-item pt-3">
          <span className="sidenav-subheading text-muted">Create</span>
          <a className="sidenav-link" href="">
            <i className="fas fa-plus fa-fw me-3"></i><span>Project</span></a>
        </li>
        <li className="sidenav-item">
          <a className="sidenav-link" href="">
            <i className="fas fa-plus fa-fw me-3"></i><span>Database</span></a>
        </li>

        <li className="sidenav-item pt-3">
          <span className="sidenav-subheading text-muted">Manage</span>
          <a className="sidenav-link" href="">
            <i className="fas fa-cubes fa-fw me-3"></i><span>Projects</span></a>
        </li>
        <li className="sidenav-item">
          <a className="sidenav-link" href="">
            <i className="fas fa-database fa-fw me-3"></i><span>Databases</span></a>
        </li>
        <li className="sidenav-item">
          <a className="sidenav-link" href="">
            <i className="fas fa-stream fa-fw me-3"></i><span>Custom domains</span></a>
        </li>
        <li className="sidenav-item">
          <a className="sidenav-link" href="">
            <i className="fas fa-code-branch fa-fw me-3"></i><span>Repositories</span></a>
        </li>
        <li className="sidenav-item">
          <a className="sidenav-link" href="">
            <i className="fas fa-users fa-fw me-3"></i><span>Team</span></a>
        </li>

        <li className="sidenav-item pt-3">
          <span className="sidenav-subheading text-muted">Maintain</span>
          <a className="sidenav-link" href="">
            <i className="fas fa-chart-pie fa-fw me-3"></i><span>Analytics</span></a>
        </li>
        <li className="sidenav-item">
          <a className="sidenav-link" href="">
            <i className="fas fa-sync fa-fw me-3"></i><span>Backups</span></a>
        </li>
        <li className="sidenav-item">
          <a className="sidenav-link" href="">
            <i className="fas fa-shield-alt fa-fw me-3"></i><span>Security</span></a>
        </li>

        <li className="sidenav-item pt-3">
          <span className="sidenav-subheading text-muted">Admin</span>
          <a className="sidenav-link" href="">
            <i className="fas fa-money-bill fa-fw me-3"></i><span>Billing</span></a>
        </li>
        <li className="sidenav-item">
          <a className="sidenav-link" href="">
            <i className="fas fa-file-contract fa-fw me-3"></i><span>License</span></a>
        </li>

        <li className="sidenav-item pt-3">
          <span className="sidenav-subheading text-muted">Tools</span>
          <a className="sidenav-link" href="">
            <i className="fas fa-hand-pointer fa-fw me-3"></i><span>Drag & drop builder</span></a>
        </li>
        <li className="sidenav-item">
          <a className="sidenav-link" href="">
            <i className="fas fa-code fa-fw me-3"></i><span>Online code editor</span></a>
        </li>
        <li className="sidenav-item">
          <a className="sidenav-link" href="">
            <i className="fas fa-copy fa-fw me-3"></i><span>SFTP</span></a>
        </li>
        <li className="sidenav-item">
          <a className="sidenav-link" href="">
            <i className="fab fa-jenkins fa-fw me-3"></i><span>Jenkins</span></a>
        </li>
        <li className="sidenav-item">
          <a className="sidenav-link" href="">
            <i className="fab fa-gitlab fa-fw me-3"></i><span>GitLab</span></a>
        </li>
      </ul>
    </nav>
  );
}
 
export default SideNav;
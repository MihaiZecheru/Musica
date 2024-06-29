import { useState } from "react";
import IPlaylist from "../database-types/IPlaylist";
import SideNav from "./SideNav";

const Home = () => {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <>
      <SideNav playlists={ playlists }/>
    </>
  );
}
 
export default Home;
import Display from "../components/music/Display";
import Player from "../components/music/Player";
import Sidebar from "../components/music/Sidebar";
import { useMusic } from "../context/MusicContext";

export default function MusicApp() {
  const { audioRef } = useMusic();

  return (
    <div className="h-screen bg-black">
        <>
          <div className="h-[90%] flex flex-col lg:flex-row">
            <Sidebar />
            <Display />
          </div>
          <Player />
        </>
      <audio ref={audioRef} preload="auto"></audio>
    </div>
  );
}

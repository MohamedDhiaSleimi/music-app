import Display from "../components/music/Display";
import Player from "../components/music/Player";
import Sidebar from "../components/music/Sidebar";
import { useMusic } from "../context/MusicContext";

export default function MusicApp() {
  const { audioRef, track, songsData } = useMusic();

  return (
    <div className="h-screen bg-black">
      {songsData.length !== 0 ? (
        <>
          <div className="h-[90%] flex">
            <Sidebar />
            <Display />
          </div>
          <Player />
        </>
      ) : null}
      <audio ref={audioRef} src={track?.file || ""} preload="auto"></audio>
    </div>
  );
}

// src/context/MusicContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
} from "react";
import { musicApi } from "../services/musicApi";
import { useAuth } from "./AuthContext";

interface Song {
  _id: string;
  name: string;
  desc: string;
  album: string;
  image: string;
  file: string;
  duration: string;
}

interface Album {
  _id: string;
  name: string;
  desc: string;
  image: string;
  bgColour: string;
}

interface MusicContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  seekBar: React.RefObject<HTMLDivElement>;
  seekBg: React.RefObject<HTMLDivElement>;

  songs: Song[];
  albums: Album[];
  songsData: Song[];
  albumsData: Album[];

  filteredSongsData: Song[];
  filteredAlbumsData: Album[];
  favoriteSongs: Song[];
  favoriteSongIds: Set<string>;
  favoriteUpdatingIds: Set<string>;
  isFavoritesLoading: boolean;
  isFavorite: (songId: string) => boolean;
  toggleFavorite: (songId: string) => Promise<void>;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewFilter: "all" | "music";
  setViewFilter: (filter: "all" | "music") => void;

  track: Song | null;
  setTrack: (song: Song) => void;
  playStatus: boolean;
  setPlayStatus: (status: boolean) => void;

  time: {
    currentTime: { minute: number; second: number };
    totalTime: { minute: number; second: number };
  };

  play: () => void;
  pause: () => void;
  playWithId: (id: string) => void;
  previousSong: () => void;
  nextSong: () => void;
  seekSong: (e: React.MouseEvent<HTMLDivElement>) => void;

  isLooping: boolean;
  toggleLoop: () => void;
  isShuffle: boolean;
  toggleShuffle: () => void;

  volume: number;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isMuted: boolean;
  toggleMute: () => void;

  isLoading: boolean;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const seekBar = useRef<HTMLDivElement>(null);
  const seekBg = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [originalSongs, setOriginalSongs] = useState<Song[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);
  const [favoriteSongIds, setFavoriteSongIds] = useState<Set<string>>(
    new Set()
  );
  const [favoriteUpdatingIds, setFavoriteUpdatingIds] = useState<Set<string>>(
    new Set()
  );

  const [track, setTrack] = useState<Song | null>(null);
  const [playStatus, setPlayStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);

  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [viewFilter, setViewFilter] = useState<"all" | "music">("all");

  // Load music data
  useEffect(() => {
    const loadMusic = async () => {
      try {
        const [songsData, albumsData] = await Promise.all([
          musicApi.getSongs(),
          musicApi.getAlbums(),
        ]);
        setSongs(songsData);
        setAlbums(albumsData);
        setOriginalSongs(songsData);
        if (songsData.length > 0) setTrack(songsData[0]);
      } catch (error) {
        console.error("Failed to load music:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMusic();
  }, []);

  const fetchFavorites = async (userId: string) => {
    setIsFavoritesLoading(true);
    try {
      const favoritesData = await musicApi.getFavorites(userId);
      setFavoriteSongs(favoritesData);
      setFavoriteSongIds(new Set(favoritesData.map((song) => song._id)));
    } catch (error) {
      console.error("Failed to load favorites:", error);
      setFavoriteSongs([]);
      setFavoriteSongIds(new Set());
    } finally {
      setIsFavoritesLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchFavorites(user.userId);
    } else {
      setFavoriteSongs([]);
      setFavoriteSongIds(new Set());
    }
  }, [user?.userId]);

  // Time update
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setTime({
        currentTime: {
          second: Math.floor(audio.currentTime % 60),
          minute: Math.floor(audio.currentTime / 60),
        },
        totalTime: {
          second: Math.floor((audio.duration || 0) % 60),
          minute: Math.floor((audio.duration || 0) / 60),
        },
      });
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);
    if (audio.readyState > 0) updateTime();

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
    };
  }, [track?.file]);

  // Loop
  useEffect(() => {
    if (audioRef.current) audioRef.current.loop = isLooping;
  }, [isLooping]);

  // Shuffle
  useEffect(() => {
    if (isShuffle) {
      setSongs([...songs].sort(() => Math.random() - 0.5));
    } else {
      setSongs(originalSongs);
    }
  }, [isShuffle, originalSongs]);

  // Filtered data
  const filteredSongsData = useMemo(() => {
    if (!searchQuery.trim()) return songs;
    const q = searchQuery.toLowerCase();
    return songs.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
    );
  }, [songs, searchQuery]);

  const filteredAlbumsData = useMemo(() => {
    if (!searchQuery.trim()) return albums;
    const q = searchQuery.toLowerCase();
    return albums.filter((a) => a.name.toLowerCase().includes(q));
  }, [albums, searchQuery]);

  // Player controls
  const play = () => {
    audioRef.current?.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setPlayStatus(false);
  };

  const playWithId = async (id: string) => {
    const song = songs.find((s) => s._id === id);
    if (song) {
      setTrack(song);
      await audioRef.current?.play();
      setPlayStatus(true);
    }
  };

  const previousSong = () => {
    if (!track) return;
    const currentIndex = songs.findIndex((s) => s._id === track._id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : songs.length - 1;
    playWithId(songs[prevIndex]._id);
  };

  const nextSong = () => {
    if (!track) return;
    const currentIndex = songs.findIndex((s) => s._id === track._id);
    const nextIndex = currentIndex < songs.length - 1 ? currentIndex + 1 : 0;
    playWithId(songs[nextIndex]._id);
  };

  const seekSong = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !seekBg.current) return;
    const rect = seekBg.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audioRef.current.currentTime = percentage * audioRef.current.duration;
  };

  const toggleLoop = () => setIsLooping(!isLooping);

  const toggleShuffle = () => setIsShuffle(!isShuffle);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(false);
    if (audioRef.current) audioRef.current.volume = vol;
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (audioRef.current) {
      audioRef.current.volume = newMutedState ? 0 : volume;
    }
  };

  const toggleFavorite = async (songId: string) => {
    if (!user?.userId) return;
    setFavoriteUpdatingIds((prev) => new Set(prev).add(songId));
    try {
      const currentlyFavorite = favoriteSongIds.has(songId);
      if (currentlyFavorite) {
        await musicApi.removeFavorite(user.userId, songId);
      } else {
        await musicApi.addFavorite(user.userId, songId);
      }
      await fetchFavorites(user.userId);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setFavoriteUpdatingIds((prev) => {
        const updated = new Set(prev);
        updated.delete(songId);
        return updated;
      });
    }
  };

  const isFavorite = (songId: string) => favoriteSongIds.has(songId);

  return (
    <MusicContext.Provider
      value={{
        audioRef,
        seekBar,
        seekBg,
        songs,
        albums,
        songsData: filteredSongsData,
        albumsData: filteredAlbumsData,
        filteredSongsData,
        filteredAlbumsData,
        favoriteSongs,
        favoriteSongIds,
        favoriteUpdatingIds,
        isFavoritesLoading,
        isFavorite,
        toggleFavorite,
        searchQuery,
        setSearchQuery,
        viewFilter,
        setViewFilter,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        play,
        pause,
        playWithId,
        previousSong,
        nextSong,
        seekSong,
        isLooping,
        toggleLoop,
        isShuffle,
        toggleShuffle,
        volume,
        handleVolumeChange,
        isMuted,
        toggleMute,
        isLoading,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within MusicProvider");
  return context;
};

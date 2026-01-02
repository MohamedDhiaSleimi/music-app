// src/context/MusicContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  type ReactNode,
} from "react";
import { musicApi } from "../services/musicApi";
import { useAuth } from "./AuthContext";
import type { Album, Playlist, Song } from "../types/music.types";

interface MusicContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  seekBar: React.RefObject<HTMLDivElement>;
  seekBg: React.RefObject<HTMLDivElement>;
  playQueue: Song[];
  clearQueue: () => void;

  songs: Song[];
  albums: Album[];
  songsData: Song[];
  albumsData: Album[];
  playlists: Playlist[];
  discoverPlaylists: Playlist[];
  sharedPlaylist: Playlist | null;

  filteredSongsData: Song[];
  filteredAlbumsData: Album[];
  favoriteSongs: Song[];
  favoriteSongIds: Set<string>;
  favoriteUpdatingIds: Set<string>;
  isFavoritesLoading: boolean;
  isPlaylistsLoading: boolean;
  isDiscoverLoading: boolean;
  isFavorite: (songId: string) => boolean;
  toggleFavorite: (songId: string) => Promise<void>;
  createPlaylist: (payload: { name: string; description?: string; isPublic?: boolean }) => Promise<Playlist | null>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  setPlaylistVisibility: (playlistId: string, isPublic: boolean) => Promise<void>;
  sharePlaylist: (playlistId: string) => Promise<string | null>;
  refreshPlaylists: () => Promise<void>;
  loadPublicPlaylists: () => Promise<void>;
  fetchSharedPlaylist: (shareCode: string) => Promise<void>;
  getPublicPlaylist: (playlistId: string) => Promise<Playlist | null>;

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
  addSongToQueue: (songId: string) => void;
  removeFromQueue: (songId: string) => void;
  moveQueueItem: (songId: string, direction: "up" | "down") => void;
  playAlbum: (albumId: string) => void;
  playPlaylist: (playlistId: string) => void;
  seekSong: (e: React.MouseEvent<HTMLDivElement>) => void;

  loopMode: "off" | "one" | "all";
  cycleLoopMode: () => void;
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
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [discoverPlaylists, setDiscoverPlaylists] = useState<Playlist[]>([]);
  const [sharedPlaylist, setSharedPlaylist] = useState<Playlist | null>(null);
  const [isPlaylistsLoading, setIsPlaylistsLoading] = useState(false);
  const [isDiscoverLoading, setIsDiscoverLoading] = useState(false);

  const [playQueue, setPlayQueue] = useState<Song[]>([]);
  const [track, setTrack] = useState<Song | null>(null);
  const [playStatus, setPlayStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);

  const [loopMode, setLoopMode] = useState<"off" | "one" | "all">("off");
  const [isShuffle, setIsShuffle] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [viewFilter, setViewFilter] = useState<"all" | "music">("all");

  const deterministicNumber = useCallback((seed: string, min = 0, max = 1) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const normalized = (Math.sin(hash) + 1) / 2;
    return min + normalized * (max - min);
  }, []);

  const enrichSongFeatures = useCallback(
    (song: Song): Song => {
      const genreFallbacks = ["pop", "rock", "hip-hop", "electronic", "indie"];
      const genre =
        song.genre ||
        genreFallbacks[
          Math.floor(deterministicNumber(song._id, 0, genreFallbacks.length))
        ];
      const artist =
        song.artist ||
        (song.desc ? song.desc.split("-")[0].trim() : "Unknown Artist");

      return {
        ...song,
        genre,
        artist,
        bpm: song.bpm ?? Math.round(deterministicNumber(song._id + "bpm", 80, 150)),
        energy: song.energy ?? Number(deterministicNumber(song._id + "eng", 0.4, 0.95).toFixed(2)),
        danceability:
          song.danceability ?? Number(deterministicNumber(song._id + "dance", 0.4, 0.95).toFixed(2)),
        valence:
          song.valence ?? Number(deterministicNumber(song._id + "val", 0.3, 0.9).toFixed(2)),
        acousticness:
          song.acousticness ??
          Number(deterministicNumber(song._id + "aco", 0.05, 0.7).toFixed(2)),
        instrumentalness:
          song.instrumentalness ??
          Number(deterministicNumber(song._id + "inst", 0, 0.5).toFixed(3)),
        liveness:
          song.liveness ?? Number(deterministicNumber(song._id + "live", 0.05, 0.6).toFixed(2)),
        speechiness:
          song.speechiness ??
          Number(deterministicNumber(song._id + "speech", 0.02, 0.25).toFixed(2)),
        key: song.key || ["C", "D", "E", "F", "G", "A", "B"][
          Math.floor(deterministicNumber(song._id + "key", 0, 7))
        ],
        releaseYear:
          song.releaseYear ??
          Math.round(deterministicNumber(song._id + "year", 1995, 2023)),
      };
    },
    [deterministicNumber]
  );

  // Load music data
  useEffect(() => {
    const loadMusic = async () => {
      try {
        const [songsData, albumsData] = await Promise.all([
          musicApi.getSongs(),
          musicApi.getAlbums(),
        ]);
        const enrichedSongs = songsData.map(enrichSongFeatures);
        setSongs(enrichedSongs);
        setAlbums(albumsData);
        setOriginalSongs(enrichedSongs);
        if (enrichedSongs.length > 0) {
          setTrack(enrichedSongs[0]);
          setPlayQueue(enrichedSongs);
        }
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

  const refreshPlaylists = useCallback(async () => {
    if (!user?.userId) {
      setPlaylists([]);
      return;
    }

    setIsPlaylistsLoading(true);
    try {
      const playlistsData = await musicApi.getPlaylists(user.userId);
      setPlaylists(playlistsData);
    } catch (error) {
      console.error("Failed to load playlists:", error);
      setPlaylists([]);
    } finally {
      setIsPlaylistsLoading(false);
    }
  }, [user?.userId]);

  const loadPublicPlaylists = useCallback(async () => {
    setIsDiscoverLoading(true);
    try {
      const data = await musicApi.discoverPublicPlaylists(user?.userId);
      setDiscoverPlaylists(data);
    } catch (error) {
      console.error("Failed to load public playlists:", error);
      setDiscoverPlaylists([]);
    } finally {
      setIsDiscoverLoading(false);
    }
  }, [user?.userId]);

  const createPlaylist = async ({
    name,
    description,
    isPublic = false,
  }: {
    name: string;
    description?: string;
    isPublic?: boolean;
  }): Promise<Playlist | null> => {
    if (!user?.userId || !name.trim()) return null;
    try {
      const playlist = await musicApi.createPlaylist({
        name: name.trim(),
        description: description?.trim() || "",
        isPublic,
        userId: user.userId,
      });
      setPlaylists((prev) => [playlist, ...prev]);
      return playlist as Playlist;
    } catch (error) {
      console.error("Failed to create playlist:", error);
      return null;
    }
  };

  const deletePlaylist = async (playlistId: string) => {
    if (!user?.userId) return;
    try {
      await musicApi.deletePlaylist(playlistId, user.userId);
      setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
    } catch (error) {
      console.error("Failed to delete playlist:", error);
    }
  };

  const updatePlaylistInState = (updated: Playlist) => {
    setPlaylists((prev) =>
      prev.map((playlist) => (playlist._id === updated._id ? updated : playlist))
    );
  };

  const addSongToPlaylist = async (playlistId: string, songId: string) => {
    if (!user?.userId) return;
    try {
      const playlist = await musicApi.addSongToPlaylist(
        playlistId,
        songId,
        user.userId
      );
      if (playlist) updatePlaylistInState(playlist);
    } catch (error) {
      console.error("Failed to add song to playlist:", error);
    }
  };

  const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
    if (!user?.userId) return;
    try {
      const playlist = await musicApi.removeSongFromPlaylist(
        playlistId,
        songId,
        user.userId
      );
      if (playlist) updatePlaylistInState(playlist);
    } catch (error) {
      console.error("Failed to remove song from playlist:", error);
    }
  };

  const setPlaylistVisibility = async (playlistId: string, isPublic: boolean) => {
    if (!user?.userId) return;
    try {
      const playlist = await musicApi.setPlaylistVisibility(
        playlistId,
        isPublic,
        user.userId
      );
      if (playlist) updatePlaylistInState(playlist);
    } catch (error) {
      console.error("Failed to update playlist visibility:", error);
    }
  };

  const sharePlaylist = async (playlistId: string) => {
    if (!user?.userId) return null;
    try {
      const { sharePath, shareCode } = await musicApi.sharePlaylist(
        playlistId,
        user.userId
      );
      const path = sharePath || `/playlists/shared/${shareCode}`;
      const absoluteLink = new URL(path, window.location.origin).toString();
      return absoluteLink;
    } catch (error) {
      console.error("Failed to share playlist:", error);
      return null;
    }
  };

  const fetchSharedPlaylist = useCallback(async (shareCode: string) => {
    try {
      const playlist = await musicApi.getSharedPlaylist(shareCode);
      setSharedPlaylist(playlist);
    } catch (error) {
      console.error("Failed to fetch shared playlist:", error);
      setSharedPlaylist(null);
    }
  }, []);

  const getPublicPlaylist = useCallback(async (playlistId: string) => {
    try {
      const playlist = await musicApi.getPublicPlaylist(playlistId);
      return playlist as Playlist;
    } catch (error) {
      console.error("Failed to fetch public playlist:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (user?.userId) {
      fetchFavorites(user.userId);
      refreshPlaylists();
      loadPublicPlaylists();
    } else {
      setFavoriteSongs([]);
      setFavoriteSongIds(new Set());
      setPlaylists([]);
      setDiscoverPlaylists([]);
      setSharedPlaylist(null);
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
    const handleEnded = () => {
      if (loopMode === "one") {
        audio.currentTime = 0;
        audio.play();
        return;
      }
      if (playQueue.length === 0) {
        setPlayStatus(false);
        return;
      }
      const currentIndex = playQueue.findIndex((s) => s._id === track?._id);
      const nextIndex = currentIndex + 1;
      if (nextIndex < playQueue.length) {
        playWithId(playQueue[nextIndex]._id);
      } else if (loopMode === "all") {
        playWithId(playQueue[0]._id);
      } else {
        setPlayStatus(false);
      }
    };

    audio.addEventListener("ended", handleEnded);
    if (audio.readyState > 0) updateTime();

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [track?._id, loopMode, playQueue]);

  // Loop
  useEffect(() => {
    if (audioRef.current) audioRef.current.loop = loopMode === "one";
  }, [loopMode]);

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

  const startPlayback = async (song: Song) => {
    setTrack(song);
    await audioRef.current?.play();
    setPlayStatus(true);
  };

  const playWithId = async (id: string) => {
    const source = playQueue.length ? playQueue : songs;
    const song = source.find((s) => s._id === id) || songs.find((s) => s._id === id);
    if (song) {
      await startPlayback(song);
    }
  };

  const previousSong = () => {
    if (!track) return;
    const source = playQueue.length ? playQueue : songs;
    if (!source.length) return;
    const currentIndex = source.findIndex((s) => s._id === track._id);
    if (currentIndex <= 0 && loopMode === "off") return;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : source.length - 1;
    playWithId(source[prevIndex]._id);
  };

  const nextSong = () => {
    if (!track) return;
    const source = playQueue.length ? playQueue : songs;
    if (!source.length) return;
    const currentIndex = source.findIndex((s) => s._id === track._id);
    if (currentIndex >= source.length - 1 && loopMode === "off") return;
    const nextIndex = currentIndex < source.length - 1 ? currentIndex + 1 : 0;
    playWithId(source[nextIndex]._id);
  };

  const seekSong = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !seekBg.current) return;
    const rect = seekBg.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audioRef.current.currentTime = percentage * audioRef.current.duration;
  };

  const cycleLoopMode = () =>
    setLoopMode((prev) =>
      prev === "off" ? "one" : prev === "one" ? "all" : "off"
    );

  const toggleShuffle = () => setIsShuffle(!isShuffle);

  const addSongToQueue = (songId: string) => {
    const song = songs.find((s) => s._id === songId);
    if (!song) return;
    setPlayQueue((prev) => [...prev, song]);
  };

  const removeFromQueue = (songId: string) => {
    setPlayQueue((prev) => {
      const idx = prev.findIndex((s) => s._id === songId);
      if (idx === -1) return prev;
      const nextQueue = [...prev];
      nextQueue.splice(idx, 1);
      if (track && track._id === songId) {
        const fallback = nextQueue[idx] || nextQueue[idx - 1];
        if (fallback) {
          startPlayback(fallback);
        } else {
          audioRef.current?.pause();
          setPlayStatus(false);
        }
      }
      return nextQueue;
    });
  };

  const moveQueueItem = (songId: string, direction: "up" | "down") => {
    setPlayQueue((prev) => {
      const idx = prev.findIndex((s) => s._id === songId);
      if (idx === -1) return prev;
      const targetIndex = direction === "up" ? idx - 1 : idx + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const nextQueue = [...prev];
      const [item] = nextQueue.splice(idx, 1);
      nextQueue.splice(targetIndex, 0, item);
      return nextQueue;
    });
  };

  const clearQueue = () => {
    setPlayQueue([]);
    audioRef.current?.pause();
    setPlayStatus(false);
  };

  const playAlbum = (albumId: string) => {
    const albumName = albums.find((a) => a._id === albumId)?.name;
    if (!albumName) return;
    const albumSongs = songs.filter((s) => s.album === albumName);
    if (!albumSongs.length) return;
    setPlayQueue(albumSongs);
    startPlayback(albumSongs[0]);
  };

  const playPlaylist = (playlistId: string) => {
    const playlist = playlists.find((p) => p._id === playlistId);
    if (!playlist || !playlist.songs.length) return;
    setPlayQueue(playlist.songs);
    startPlayback(playlist.songs[0]);
  };

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
        playlists,
        discoverPlaylists,
        sharedPlaylist,
        clearQueue,
        filteredSongsData,
        filteredAlbumsData,
        favoriteSongs,
        favoriteSongIds,
        favoriteUpdatingIds,
        isFavoritesLoading,
        isPlaylistsLoading,
        isDiscoverLoading,
        isFavorite,
        toggleFavorite,
        createPlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        setPlaylistVisibility,
        sharePlaylist,
        refreshPlaylists,
        loadPublicPlaylists,
        fetchSharedPlaylist,
        getPublicPlaylist,
        searchQuery,
        setSearchQuery,
        viewFilter,
        setViewFilter,
        playQueue,
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
        addSongToQueue,
        removeFromQueue,
        moveQueueItem,
        playAlbum,
        playPlaylist,
        seekSong,
        loopMode,
        cycleLoopMode,
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

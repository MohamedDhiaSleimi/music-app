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
import { recommendationApi } from "../services/recommendationApi";
import { useAuth } from "./AuthContext";
import type { Album, Playlist, Song } from "../types/music.types";
import type { RecommendationHit } from "../types/recommendation.types";

interface MusicContextType {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  seekBar: React.RefObject<HTMLDivElement | null>;
  seekBg: React.RefObject<HTMLDivElement | null>;
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
  recommendations: RecommendationHit[];
  recommendedAlbums: Album[];
  isRecommendationLoading: boolean;
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
  logActivity: (type: string, metadata?: Record<string, unknown>) => Promise<void>;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewFilter: "all" | "music";
  setViewFilter: (filter: "all" | "music") => void;

  track: Song | null;
  currentQueueIndex: number | null;
  setTrack: (song: Song) => void;
  playStatus: boolean;
  setPlayStatus: (status: boolean) => void;
  isBuffering: boolean;

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
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;

  isLoading: boolean;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const seekBar = useRef<HTMLDivElement>(null);
  const seekBg = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const DEFAULT_SONG_IMAGE = "http://localhost:3000/static/default-song.png";
  const DEFAULT_ALBUM_IMAGE = "http://localhost:3000/static/default-album.png";

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
  const [recommendations, setRecommendations] = useState<RecommendationHit[]>([]);
  const [recommendedAlbums, setRecommendedAlbums] = useState<Album[]>([]);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);

  const [playQueue, setPlayQueue] = useState<Song[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number | null>(null);
  const [track, setTrack] = useState<Song | null>(null);
  const [playStatus, setPlayStatus] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);

  const [loopMode, setLoopMode] = useState<"off" | "one" | "all">("off");
  const [isShuffle, setIsShuffle] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("volume");
    return saved ? parseFloat(saved) : 0.5;
  });
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem("muted") === "true");

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

  const normalizeMediaUrl = useCallback((url?: string) => {
    if (!url) return "";
    try {
      const mediaUrl = new URL(url, window.location.origin);
      if (mediaUrl.hostname === "faker-service") {
        mediaUrl.hostname = window.location.hostname;
        mediaUrl.port = mediaUrl.port || "4002";
      }
      if (mediaUrl.hostname === "music-service") {
        mediaUrl.hostname = window.location.hostname;
        mediaUrl.port = mediaUrl.port || "3000";
      }
      return mediaUrl.toString();
    } catch {
      return url;
    }
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
        file: normalizeMediaUrl(song.file),
      };
    },
    [deterministicNumber, normalizeMediaUrl]
  );

  const normalizeSongs = useCallback(
    (list: Song[]) => list.map((s) => ({ ...s, file: normalizeMediaUrl(s.file) })),
    [normalizeMediaUrl]
  );

  const buildRecommendedAlbums = useCallback(
    (hits: RecommendationHit[]): Album[] => {
      const albumsMap = new Map<string, Album>();
      hits.slice(0, 12).forEach((hit, idx) => {
        const artistName =
          (hit.artists || "Various Artists").split(",")[0].trim() ||
          "Various Artists";
        if (albumsMap.has(artistName)) return;

        const id = hit.id || `${artistName}-${idx}`;
        const hue = Math.floor(deterministicNumber(id, 0, 360));
        const bgColour = `hsl(${hue}, 65%, 70%)`;

        albumsMap.set(artistName, {
          _id: `rec-${id}`,
          name: `${artistName} Mix`,
          desc: hit.name ? `Featuring ${hit.name}` : "Tailored for you",
          image: DEFAULT_ALBUM_IMAGE,
          bgColour,
        });
      });
      return Array.from(albumsMap.values());
    },
    [DEFAULT_ALBUM_IMAGE, deterministicNumber]
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

        const savedQueue = localStorage.getItem("playQueue");
        const savedTrackId = localStorage.getItem("currentTrackId");
        const savedQueueIndex = localStorage.getItem("currentQueueIndex");

        if (savedQueue) {
          const parsed = JSON.parse(savedQueue) as Song[];
          const normalized = normalizeSongs(parsed);
          setPlayQueue(normalized);
          if (savedTrackId) {
            const existing = normalized.find((s) => s._id === savedTrackId);
            if (existing) {
              setTrack(existing);
              setCurrentQueueIndex(savedQueueIndex ? parseInt(savedQueueIndex) : null);
            }
          }
        } else if (enrichedSongs.length > 0) {
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

  const fetchRecommendations = useCallback(
    async (userId: string) => {
      if (!userId) return;
      setIsRecommendationLoading(true);
      try {
        const res = await recommendationApi.getUserRecommendations(userId, 24);
        const hits = res.recommendations || [];
        setRecommendations(hits);
        setRecommendedAlbums(buildRecommendedAlbums(hits));
      } catch (error) {
        console.error("Failed to load recommendations:", error);
        setRecommendations([]);
        setRecommendedAlbums([]);
      } finally {
        setIsRecommendationLoading(false);
      }
    },
    [buildRecommendedAlbums]
  );

  const fetchFavorites = async (userId: string) => {
    setIsFavoritesLoading(true);
    try {
      const favoritesData = await musicApi.getFavorites(userId);
      setFavoriteSongs(favoritesData);
      setFavoriteSongIds(new Set(favoritesData.map((song) => song._id)));
      if (favoritesData.length > 0) {
        fetchRecommendations(userId);
      } else {
        setRecommendations([]);
        setRecommendedAlbums([]);
      }
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
      setPlaylists(
        playlistsData.map((p) => ({
          ...p,
          songs: p.songs ? normalizeSongs(p.songs) : [],
        }))
      );
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
      setDiscoverPlaylists(
        data.map((p) => ({
          ...p,
          songs: p.songs ? normalizeSongs(p.songs) : [],
        }))
      );
    } catch (error) {
      console.error("Failed to load public playlists:", error);
      setDiscoverPlaylists([]);
    } finally {
      setIsDiscoverLoading(false);
    }
  }, [user?.userId]);

  const logActivity = useCallback(
    async (type: string, metadata: Record<string, unknown> = {}) => {
      if (!user?.userId) return;
      try {
        await musicApi.logActivity({ userId: user.userId, type, metadata });
      } catch (err) {
        console.error("Failed to log activity:", err);
      }
    },
    [user?.userId]
  );

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
      logActivity("playlist_create", { playlistId: playlist._id, name: playlist.name });
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
      setRecommendations([]);
      setRecommendedAlbums([]);
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
      const shuffled = [...originalSongs].sort(() => Math.random() - 0.5);
      setSongs(shuffled);
      setPlayQueue((prev) =>
        prev.length ? [...prev].sort(() => Math.random() - 0.5) : shuffled
      );
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
    audioRef.current?.play().catch((err) => {
      console.error("Playback failed:", err);
    });
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setPlayStatus(false);
  };

  const startPlayback = async (song: Song, queueIndex: number | null = null) => {
    const songWithFile = { ...song, file: normalizeMediaUrl(song.file) };
    setTrack(songWithFile);
    if (audioRef.current) {
      audioRef.current.src = songWithFile.file || "";
    }
    if (!songWithFile.file) {
      setPlayStatus(false);
      return;
    }
    setCurrentQueueIndex(queueIndex);
    try {
      await audioRef.current?.play();
      setPlayStatus(true);
    } catch (err) {
      console.error("Playback failed:", err);
      setPlayStatus(false);
    }
  };

  const playWithId = async (id: string) => {
    const source = playQueue.length ? playQueue : songs;
    const songIndex = source.findIndex((s) => s._id === id);
    const song = source[songIndex] || songs.find((s) => s._id === id);
    if (song) {
      await startPlayback(song, playQueue.length ? songIndex : null);
    }
  };

  const previousSong = () => {
    if (!track) return;
    const source = playQueue.length ? playQueue : songs;
    if (!source.length) return;
    const currentIndex =
      currentQueueIndex !== null ? currentQueueIndex : source.findIndex((s) => s._id === track._id);
    if (currentIndex <= 0 && loopMode === "off") return;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : source.length - 1;
    playWithId(source[prevIndex]._id);
  };

  const nextSong = () => {
    if (!track) return;
    const source = playQueue.length ? playQueue : songs;
    if (!source.length) return;
    const currentIndex =
      currentQueueIndex !== null ? currentQueueIndex : source.findIndex((s) => s._id === track._id);
    if (currentIndex >= source.length - 1 && loopMode === "off") return;
    const nextIndex = currentIndex < source.length - 1 ? currentIndex + 1 : 0;
    playWithId(source[nextIndex]._id);
  };

  const seekSong = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !seekBg.current) return;
    const rect = seekBg.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    if (Number.isFinite(audioRef.current.duration)) {
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  const cycleLoopMode = () =>
    setLoopMode((prev) =>
      prev === "off" ? "one" : prev === "one" ? "all" : "off"
    );

  const toggleShuffle = () => setIsShuffle(!isShuffle);

  const addSongToQueue = (songId: string) => {
    const song = songs.find((s) => s._id === songId);
    if (!song) return;
    setPlayQueue((prev) => [...prev, { ...song, file: normalizeMediaUrl(song.file) }]);
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
          startPlayback(fallback, nextQueue[idx] ? idx : idx - 1);
        } else {
          audioRef.current?.pause();
          setPlayStatus(false);
          setCurrentQueueIndex(null);
        }
      } else if (currentQueueIndex !== null && idx <= currentQueueIndex) {
        setCurrentQueueIndex(Math.max(currentQueueIndex - 1, 0));
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
      if (currentQueueIndex !== null) {
        const newIndex = direction === "up" ? currentQueueIndex - 1 : currentQueueIndex + 1;
        setCurrentQueueIndex(Math.min(Math.max(newIndex, 0), nextQueue.length - 1));
      }
      return nextQueue;
    });
  };

  const clearQueue = () => {
    setPlayQueue([]);
    audioRef.current?.pause();
    setPlayStatus(false);
    setCurrentQueueIndex(null);
  };

  const playAlbum = (albumId: string) => {
    const albumName = albums.find((a) => a._id === albumId)?.name;
    if (!albumName) return;
    const albumSongs = songs.filter((s) => s.album === albumName).map((s) => ({
      ...s,
      file: normalizeMediaUrl(s.file),
    }));
    if (!albumSongs.length) return;
    setPlayQueue(albumSongs);
    startPlayback(albumSongs[0], 0);
  };

  const playPlaylist = (playlistId: string) => {
    const playlist = playlists.find((p) => p._id === playlistId);
    if (!playlist || !playlist.songs.length) return;
    const normalized = playlist.songs.map((s) => ({
      ...s,
      file: normalizeMediaUrl(s.file),
    }));
    setPlayQueue(normalized);
    startPlayback(normalized[0], 0);
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
    if (favoriteUpdatingIds.has(songId)) return;
    setFavoriteUpdatingIds((prev) => new Set(prev).add(songId));
    try {
      const currentlyFavorite = favoriteSongIds.has(songId);
      // Optimistic update
      setFavoriteSongIds((prev) => {
        const next = new Set(prev);
        currentlyFavorite ? next.delete(songId) : next.add(songId);
        return next;
      });
      if (currentlyFavorite) {
        await musicApi.removeFavorite(user.userId, songId);
        logActivity("unfavorite", { songId });
      } else {
        await musicApi.addFavorite(user.userId, songId);
        logActivity("favorite", { songId });
      }
      fetchRecommendations(user.userId);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      // revert on error
      setFavoriteSongIds((prev) => {
        const next = new Set(prev);
        currentlyFavorite ? next.add(songId) : next.delete(songId);
        return next;
      });
    } finally {
      setFavoriteUpdatingIds((prev) => {
        const updated = new Set(prev);
        updated.delete(songId);
        return updated;
      });
    }
  };

  const isFavorite = (songId: string) => favoriteSongIds.has(songId);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
    localStorage.setItem("volume", String(volume));
    localStorage.setItem("muted", String(isMuted));
  }, [volume, isMuted]);

  useEffect(() => {
    localStorage.setItem("playQueue", JSON.stringify(playQueue));
    if (track?._id) {
      localStorage.setItem("currentTrackId", track._id);
    }
    if (currentQueueIndex !== null) {
      localStorage.setItem("currentQueueIndex", String(currentQueueIndex));
    }
  }, [playQueue, track?._id, currentQueueIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handlePlay = () => setPlayStatus(true);
    const handlePause = () => setPlayStatus(false);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("canplay", handlePlaying);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    return () => {
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("canplay", handlePlaying);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

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
        recommendations,
        recommendedAlbums,
        isRecommendationLoading,
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
        currentQueueIndex,
        setTrack,
        playStatus,
        setPlayStatus,
        isBuffering,
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
        logActivity,
        setVolume,
        setIsMuted,
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

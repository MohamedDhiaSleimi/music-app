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
import {
  getRecommendations,
  getRecommendationScores,
  type ScoredSong,
} from "../utils/recommendationPlaceholder";
import { useAuth } from "./AuthContext";
import type { Album, Playlist, Song } from "../types/music.types";

type SortOption = "recommended" | "date" | "alpha";

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
  dailyDiscoverPlaylists: Playlist[];
  allPlaylists: Playlist[];
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
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  sortSongs: (songs: Song[]) => Song[];
  sortAlbums: (albums: Album[]) => Album[];
  sortPlaylists: (playlists: Playlist[]) => Playlist[];
  sortedSongsData: Song[];
  sortedAlbumsData: Album[];
  sortedPlaylists: Playlist[];
  sortedDiscoverPlaylists: Playlist[];

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
  const [dailyDiscoverPlaylists, setDailyDiscoverPlaylists] = useState<
    Playlist[]
  >([]);
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
  const [sortOption, setSortOption] = useState<SortOption>("recommended");
  const [recommendedSongIds, setRecommendedSongIds] = useState<string[]>([]);

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

  const normalizeSong = useCallback(
    (song: Song): Song => ({
      ...song,
      image: normalizeMediaUrl(song.image),
      file: normalizeMediaUrl(song.file),
    }),
    [normalizeMediaUrl]
  );

  const normalizeAlbum = useCallback(
    (album: Album): Album => ({
      ...album,
      image: normalizeMediaUrl(album.image),
    }),
    [normalizeMediaUrl]
  );

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
        const normalizedSongs = enrichedSongs.map(normalizeSong);
        const normalizedAlbums = albumsData.map(normalizeAlbum);
        setSongs(normalizedSongs);
        setAlbums(normalizedAlbums);
        setOriginalSongs(normalizedSongs);
        if (normalizedSongs.length > 0) {
          setTrack(normalizedSongs[0]);
          setPlayQueue(normalizedSongs);
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
      const normalizedFavorites = favoritesData.map(normalizeSong);
      setFavoriteSongs(normalizedFavorites);
      setFavoriteSongIds(new Set(normalizedFavorites.map((song) => song._id)));
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
      const normalizedPlaylists = playlistsData.map((playlist) => ({
        ...playlist,
        songs: playlist.songs.map(normalizeSong),
      }));
      setPlaylists(normalizedPlaylists);
    } catch (error) {
      console.error("Failed to load playlists:", error);
      setPlaylists([]);
    } finally {
      setIsPlaylistsLoading(false);
    }
  }, [normalizeSong, user?.userId]);

  const loadPublicPlaylists = useCallback(async () => {
    setIsDiscoverLoading(true);
    try {
      const data = await musicApi.discoverPublicPlaylists(user?.userId);
      const normalizedPlaylists = data.map((playlist) => ({
        ...playlist,
        songs: playlist.songs.map(normalizeSong),
      }));
      setDiscoverPlaylists(normalizedPlaylists);
    } catch (error) {
      console.error("Failed to load public playlists:", error);
      setDiscoverPlaylists([]);
    } finally {
      setIsDiscoverLoading(false);
    }
  }, [normalizeSong, user?.userId]);

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
      const normalizedPlaylist = {
        ...playlist,
        songs: playlist.songs?.map(normalizeSong) ?? [],
      };
      setPlaylists((prev) => [normalizedPlaylist, ...prev]);
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
    const normalized = {
      ...updated,
      songs: updated.songs.map(normalizeSong),
    };
    setPlaylists((prev) =>
      prev.map((playlist) =>
        playlist._id === updated._id ? normalized : playlist
      )
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
      const normalized = {
        ...playlist,
        songs: playlist.songs.map(normalizeSong),
      };
      setSharedPlaylist(normalized);
    } catch (error) {
      console.error("Failed to fetch shared playlist:", error);
      setSharedPlaylist(null);
    }
  }, [normalizeSong]);

  const getPublicPlaylist = useCallback(async (playlistId: string) => {
    try {
      const playlist = await musicApi.getPublicPlaylist(playlistId);
      return {
        ...playlist,
        songs: playlist.songs.map(normalizeSong),
      } as Playlist;
    } catch (error) {
      console.error("Failed to fetch public playlist:", error);
      return null;
    }
  }, [normalizeSong]);

  useEffect(() => {
    if (user?.userId) {
      fetchFavorites(user.userId);
      refreshPlaylists();
      loadPublicPlaylists();
    } else {
      setFavoriteSongs([]);
      setFavoriteSongIds(new Set());
      setPlaylists([]);
      setDailyDiscoverPlaylists([]);
      setDiscoverPlaylists([]);
      setSharedPlaylist(null);
    }
  }, [user?.userId]);

  useEffect(() => {
    if (!user?.userId || !songs.length) return;

    const dailyKey = getTodayKey();
    const storageKey = `daily-discover:${user.userId}`;
    const raw = localStorage.getItem(storageKey);

    if (raw) {
      try {
        const stored = JSON.parse(raw) as {
          date: string;
          playlists: Array<{
            id: string;
            name: string;
            description?: string;
            songIds: string[];
            seedSongId?: string;
          }>;
        };
        if (stored.date === dailyKey) {
          const hydrated = stored.playlists
            .map((playlist) => {
              const songsList = playlist.songIds
                .map((id) => songsById.get(id))
                .filter(Boolean) as Song[];
              if (!songsList.length) return null;
              return {
                _id: playlist.id,
                name: playlist.name,
                description: playlist.description,
                ownerId: user.userId,
                isPublic: false,
                songs: songsList,
                isTemporary: true,
                isDailyDiscover: true,
                generatedAt: stored.date,
                seedSongId: playlist.seedSongId,
              } as Playlist;
            })
            .filter(Boolean) as Playlist[];
          setDailyDiscoverPlaylists(hydrated);
          return;
        }
      } catch (error) {
        console.error("Failed to load daily discover cache:", error);
      }
    }

    const generate = async () => {
      const playlists = await buildDailyDiscover(user.userId);
      setDailyDiscoverPlaylists(playlists);
      const payload = {
        date: dailyKey,
        playlists: playlists.map((playlist) => ({
          id: playlist._id,
          name: playlist.name,
          description: playlist.description,
          songIds: playlist.songs.map((song) => song._id),
          seedSongId: playlist.seedSongId,
        })),
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    };

    generate();
  }, [user?.userId, songs, songsById, buildDailyDiscover, getTodayKey]);

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

  const songsById = useMemo(() => {
    return new Map(songs.map((song) => [song._id, song]));
  }, [songs]);

  const getTodayKey = useCallback(
    () => new Date().toLocaleDateString("en-CA"),
    []
  );

  const getTempoBucket = useCallback((song: Song) => {
    const bpm = song.bpm ?? 0;
    if (!bpm) return "unknown";
    if (bpm < 90) return "slow";
    if (bpm < 120) return "mid";
    return "fast";
  }, []);

  const selectSongsWithConstraints = useCallback(
    (candidates: ScoredSong[], targetCount: number, usedIds: Set<string>) => {
    const selected: ScoredSong[] = [];
    const artistCounts = new Map<string, number>();
    const genreCounts = new Map<string, number>();
    const tempoCounts = new Map<string, number>();

    const canUse = (song: Song) => {
      if (usedIds.has(song._id)) return false;
      const artist = song.artist || "unknown";
      const genre = song.genre || "unknown";
      const tempo = getTempoBucket(song);
      if ((artistCounts.get(artist) || 0) >= 2) return false;
      if ((genreCounts.get(genre) || 0) >= 3) return false;
      if ((tempoCounts.get(tempo) || 0) >= 4) return false;
      return true;
    };

    const take = (entry: ScoredSong) => {
      const artist = entry.song.artist || "unknown";
      const genre = entry.song.genre || "unknown";
      const tempo = getTempoBucket(entry.song);
      artistCounts.set(artist, (artistCounts.get(artist) || 0) + 1);
      genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
      tempoCounts.set(tempo, (tempoCounts.get(tempo) || 0) + 1);
      selected.push(entry);
      usedIds.add(entry.song._id);
    };

    for (const entry of candidates) {
      if (selected.length >= targetCount) break;
      if (canUse(entry.song)) {
        take(entry);
      }
    }

    if (selected.length < targetCount) {
      for (const entry of candidates) {
        if (selected.length >= targetCount) break;
        if (usedIds.has(entry.song._id)) continue;
        take(entry);
      }
    }

    return selected;
  },
  [getTempoBucket]
  );

  const buildDailyDiscover = useCallback(
    async (userId: string) => {
      if (!songs.length) return [];
      const dailyKey = getTodayKey();
      const usedIds = new Set<string>();
      const allScores = new Map<string, number>();
      const previousSongIds: string[] = [];
      const dailyPlaylists: Playlist[] = [];

      const pickLeastRecommendedSeed = () => {
        let seedId: string | null = null;
        let lowestScore = Number.POSITIVE_INFINITY;
        for (const songId of previousSongIds) {
          const score = allScores.get(songId);
          if (score === undefined) continue;
          if (score < lowestScore) {
            lowestScore = score;
            seedId = songId;
          }
        }
        if (!seedId && previousSongIds.length) {
          seedId =
            previousSongIds[Math.floor(Math.random() * previousSongIds.length)];
        }
        return seedId ? songsById.get(seedId) || null : null;
      };

      for (let index = 0; index < 6; index += 1) {
        const includeSeed = index === 0;
        const seedSong =
          index === 0
            ? songs[Math.floor(Math.random() * songs.length)]
            : pickLeastRecommendedSeed();
        if (!seedSong) break;

        const { scored } = await getRecommendationScores(
          { seedTrackIds: [seedSong._id], limit: songs.length },
          songs
        );

        const available = scored.filter(
          (entry) => !usedIds.has(entry.song._id)
        );
        const targetCount = includeSeed ? 9 : 10;
        const selected = selectSongsWithConstraints(
          available,
          targetCount,
          usedIds
        );

        const selectedSongs = selected.map((entry) => entry.song);
        const albumSongs = includeSeed
          ? [seedSong, ...selectedSongs]
          : selectedSongs;

        if (includeSeed) {
          usedIds.add(seedSong._id);
          allScores.set(seedSong._id, 1);
        }
        selected.forEach((entry) => {
          allScores.set(entry.song._id, entry.score);
        });
        previousSongIds.push(...albumSongs.map((song) => song._id));

        dailyPlaylists.push({
          _id: `daily-${userId}-${dailyKey}-${index + 1}`,
          name: `Daily Discover ${index + 1}`,
          description: `Fresh picks for ${dailyKey}`,
          ownerId: userId,
          isPublic: false,
          songs: albumSongs,
          isTemporary: true,
          isDailyDiscover: true,
          generatedAt: dailyKey,
          seedSongId: seedSong._id,
        });
      }

      return dailyPlaylists;
    },
    [songs, songsById, getTodayKey, selectSongsWithConstraints]
  );

  useEffect(() => {
    let isActive = true;
    const seedIds = favoriteSongs.map((song) => song._id);

    const loadRecommendations = async () => {
      if (!songs.length) {
        setRecommendedSongIds([]);
        return;
      }
      const { recommendations } = await getRecommendations(
        { seedTrackIds: seedIds, limit: songs.length },
        songs
      );
      const recommendedIds = recommendations.map((song) => song._id);
      const seedSet = new Set(seedIds);
      const fallbackIds = songs
        .map((song) => song._id)
        .filter((id) => !seedSet.has(id) && !recommendedIds.includes(id));
      const orderedIds = [
        ...recommendedIds,
        ...seedIds.filter((id) => !recommendedIds.includes(id)),
        ...fallbackIds,
      ];
      if (isActive) {
        console.log("Recommendation refresh", {
          seeds: seedIds.length,
          recommendations: recommendedIds.length,
          total: orderedIds.length,
        });
        setRecommendedSongIds(orderedIds);
      }
    };

    loadRecommendations();
    return () => {
      isActive = false;
    };
  }, [favoriteSongs, songs]);

  const recommendationRank = useMemo(() => {
    const map = new Map<string, number>();
    recommendedSongIds.forEach((id, index) => {
      map.set(id, index);
    });
    return map;
  }, [recommendedSongIds]);

  const sortSongs = useCallback(
    (list: Song[]) => {
      const items = [...list];
      if (sortOption === "alpha") {
        return items.sort((a, b) => a.name.localeCompare(b.name));
      }
      if (sortOption === "date") {
        return items.sort((a, b) => {
          const yearDiff = (b.releaseYear ?? 0) - (a.releaseYear ?? 0);
          if (yearDiff !== 0) return yearDiff;
          return a.name.localeCompare(b.name);
        });
      }
      return items.sort((a, b) => {
        const rankA = recommendationRank.get(a._id) ?? Number.MAX_SAFE_INTEGER;
        const rankB = recommendationRank.get(b._id) ?? Number.MAX_SAFE_INTEGER;
        if (rankA !== rankB) return rankA - rankB;
        return a.name.localeCompare(b.name);
      });
    },
    [sortOption, recommendationRank]
  );

  const getLatestReleaseYear = useCallback((songList: Song[]) => {
    return songList.reduce(
      (max, song) => Math.max(max, song.releaseYear ?? 0),
      0
    );
  }, []);

  const getRecommendationRank = useCallback(
    (songList: Song[]) => {
      let best = Number.MAX_SAFE_INTEGER;
      for (const song of songList) {
        const rank = recommendationRank.get(song._id);
        if (rank !== undefined && rank < best) best = rank;
      }
      return best;
    },
    [recommendationRank]
  );

  const sortAlbums = useCallback(
    (list: Album[]) => {
      const items = [...list];
      if (sortOption === "alpha") {
        return items.sort((a, b) => a.name.localeCompare(b.name));
      }
      if (sortOption === "date") {
        return items.sort((a, b) => {
          const yearA = getLatestReleaseYear(
            songs.filter((song) => song.album === a.name)
          );
          const yearB = getLatestReleaseYear(
            songs.filter((song) => song.album === b.name)
          );
          const yearDiff = yearB - yearA;
          if (yearDiff !== 0) return yearDiff;
          return a.name.localeCompare(b.name);
        });
      }
      return items.sort((a, b) => {
        const rankA = getRecommendationRank(
          songs.filter((song) => song.album === a.name)
        );
        const rankB = getRecommendationRank(
          songs.filter((song) => song.album === b.name)
        );
        if (rankA !== rankB) return rankA - rankB;
        return a.name.localeCompare(b.name);
      });
    },
    [sortOption, songs, getLatestReleaseYear, getRecommendationRank]
  );

  const sortPlaylists = useCallback(
    (list: Playlist[]) => {
      const items = [...list];
      if (sortOption === "alpha") {
        return items.sort((a, b) => a.name.localeCompare(b.name));
      }
      if (sortOption === "date") {
        return items.sort((a, b) => {
          const yearDiff =
            getLatestReleaseYear(b.songs) - getLatestReleaseYear(a.songs);
          if (yearDiff !== 0) return yearDiff;
          return a.name.localeCompare(b.name);
        });
      }
      return items.sort((a, b) => {
        const rankA = getRecommendationRank(a.songs);
        const rankB = getRecommendationRank(b.songs);
        if (rankA !== rankB) return rankA - rankB;
        return a.name.localeCompare(b.name);
      });
    },
    [sortOption, getLatestReleaseYear, getRecommendationRank]
  );

  const sortedSongsData = useMemo(
    () => sortSongs(filteredSongsData),
    [filteredSongsData, sortSongs]
  );
  const sortedAlbumsData = useMemo(
    () => sortAlbums(filteredAlbumsData),
    [filteredAlbumsData, sortAlbums]
  );
  const allPlaylists = useMemo(
    () => [...dailyDiscoverPlaylists, ...playlists],
    [dailyDiscoverPlaylists, playlists]
  );
  const sortedPlaylists = useMemo(
    () => sortPlaylists(allPlaylists),
    [allPlaylists, sortPlaylists]
  );
  const sortedDiscoverPlaylists = useMemo(
    () => sortPlaylists(discoverPlaylists),
    [discoverPlaylists, sortPlaylists]
  );

  // Player controls
  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (track && audio.src !== track.file) {
      audio.src = track.file;
      audio.load();
    }
    try {
      await audio.play();
      setPlayStatus(true);
    } catch (error) {
      console.error("Playback failed:", error);
      setPlayStatus(false);
    }
  };

  const pause = () => {
    audioRef.current?.pause();
    setPlayStatus(false);
  };

  const startPlayback = async (song: Song) => {
    setTrack(song);
    if (audioRef.current) {
      audioRef.current.src = song.file;
      audioRef.current.load();
      try {
        await audioRef.current.play();
        setPlayStatus(true);
      } catch (error) {
        console.error("Playback failed:", error);
        setPlayStatus(false);
      }
    }
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
    clearQueue();
    setPlayQueue(albumSongs);
    startPlayback(albumSongs[0]);
  };

  const playPlaylist = (playlistId: string) => {
    const playlist = allPlaylists.find((p) => p._id === playlistId);
    if (!playlist || !playlist.songs.length) return;
    clearQueue();
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
        dailyDiscoverPlaylists,
        allPlaylists,
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
        sortOption,
        setSortOption,
        sortSongs,
        sortAlbums,
        sortPlaylists,
        sortedSongsData,
        sortedAlbumsData,
        sortedPlaylists,
        sortedDiscoverPlaylists,
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

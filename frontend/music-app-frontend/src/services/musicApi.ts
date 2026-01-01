import axios from 'axios';
import { MUSIC_API_BASE_URL, MUSIC_ENDPOINTS } from '../constants/api.constants';

export const musicApiClient = axios.create({
  baseURL: MUSIC_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const musicApi = {
  getSongs: async () => {
    const response = await musicApiClient.get(MUSIC_ENDPOINTS.SONGS.LIST);
    return response.data.songs;
  },

  getAlbums: async () => {
    const response = await musicApiClient.get(MUSIC_ENDPOINTS.ALBUMS.LIST);
    return response.data.albums;
  },

  addSong: async (formData: FormData) => {
    const response = await musicApiClient.post(MUSIC_ENDPOINTS.SONGS.ADD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  removeSong: async (id: string) => {
    const response = await musicApiClient.delete(`${MUSIC_ENDPOINTS.SONGS.REMOVE}/${id}`);
    return response.data;
  },

  addAlbum: async (formData: FormData) => {
    const response = await musicApiClient.post(MUSIC_ENDPOINTS.ALBUMS.ADD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  removeAlbum: async (id: string) => {
    const response = await musicApiClient.delete(`${MUSIC_ENDPOINTS.ALBUMS.REMOVE}/${id}`);
    return response.data;
  },

  getFavorites: async (userId: string) => {
    const response = await musicApiClient.get(`${MUSIC_ENDPOINTS.FAVORITES.LIST}/${userId}`);
    return response.data.songs;
  },

  addFavorite: async (userId: string, songId: string) => {
    const response = await musicApiClient.post(MUSIC_ENDPOINTS.FAVORITES.ADD, { userId, songId });
    return response.data;
  },

  removeFavorite: async (userId: string, songId: string) => {
    const response = await musicApiClient.post(MUSIC_ENDPOINTS.FAVORITES.REMOVE, { userId, songId });
    return response.data;
  },

  getPlaylists: async (userId: string) => {
    const response = await musicApiClient.get(`${MUSIC_ENDPOINTS.PLAYLISTS.USER}/${userId}`);
    return response.data.playlists;
  },

  createPlaylist: async (payload: { name: string; description?: string; isPublic?: boolean; songs?: string[]; userId: string }) => {
    const response = await musicApiClient.post(MUSIC_ENDPOINTS.PLAYLISTS.CREATE, payload);
    return response.data.playlist;
  },

  deletePlaylist: async (playlistId: string, userId: string) => {
    const response = await musicApiClient.delete(`${MUSIC_ENDPOINTS.PLAYLISTS.BASE}/${playlistId}`, {
      data: { userId },
    });
    return response.data;
  },

  addSongToPlaylist: async (playlistId: string, songId: string, userId: string) => {
    const response = await musicApiClient.post(`${MUSIC_ENDPOINTS.PLAYLISTS.BASE}/${playlistId}/add-song`, {
      songId,
      userId,
    });
    return response.data.playlist;
  },

  removeSongFromPlaylist: async (playlistId: string, songId: string, userId: string) => {
    const response = await musicApiClient.post(`${MUSIC_ENDPOINTS.PLAYLISTS.BASE}/${playlistId}/remove-song`, {
      songId,
      userId,
    });
    return response.data.playlist;
  },

  setPlaylistVisibility: async (playlistId: string, isPublic: boolean, userId: string) => {
    const response = await musicApiClient.patch(`${MUSIC_ENDPOINTS.PLAYLISTS.BASE}/${playlistId}/visibility`, {
      isPublic,
      userId,
    });
    return response.data.playlist;
  },

  sharePlaylist: async (playlistId: string, userId: string, regenerate?: boolean) => {
    const response = await musicApiClient.post(`${MUSIC_ENDPOINTS.PLAYLISTS.BASE}/${playlistId}/share`, {
      userId,
      regenerate,
    });
    return response.data;
  },

  getSharedPlaylist: async (shareCode: string) => {
    const response = await musicApiClient.get(`${MUSIC_ENDPOINTS.PLAYLISTS.SHARED}/${shareCode}`);
    return response.data.playlist;
  },

  discoverPublicPlaylists: async (userId?: string) => {
    const response = await musicApiClient.get(MUSIC_ENDPOINTS.PLAYLISTS.PUBLIC_DISCOVER, {
      params: { userId },
    });
    return response.data.playlists;
  },

  getPublicPlaylist: async (playlistId: string) => {
    const response = await musicApiClient.get(`${MUSIC_ENDPOINTS.PLAYLISTS.PUBLIC}/${playlistId}`);
    return response.data.playlist;
  },

  getPlaylistById: async (playlistId: string, userId?: string) => {
    const response = await musicApiClient.get(`${MUSIC_ENDPOINTS.PLAYLISTS.BASE}/${playlistId}`, {
      params: { userId },
    });
    return response.data.playlist;
  },
};

export interface Song {
  _id: string;
  name: string;
  desc: string;
  album: string;
  image: string;
  file: string;
  duration: string;
  artist?: string;
  genre?: string;
  bpm?: number;
  energy?: number;
  danceability?: number;
  valence?: number;
  acousticness?: number;
  instrumentalness?: number;
  liveness?: number;
  speechiness?: number;
  key?: string;
  releaseYear?: number;
}

export interface Album {
  _id: string;
  name: string;
  desc: string;
  image: string;
  bgColour: string;
}

export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  ownerId: string;
  isPublic: boolean;
  songs: Song[];
  shareCode?: string;
  isTemporary?: boolean;
  isDailyDiscover?: boolean;
  generatedAt?: string;
  seedSongId?: string;
}

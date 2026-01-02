import express from "express";
import {
  addSongToPlaylist,
  createPlaylist,
  deletePlaylist,
  discoverPublicPlaylists,
  listAllPlaylists,
  getPlaylistById,
  getPublicPlaylistById,
  getSharedPlaylist,
  getUserPlaylists,
  removeSongFromPlaylist,
  sharePlaylist,
  updatePlaylistVisibility,
} from "../controllers/playlistController.js";

const playlistRouter = express.Router();

playlistRouter.post("/create", createPlaylist);
playlistRouter.delete("/:playlistId", deletePlaylist);
playlistRouter.post("/:playlistId/add-song", addSongToPlaylist);
playlistRouter.post("/:playlistId/remove-song", removeSongFromPlaylist);
playlistRouter.patch("/:playlistId/visibility", updatePlaylistVisibility);
playlistRouter.post("/:playlistId/share", sharePlaylist);
playlistRouter.get("/shared/:shareCode", getSharedPlaylist);
playlistRouter.get("/public/discover", discoverPublicPlaylists);
playlistRouter.get("/public/:playlistId", getPublicPlaylistById);
playlistRouter.get("/all", listAllPlaylists);
playlistRouter.get("/user/:userId", getUserPlaylists);
playlistRouter.get("/:playlistId", getPlaylistById);

export default playlistRouter;

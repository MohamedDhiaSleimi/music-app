import crypto from "crypto";
import Playlist from "../models/Playlist.js";
import Song from "../models/Song.js";

const generateShareCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = crypto.randomBytes(8).toString("hex");
    exists = await Playlist.exists({ shareCode: code });
  }
  return code;
};

const createPlaylist = async (req, res) => {
  try {
    const { name, description = "", isPublic = false, userId, songs = [] } =
      req.body;

    if (!name || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "name and userId are required" });
    }

    const playlist = await Playlist.create({
      name,
      description,
      isPublic,
      ownerId: userId,
      songs,
    });

    await playlist.populate("songs");

    return res.status(201).json({
      success: true,
      message: "Playlist created",
      playlist,
    });
  } catch (error) {
    console.error("Failed at createPlaylist", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not create playlist" });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { userId } = req.body;

    if (!playlistId || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "playlistId and userId are required" });
    }

    const playlist = await Playlist.findOne({
      _id: playlistId,
      ownerId: userId,
    });

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }

    await playlist.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: "Playlist removed successfully" });
  } catch (error) {
    console.error("Failed at deletePlaylist", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not delete playlist" });
  }
};

const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { songId, userId } = req.body;

    if (!playlistId || !songId || !userId) {
      return res.status(400).json({
        success: false,
        message: "playlistId, songId and userId are required",
      });
    }

    const songExists = await Song.exists({ _id: songId });
    if (!songExists) {
      return res
        .status(404)
        .json({ success: false, message: "Song not found" });
    }

    const playlist = await Playlist.findOneAndUpdate(
      { _id: playlistId, ownerId: userId },
      { $addToSet: { songs: songId } },
      { new: true }
    ).populate("songs");

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Song added to playlist",
      playlist,
    });
  } catch (error) {
    console.error("Failed at addSongToPlaylist", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not add song to playlist" });
  }
};

const removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { songId, userId } = req.body;

    if (!playlistId || !songId || !userId) {
      return res.status(400).json({
        success: false,
        message: "playlistId, songId and userId are required",
      });
    }

    const playlist = await Playlist.findOneAndUpdate(
      { _id: playlistId, ownerId: userId },
      { $pull: { songs: songId } },
      { new: true }
    ).populate("songs");

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Song removed from playlist",
      playlist,
    });
  } catch (error) {
    console.error("Failed at removeSongFromPlaylist", error);
    return res.status(500).json({
      success: false,
      message: "Could not remove song from playlist",
    });
  }
};

const updatePlaylistVisibility = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { isPublic, userId } = req.body;

    if (isPublic === undefined || !playlistId || !userId) {
      return res.status(400).json({
        success: false,
        message: "playlistId, userId and isPublic are required",
      });
    }

    const playlist = await Playlist.findOneAndUpdate(
      { _id: playlistId, ownerId: userId },
      { isPublic },
      { new: true }
    ).populate("songs");

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Playlist is now ${isPublic ? "public" : "private"}`,
      playlist,
    });
  } catch (error) {
    console.error("Failed at updatePlaylistVisibility", error);
    return res.status(500).json({
      success: false,
      message: "Could not update playlist visibility",
    });
  }
};

const sharePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { userId, regenerate = false } = req.body;

    if (!playlistId || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "playlistId and userId are required" });
    }

    const playlist = await Playlist.findOne({
      _id: playlistId,
      ownerId: userId,
    });

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }

    if (!playlist.shareCode || regenerate) {
      playlist.shareCode = await generateShareCode();
      await playlist.save();
    }

    return res.status(200).json({
      success: true,
      message: "Share link generated",
      shareCode: playlist.shareCode,
      sharePath: `/playlists/shared/${playlist.shareCode}`,
    });
  } catch (error) {
    console.error("Failed at sharePlaylist", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not share playlist" });
  }
};

const getSharedPlaylist = async (req, res) => {
  try {
    const { shareCode } = req.params;

    if (!shareCode) {
      return res
        .status(400)
        .json({ success: false, message: "shareCode is required" });
    }

    const playlist = await Playlist.findOne({ shareCode }).populate("songs");
    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }

    return res.status(200).json({ success: true, playlist });
  } catch (error) {
    console.error("Failed at getSharedPlaylist", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not fetch shared playlist" });
  }
};

const discoverPublicPlaylists = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = { isPublic: true };
    if (userId) {
      query.ownerId = { $ne: userId };
    }

    const playlists = await Playlist.find(query)
      .sort({ updatedAt: -1 })
      .populate("songs");

    return res.status(200).json({ success: true, playlists });
  } catch (error) {
    console.error("Failed at discoverPublicPlaylists", error);
    return res.status(500).json({
      success: false,
      message: "Could not load public playlists",
    });
  }
};

const getUserPlaylists = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId is required" });
    }

    const playlists = await Playlist.find({ ownerId: userId })
      .sort({ updatedAt: -1 })
      .populate("songs");

    return res.status(200).json({ success: true, playlists });
  } catch (error) {
    console.error("Failed at getUserPlaylists", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not load playlists" });
  }
};

const getPlaylistById = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { userId } = req.query;

    if (!playlistId) {
      return res
        .status(400)
        .json({ success: false, message: "playlistId is required" });
    }

    const playlist = await Playlist.findById(playlistId).populate("songs");
    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }

    const isOwner = userId && playlist.ownerId === userId;
    if (!playlist.isPublic && !isOwner) {
      return res
        .status(403)
        .json({ success: false, message: "Playlist is private" });
    }

    return res.status(200).json({ success: true, playlist });
  } catch (error) {
    console.error("Failed at getPlaylistById", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not load playlist" });
  }
};

const getPublicPlaylistById = async (req, res) => {
  try {
    const { playlistId } = req.params;
    if (!playlistId) {
      return res
        .status(400)
        .json({ success: false, message: "playlistId is required" });
    }

    const playlist = await Playlist.findOne({
      _id: playlistId,
      isPublic: true,
    }).populate("songs");

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found or private" });
    }

    return res.status(200).json({ success: true, playlist });
  } catch (error) {
    console.error("Failed at getPublicPlaylistById", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not load public playlist" });
  }
};

export {
  createPlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  updatePlaylistVisibility,
  sharePlaylist,
  getSharedPlaylist,
  discoverPublicPlaylists,
  getUserPlaylists,
  getPlaylistById,
  getPublicPlaylistById,
};

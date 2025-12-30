import Favorite from "../models/Favorite.js";
import Song from "../models/Song.js";

const addFavorite = async (req, res) => {
  try {
    const { userId, songId } = req.body;

    if (!userId || !songId) {
      return res
        .status(400)
        .json({ success: false, message: "userId and songId are required" });
    }

    const songExists = await Song.exists({ _id: songId });
    if (!songExists) {
      return res
        .status(404)
        .json({ success: false, message: "Song not found" });
    }

    await Favorite.findOneAndUpdate(
      { userId, song: songId },
      { userId, song: songId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res
      .status(200)
      .json({ success: true, message: "Song added to favorites" });
  } catch (error) {
    console.error("Failed at addFavorite", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not add favorite" });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { userId, songId } = req.body;

    if (!userId || !songId) {
      return res
        .status(400)
        .json({ success: false, message: "userId and songId are required" });
    }

    await Favorite.findOneAndDelete({ userId, song: songId });

    return res
      .status(200)
      .json({ success: true, message: "Song removed from favorites" });
  } catch (error) {
    console.error("Failed at removeFavorite", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not remove favorite" });
  }
};

const listFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId is required" });
    }

    const favorites = await Favorite.find({ userId }).populate("song");

    const songs = favorites
      .map((fav) => fav.song)
      .filter((song) => song !== null);

    return res.status(200).json({ success: true, songs });
  } catch (error) {
    console.error("Failed at listFavorites", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not fetch favorites" });
  }
};

export { addFavorite, removeFavorite, listFavorites };

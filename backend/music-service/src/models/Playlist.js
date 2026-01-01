import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "song",
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareCode: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

const Playlist =
  mongoose.models.playlist || mongoose.model("playlist", playlistSchema);

export default Playlist;

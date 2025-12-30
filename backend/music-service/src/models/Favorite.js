import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "song",
      required: true,
    },
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, song: 1 }, { unique: true });

const Favorite =
  mongoose.models.favorite || mongoose.model("favorite", favoriteSchema);

export default Favorite;

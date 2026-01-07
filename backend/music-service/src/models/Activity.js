import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["play", "favorite", "unfavorite", "playlist_create", "playlist_share", "queue_saved", "visit", "other"],
      default: "other",
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const Activity = mongoose.models.activity || mongoose.model("activity", activitySchema);

export default Activity;

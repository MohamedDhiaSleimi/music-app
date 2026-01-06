import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    bgColour: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        default: process.env.DEFAULT_ALBUM_IMAGE_URL || "http://localhost:3000/static/default-album.png"
    }
})

const Album = mongoose.models.album || mongoose.model("album", albumSchema);

export default Album;

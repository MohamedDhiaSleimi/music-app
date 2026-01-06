import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    album: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        default: process.env.DEFAULT_SONG_IMAGE_URL || "http://localhost:3000/static/default-song.png"
    },
    file: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
})

const Song = mongoose.models.song || mongoose.model("song", songSchema);

export default Song;

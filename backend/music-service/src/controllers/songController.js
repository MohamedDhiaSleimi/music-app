import { v2 as cloudinary } from "cloudinary"
import Song from "../models/Song.js";

const DEFAULT_SONG_IMAGE_URL = process.env.DEFAULT_SONG_IMAGE_URL || "http://localhost:3000/static/default-song.png";
const RECOMMENDATION_SERVICE_URL = process.env.RECOMMENDATION_SERVICE_URL || "http://localhost:4003";

const scheduleFeatureExtraction = (songDoc) => {
    if (!songDoc?._id || !songDoc?.file) return;

    const payload = {
        songId: songDoc._id.toString(),
        file: songDoc.file,
        name: songDoc.name,
        album: songDoc.album
    };

    // Fire-and-forget to keep song creation fast
    setImmediate(async () => {
        try {
            await fetch(`${RECOMMENDATION_SERVICE_URL}/api/recommendation/extract`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        } catch (notifyErr) {
            console.error("Recommendation service notify failed", notifyErr.message);
        }
    });
};

const addSong = async (req, res) => {
    try {
        const { name, desc, album } = req.body;
        const audioFile = req.files?.audio?.[0];
        const imageFile = req.files?.image?.[0];

        if (!audioFile) {
            return res.status(400).json({ success: false, message: "Audio file is required" });
        }

        const audioUpload = await cloudinary.uploader.upload(audioFile.path, { resource_type: "video" });
        let imageUrl = DEFAULT_SONG_IMAGE_URL;

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`;

        const songData = {
            name,
            desc,
            album,
            image: imageUrl,
            file: audioUpload.secure_url,
            duration
        }

        const song = Song(songData);
        await song.save();

        scheduleFeatureExtraction(song);

        res.status(201).json({ success: true, message: "Song Added" })


    } catch (error) {
        console.log('Failed at addSong, ', error);
        res.status(400).json({ success: false, message: "Song Add Failed" })
    }
}

const listSong = async (req, res) => {
    try {
        const allSongs = await Song.find({});
        res.status(201).json({ success: true, songs: allSongs });
    } catch (error) {
        console.log('Failed at listSong, ', error);
        res.status(400).json({ success: false, message: "Song List Failed" })
    }
}

const removeSong = async (req, res) => {
    try {
        const { id } = req.params;
        await Song.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Song removed success" });
    } catch (error) {
        console.log('Failed at removeSong, ', error);
        res.status(400).json({ success: false, message: "Song removed Failed" })
    }
}

export { addSong, listSong, removeSong }

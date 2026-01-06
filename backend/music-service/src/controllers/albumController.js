import { v2 as cloudinary } from "cloudinary"
import Album from "../models/Album.js";
import Song from './../models/Song.js';

const DEFAULT_ALBUM_IMAGE_URL = process.env.DEFAULT_ALBUM_IMAGE_URL || "http://localhost:3000/static/default-album.png";

const addAlbum = async (req, res) => {
    try {
        const { name, desc, bgColour } = req.body;
        const imageFile = req.file;

        let imageUrl = DEFAULT_ALBUM_IMAGE_URL;
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        const albumData = {
            name,
            desc,
            bgColour,
            image: imageUrl,
        }

        const album = Album(albumData);
        await album.save();

        res.status(201).json({ success: true, message: "Album Added" })


    } catch (error) {
        console.log('Failed at addAlbum, ', error);
        res.status(400).json({ success: false, message: "Album Add Failed" })
    }
}

const listAlbum = async (req, res) => {
    try {
        const allAlbums = await Album.find({});
        res.status(201).json({ success: true, albums: allAlbums });
    } catch (error) {
        console.log('Failed at listAlbum, ', error);
        res.status(400).json({ success: false, message: "Album List Failed" })
    }
}

const removeAlbum = async (req, res) => {
    try {
        const { id } = req.params;

        const album = await Album.findById(id);
        if (!album) {
            return res.status(404).json({ success: false, message: "Album not found" });
        }

        await Song.updateMany({ album: album.name }, { $set: { album: "" } });
        await Album.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Album removed success" });
    } catch (error) {
        console.log('Failed at removeAlbum, ', error);
        res.status(400).json({ success: false, message: "Album removed Failed" })
    }
}

export { addAlbum, listAlbum, removeAlbum }

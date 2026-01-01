import express from "express";
import cors from "cors"
import "dotenv/config"
import songRouter from "./src/routes/songRoute.js";
import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudinary.js";
import albumRouter from "./src/routes/albumRoute.js";
import favoriteRouter from "./src/routes/favoriteRoute.js";
import playlistRouter from "./src/routes/playlistRoute.js";

//app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middlewares
app.use(express.json())
app.use(cors())

//initializing routes
app.use("/api/song", songRouter)
app.use("/api/album", albumRouter)
app.use("/api/favorite", favoriteRouter)
app.use("/api/playlist", playlistRouter)
app.get('/', (req, res) => res.send("API Working"));


app.listen(port, () => console.log(`Server started on ${port}`));

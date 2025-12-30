import express from "express";
import {
  addFavorite,
  removeFavorite,
  listFavorites,
} from "../controllers/favoriteController.js";

const favoriteRouter = express.Router();

favoriteRouter.post("/add", addFavorite);
favoriteRouter.post("/remove", removeFavorite);
favoriteRouter.get("/list/:userId", listFavorites);

export default favoriteRouter;

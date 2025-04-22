import express from "express";
const tripRouter = express.Router();
import { checkForToken } from "../controllers/auth.controller";
import { addFavorites, removeFavorite } from "../controllers/tripController";
import { AdminOnly } from "../middlewares/adminOnly";

// Adding and removing from the favorite.
tripRouter.post("/favorites", checkForToken, addFavorites);

// Removing from the favorite list
tripRouter.delete("/favorites/:id", checkForToken, removeFavorite);


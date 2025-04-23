import express from "express";
const tripRouter = express.Router();
import { checkForToken } from "../controllers/auth.controller.js";
import { addFavorites, removeFavorite } from "../controllers/tripController.js";
// import { AdminOnly } from "../middlewares/adminOnly";
import { approveReq, sendReq, showTours, tourAdd } from "../controllers/tripMainController.js";
import { multerPhotos } from "../middlewares/multer.js";

//Adding tour
tripRouter.post("/addTour", multerPhotos, checkForToken, tourAdd)
tripRouter.get("/", (req, res) => {
    res.send("vijay nimar")
})



// show tour : dummy route name for now.
tripRouter.get("/tourList", multerPhotos, checkForToken, showTours);
// tripRouter.post("/tourList", multerPhotos, checkForToken, sendReq);
// tripRouter.get("/tourList", multerPhotos, checkForToken, showRequests);
// tripRouter.get("/tourList", multerPhotos, checkForToken, approveReq);

// send request
// approve request





// Adding and removing from the favorite.
// tripRouter.post("/favorites", checkForToken, addFavorites);

// Removing from the favorite list
// tripRouter.delete("/favorites/:id", checkForToken, removeFavorite);

export { tripRouter }
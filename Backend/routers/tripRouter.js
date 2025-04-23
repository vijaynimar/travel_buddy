import express from "express";
const tripRouter = express.Router();
import { checkForToken } from "../controllers/auth.controller.js";
import { addFavorites, removeFavorite } from "../controllers/tripController.js";
// import { AdminOnly } from "../middlewares/adminOnly";
import { approveReq, getTourDetail, sendReq, showAllTours, showTours, tourAdd } from "../controllers/tripMainController.js";
import { multerPhotos } from "../middlewares/multer.js";

//Adding tour
tripRouter.post("/addTour", multerPhotos, checkForToken, tourAdd)
tripRouter.get("/", (req, res) => {
    return res.send("vijay nimar")
})



// <-------- As a Tour creator Logics ------->

//For the user to see his own created tours
tripRouter.get("/tourList", multerPhotos, checkForToken, showTours);

// To get the detail of a own created Tour 
tripRouter.get("/tourList/:tourId", multerPhotos, checkForToken, getTourDetail);

// Approving the requests 
tripRouter.post("/tourList/:tourId", multerPhotos, checkForToken, approveReq);





// <-------- As a Tour joiner Logics ------->

// For user to see all the tours that are going on
tripRouter.get("/tours", multerPhotos, checkForToken, showAllTours);

// To send the request to a particular tour.
tripRouter.post("/tours/:tourId", multerPhotos, checkForToken, sendReq);

// To get the details of anyone else's Tour
tripRouter.get("/tours/:tourId", multerPhotos, checkForToken, getTourDetail);


// send request
// approve request





// Adding and removing from the favorite.
// tripRouter.post("/favorites", checkForToken, addFavorites);

// Removing from the favorite list
// tripRouter.delete("/favorites/:id", checkForToken, removeFavorite);

export { tripRouter }
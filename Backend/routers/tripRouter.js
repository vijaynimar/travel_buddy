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
tripRouter.get("/tourList", checkForToken, showTours);

// To get the detail of a own created Tour 
tripRouter.get("/tourList/:tourId", checkForToken, getTourDetail);

// Approving the requests 
tripRouter.post("/tourList/:tourId", checkForToken, approveReq);





// <-------- As a Tour joiner Logics ------->

// For user to see all the tours that are going on
tripRouter.get("/tours", checkForToken, showAllTours);

// To send the request to a particular tour.
tripRouter.post("/tours/:tourId", checkForToken, sendReq);

// To get the details of anyone else's Tour
tripRouter.get("/tours/:tourId", checkForToken, getTourDetail);


// send request
// approve request





// Adding and removing from the favorite.
// tripRouter.post("/favorites", checkForToken, addFavorites);

// Removing from the favorite list
// tripRouter.delete("/favorites/:id", checkForToken, removeFavorite);

export { tripRouter }
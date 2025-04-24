import express from "express";
const tripRouter = express.Router();
import { checkForToken } from "../controllers/auth.controller.js";
// import { addFavorites, removeFavorite } from "../controllers/tripController.js";
// import { AdminOnly } from "../middlewares/adminOnly";
import { addFavorites, approveReq, enrolledTours, getTourDetail, sendReq, showAllTours, showFavorite, showRequests, showTours, tourAdd, unsendReq } from "../controllers/tripMainController.js";
import { multerPhotos } from "../middlewares/multer.js";
import path from "path";
import { __filename, FavoritePage, tourDetailPage } from "../index.js";
import { __dirname } from "./router.js";
import { homePage } from "../index.js";


// export const __filename = fileURLToPath(import.meta.url);
// export const __dirname = path.dirname(__filename);


tripRouter.get("/home", checkForToken, async (req, res) => {
    try {

        console.log(homePage)
        res.sendFile(homePage);

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: err.message })
    }
})


tripRouter.get("/tourDetail/:tourId", checkForToken, async (req, res) => {
    try {
        res.sendFile(tourDetailPage);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: err.message })
    }
})
tripRouter.get("/favorites", async (req, res) => {
    try {
        res.sendFile(FavoritePage);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: err.message })
    }
}
)

//Adding tour
tripRouter.post("/addTour", multerPhotos, checkForToken, tourAdd)
tripRouter.get("/", (req, res) => {
    return res.send("vijay nimar")
})


// <-------- As a Tour creator Logics ------->

//For the user to see his own created tours
tripRouter.get("/tourList", checkForToken, showTours);
tripRouter.get("/user/favorites", checkForToken, showFavorite);

// To get the detail of a own created Tour 
tripRouter.get("/tourList/:tourId", checkForToken, getTourDetail);

// get all the requestIDS
tripRouter.post("/tourList/:tourId", multerPhotos, checkForToken, showRequests);

// Approving the requests 
tripRouter.post("/tourList/:tourId/:reqId", checkForToken, approveReq);

// Approving the requests 
tripRouter.post("/tourList/:tourId/:reqId", multerPhotos, checkForToken, approveReq);




// <-------- As a Tour joiner Logics ------->

// For user to see all the tours that are going on
tripRouter.get("/tours", multerPhotos, checkForToken, showAllTours);
tripRouter.get("/enrolled", multerPhotos, checkForToken, enrolledTours);
// To send the request to a particular tour.
tripRouter.post("/tours/:tourId", checkForToken, sendReq);
// Remove Request.
tripRouter.delete("/tours/:tourId", checkForToken, unsendReq);

// To get the details of anyone else's Tour
tripRouter.get("/tours/:tourId", checkForToken, getTourDetail);


// Adding and removing from the favorite.
tripRouter.post("/favorites/:tourId", checkForToken, addFavorites);

// Removing from the favorite list
// tripRouter.delete("/favorites/:tourId", checkForToken, removeFavorite);

export { tripRouter }
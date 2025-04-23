import express from "express";
const tripRouter = express.Router();
import { checkForToken } from "../controllers/auth.controller.js";
// import { addFavorites, removeFavorite } from "../controllers/tripController.js";
// import { AdminOnly } from "../middlewares/adminOnly";
import { approveReq, enrolledTours, getTourDetail, sendReq, showAllTours, showRequests, showTours, tourAdd } from "../controllers/tripMainController.js";
import { multerPhotos } from "../middlewares/multer.js";
import path from "path";
import { __filename, tourDetailPage } from "../index.js";
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

<<<<<<< HEAD
// get all the requestIDS
tripRouter.post("/tourList/:tourId", multerPhotos, checkForToken, showRequests);
=======
// Approving the requests 
tripRouter.post("/tourList/:tourId", checkForToken, approveReq);
>>>>>>> ba0db2a27b28c73533ed0792ff8dab3b4950ea8c

// Approving the requests 
tripRouter.post("/tourList/:tourId/:reqId", multerPhotos, checkForToken, approveReq);




// <-------- As a Tour joiner Logics ------->

// For user to see all the tours that are going on
<<<<<<< HEAD
tripRouter.get("/tours", multerPhotos, checkForToken, showAllTours);
tripRouter.get("/enrolled", multerPhotos, checkForToken, enrolledTours);
=======
tripRouter.get("/tours", checkForToken, showAllTours);
>>>>>>> ba0db2a27b28c73533ed0792ff8dab3b4950ea8c

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
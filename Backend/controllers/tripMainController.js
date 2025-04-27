import { Tour } from "../models/tourModel.js";
import { v2 } from "cloudinary"
import fs from "fs"
import { User } from "../models/userModel.js";
v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



// import { CronJob } from 'cron';

// const job = new CronJob(
//     '0 0 0 * * *', // cronTime
//     function () {
//         let user = req.user; 
//         console.log();
//     }, // onTick
//     null, // onComplete
//     true, // start
//     'America/Los_Angeles' // timeZone
// );

export const tourAdd = async (req, res) => {
console.log("12");
    const user = req.user;
    console.log({ user });
    console.log("line12");
    const { startLocation, endLocation, destinations, description, totalCapacity, startDate, endDate, price } = req.body
    try {
        let url = [];
        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                const filePath = req.files[i].path;
                const fileUrl = await v2.uploader.upload(filePath)
                url.push(fileUrl.secure_url)
                fs.unlinkSync(filePath)
            }
        }
        const newTour = new Tour({
            admin: user.email,
            images: url,
            startLocation, endLocation, destinations, description, totalCapacity, startDate, endDate, price
        })
        await newTour.save();

        user.createdTours.push(newTour);
        await user.save();
        return res.status(201).json({ message: "Tour uploaded successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "server error in tour Add", error: err.message })
    }
}



// Show the user's created tours
export const showTours = async (req, res) => {
    let id = req.user.id;
    try {

        console.log({ id });
        console.log({ user: req.user })
        const tours = await User.findById(id)
            .populate({
                path: "createdTours",
                select: "_id startLocation endLocation startDate endDate price totalCapacity destinations description images title"
            });

        console.log({ tours });
        if (!tours || tours.createdTours.length === 0) {
            return res.status(404).json({ message: "User not found or no created any tours yet." });
        }

        return res.status(200).json({
            message: "Your all created tours",
            createdTours: tours.createdTours
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "server error to get all  tours.", error: err.message })
    }
}

// Show the user's created tours
export const showFavorite = async (req, res) => {
    let id = req.user.id;
    try {

        console.log({ id });
        console.log({ user: req.user })
        const tours = await User.findById(id)
            .populate({
                path: "favorite",
                select: "_id startLocation endLocation startDate endDate price totalCapacity destinations description images title"
            });

        console.log({ tours });
        if (!tours || tours.favorite.length === 0) {
            return res.status(404).json({ message: "User not found or no created any tours yet." });
        }

        return res.status(200).json({
            message: "Your all created tours",
            favorites: tours.favorite
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "server error to get all  tours.", error: err.message })
    }
}


// Show the all tours available on the site.
export const showAllTours = async (req, res) => {
    try {

        let tours = await Tour.find();
        // console.log({ tours })

        return res.status(200).json({
            message: "All tours present on the site.",
            createdTours: tours
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "server error to get all  tours.", error: err.message })
    }
}


// Show the all tours available on the site.
export const enrolledTours = async (req, res) => {
    try {
        let user = req.user;

        let tours = await user.populate({
            path: "enrollerTours",
            select: "_id startLocation endLocation startDate endDate price totalCapacity destinations description images title"
        })

        console.log({ tours })

        return res.status(200).json({
            message: "All Enrolled tours",
            enrolledTours: tours.enrollerTours
        });


    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "server error to get all  tours.", error: err.message })
    }
}



export const sendReq = async (req, res) => {
    const user = req.user;
    const tourId = req.params.tourId;

    try {
        console.log({ user, tourId })
        const tourDetail = await Tour.findById(tourId);
        console.log({ tourDetail });
        // If the Id is not present in the tour collection.
        if (!tourDetail) {
            return res.status(404).json({ message: "Tour not found." });
        }
        console.log("tour is present")
        // Check if user already requested
        if (tourDetail.requests.includes(user.id)) {
            return res.status(400).json({ message: "You have already requested to join this tour." });
        }

        console.log("No previous request exist.")
        // Check if the tour is already ended
        const currDate = new Date();
        if (new Date(tourDetail.startDate) < currDate) {
            return res.status(400).json({ message: "This tour has already started you can't join this tour." });
        }

        // Check if tour is full
        if (tourDetail.enrolled.length >= tourDetail.totalCapacity) {
            return res.status(400).json({ message: "This tour is already full." });
        }

        // Add user to requests
        tourDetail.requests.push(user.id);
        await tourDetail.save();

        console.log("");

        return res.status(200).json({ message: "Request sent successfully." });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            err: "Server error in sending the request.",
            message: err.message
        });
    }
};

export const unsendReq = async (req, res) => {
    const user = req.user;
    const tourId = req.params.tourId;

    try {
        const tourDetail = await Tour.findById(tourId);

        if (!tourDetail) {
            return res.status(404).json({ message: "Tour not found." });
        }

        // Check if user has actually requested to join
        const index = tourDetail.requests.indexOf(user.id);
        if (index === -1) {
            return res.status(400).json({ message: "You haven't requested to join this tour." });
        }

        // Remove the user from requests
        tourDetail.requests.splice(index, 1);
        await tourDetail.save();

        return res.status(200).json({ message: "Request removed successfully." });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            err: "Server error in unsending the request.",
            message: err.message
        });
    }
};



// A cronjob that remove all the request older than 7 days and
// Remove requests as well who's user do not exist on the platform now


// Show all requests of a particular tour :
export const showRequests = async (req, res) => {
    const user = req.user;
    try {

        let tourId = req.params.tourId;
        let tourDetail = await Tour.findById(tourId);

        if (tourDetail.admin != user.email) {
            return res.status(404).json({ message: "Only admin can see requests" })
        }

        // If the Id is not present in the tour collection.
        if (tourDetail.length <= 0) {
            return res.status(404).json({ message: "Tour not found." });
        }

        // If there is not request
        if (tourDetail.requests.length < 1) {
            return res.status(404).json({ message: "No request is present for Now." });
        }

        if (tourDetail.admin != user.id) {
            return res.status(403).json({ message: "You can not see the requested List. Only Admin can see." });
        }


        console.log({
            Req: tourDetail.requests
        })

        return res.status(200).json({ message: "Here are all Requests", requests: tourDetail.requests });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "server error in tour Add", error: err.message })
    }
}



// Approve a particular request : 
export const approveReq = async (req, res) => {
    const user = req.user;
    try {
        let tourId = req.params.tourId;
        let reqId = req.params.reqId;

        // console.log({ tourId });
        // console.log({ reqId });
        // console.log({ user });

        let tourDetail = await Tour.findById(tourId);
        let userDetail = await User.findById(reqId);

        console.log({ tourDetail });
        console.log({ tourDetail });


        // If user does not exist in the database now.
        if (!userDetail) {
            return res.status(404).json({ message: "User not found." });
        }

        // Checking if tour exists
        if (!tourDetail) {
            return res.status(404).json({ message: "Tour not found." });
        }

        // Check if tour is already full
        if (tourDetail.enrolled.length >= tourDetail.totalCapacity) {
            return res.status(400).json({ message: "Cannot approve. Tour is already full." });
        }

        // Remove user from requests
        tourDetail.requests = tourDetail.requests.filter(id => id && id.toString() !== reqId);

        // Add user to enrolled
        tourDetail.enrolled.push(reqId.toString());

        await tourDetail.save();

        return res.status(200).json({ message: "User request approved and enrolled in the tour." });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "server error in tour Add", error: err.message })
    }
}



// Get a pecific tour's details
export const getTourDetail = async (req, res) => {

    let user = req.user;
    try {

        let tourId = req.params.tourId;
        let tours = await Tour.findById(tourId);
        // console.log({ tours })

        if (!tours) {
            return res.status(404).json({ message: "Tour not found." });
        }


        return res.status(200).json({
            message: "Here are the all details of the Tour.",
            tourDetail: tours
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "server error to get all  tours.", error: err.message })
    }
}





export const getFavorites = async (req, res) => {
    try {
        console.log("4");
        // Step 1: Get the authenticated user
        const user = req.user;
        console.log({ fav: user.favorite });

        // Step 2: Populate favorite properties using Property model
        const favoriteProperties = await user.populate({
            path: "favorite ",
            model: "Tour"
        });

        // Step 3: Return the favorite properties
        res.status(200).json({ favorites: favoriteProperties.favorite });
    } catch (error) {

        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
}

export const addFavorites = async (req, res) => {
    try {

        // Step 1: Get the propertyId from request body
        // Step 2: Get the user from req.user (after authentication)
        // Step 3: Check if the property is already in the favorites
        // Step 4: If already present, remove it
        // Step 5: If not present, add it to favorites
        // Step 6: Save the updated user record

        const { tourId } = req.params;
        console.log("TourId: ", tourId);

        const user = req.user;

        const alreadyInFavorites = user.favorite.includes(tourId);

        if (alreadyInFavorites) {
            await user.updateOne({ $pull: { favorite: tourId } });
            return res.status(200).json({ message: "Tour removed from favorites." });
        }

        user.favorite.push(tourId);

        await user.save();

        return res.status(201).json({ message: "Tour added to favorites." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
}


// export const removeFavorite = async (req, res) => {
//     const { tourId } = req.params;
//     const userId = req.user.id;

//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "Tour not found" });
//         }

//         // Check if the property is in the user's favorites
//         if (!user.favorite.includes(tourId)) {
//             return res.status(400).json({ message: "Tour not in favorites" });
//         }

//         // Remove property from favorites
//         user.favorite = user.favorite.filter(fav => fav.toString() !== tourId);
//         await user.save();

//         res.status(200).json({ message: "Tour removed from favorites", user });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Internal Server Error.", error: error.message });
//     }
// }




import { Tour } from "../models/tourModel.js";
import { v2 } from "cloudinary"
import fs from "fs"
import { User } from "../models/userModel.js";
v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const tourAdd = async (req, res) => {
    const user = req.user
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

        return res.status(201).json({ message: "Tour uploaded sucessfully" })

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "server error in tour Add", error: err.message })
    }
}



export const showTours = async (req, res) => {
    let id = req.user.id;
    try {

        console.log({ id });
        console.log({ user: req.user })
        const tours = await User.findById(id)
            .populate({
                path: "createdTours",
                select: "_id startLocation endLocation startDate endDate price totalCapacity destinations description images"
            });

        console.log({ tours })


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



export const sendReq = async (req, res) => {
    // taking the user's detail.
    const user = req.user;
    try {
        let tourId = req.params.tourId;  //Taking the tourId from the params;

        let tourDetail = await Tour.findById(tourId);

        // If the Id is not present in the tour collection.
        if (tourDetail.length <= 0) {
            return res.status(404).json({ message: "Tour not found." });
        }

        // Check if user already requested
        if (tourDetail.requests.includes(user.id)) {
            return res.status(400).json({ message: "You have already requested to join this tour." });
        }

        // Check if the tour is already ended.
        let currDate = new Date();
        if (tourDetail.endDate < currDate) {
            return res.status(400).json({ message: "This tour has already ended." });
        }

        // Check if tour is full
        if (tourDetail.enrolled.length >= tour.totalCapacity) {
            return res.status(400).json({ message: "This tour is already full." });
        }

        // Add user to requests
        tourDetail.requests.push(user.Id);
        await tourDetail.save();


        return res.status(200).json({ message: "Request sent successfully." });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "server error in sending the Request.", error: err.message })
    }
}


// A cronjob that remove all the request older than 7 days and
// Remove requests as well who's user do not exist on the platform now


// Show all requests of a particular tour :
export const showRequests = async (req, res) => {
    const user = req.user;
    try {
        let tourId = req.params.tourId;
        let tourDetail = await Tour.findById(tourId);

        // If the Id is not present in the tour collection.
        if (tourDetail.length <= 0) {
            return res.status(404).json({ message: "Tour not found." });
        }

        // If there is not request
        if (tourDetail.requests.length < 1) {
            return res.status(404).json({ message: "No request is present for Now." });
        }

        return res.status(200).json({ message: "Here are all Requests", requests: Tour.requests });

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
        let reqId = req.body.reqId;

        let tourDetail = await Tour.findById(tourId);
        let userDetail = await User.findById(reqId);

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
        tourDetail.requests = tourDetail.requests.filter(id => id.toString() !== reqId);

        // Add user to enrolled
        tourDetail.enrolled.push(reqId);

        await tourDetail.save();

        return res.status(200).json({ message: "User request approved and enrolled in the tour." });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "server error in tour Add", error: err.message })
    }
}

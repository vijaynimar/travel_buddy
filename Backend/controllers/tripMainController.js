import { tour } from "../models/tourModel.js";
import { v2 } from "cloudinary"
import fs from "fs"
import { User } from "../models/userModel.js";
v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const tourAdd = async (req, res) => {
    const token = req.user
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
        res.send(url)
        const newTour = new tour({
            admin: token.email,
            images: url,
            startLocation, endLocation, destinations, description, totalCapacity, startDate, endDate, price
        })
        await newTour.save()
        res.status(201).json({ message: "Tour uploaded sucessfully" })

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "server error in tour Add", error: err.message })
    }
}



export const showTours = async (req, res) => {
    let id = req.user.id;
    try {

        let tours = tour.aggregate([{
            $match: { _id: userObjectId }
        },
        {
            $lookup: {
                from: "tours",               // the name of the Tour collection
                localField: "createdTours",
                foreignField: "_id",
                as: "createdToursDetails"
            }
        },
        {
            projection: {
                _id: 0,
                createdTours: "$createdToursDetails",
                "createdTours._id": 1,
                "createdTours.startLocation": 1,
                "createdTours.endLocation": 1,
                "createdTours.startDate": 1,
                "createdTours.endDate": 1,
                "createdTours.price": 1,
                "createdTours.totalCapacity": 1,
                "createdTours.destinations": 1,
                "createdTours.description": 1,
                "createdTours.images": 1
            }
        }])

        if (tours.length === 0) {
            return res.status(404).json({ message: "User not found or no created tours" });
        }

        return res.status(200).json({
            message: "Your all created tours",
            createdTours: tours[0].createdTours
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

        let Tour = await tour.findById(tourId);

        // If the Id is not present in the tour collection.
        if (Tour.length <= 0) {
            return res.status(404).json({ message: "Tour not found." });
        }

        // Check if user already requested
        if (Tour.requests.includes(user.id)) {
            return res.status(400).json({ message: "You have already requested to join this tour." });
        }

        // Check if the tour is already ended.
        let currDate = new Date();
        if (Tour.endDate < currDate) {
            return res.status(400).json({ message: "This tour has already ended." });
        }

        // Check if tour is full
        if (Tour.enrolled.length >= tour.totalCapacity) {
            return res.status(400).json({ message: "This tour is already full." });
        }

        // Add user to requests
        Tour.requests.push(user.Id);
        await Tour.save();


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
        let Tour = await tour.findById(tourId);

        // If the Id is not present in the tour collection.
        if (Tour.length <= 0) {
            return res.status(404).json({ message: "Tour not found." });
        }

        // If there is not request
        if (Tour.requests.length < 1) {
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

        let Tour = await tour.findById(tourId);
        let userDetail = await User.findById(reqId);

        // If user does not exist in the database now.
        if (!userDetail) {
            return res.status(404).json({ message: "User not found." });
        }

        // Checking if tour exists
        if (!Tour) {
            return res.status(404).json({ message: "Tour not found." });
        }

        // Check if tour is already full
        if (Tour.enrolled.length >= Tour.totalCapacity) {
            return res.status(400).json({ message: "Cannot approve. Tour is already full." });
        }

        // Remove user from requests
        Tour.requests = Tour.requests.filter(id => id.toString() !== reqId);

        // Add user to enrolled
        Tour.enrolled.push(reqId);

        await Tour.save();

        return res.status(200).json({ message: "User request approved and enrolled in the tour." });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "server error in tour Add", error: err.message })
    }
}
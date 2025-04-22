import { tour } from "../models/tourModel.js";
import {v2} from "cloudinary"
import fs from "fs"
v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const tourAdd=async(req,res)=>{
    const token=req.user
    console.log("line12");
    const{startLocation,endLocation,destinations,description,totalCapacity,startDate,endDate,price}=req.body
    try{
        let url=[];
    if(req.files){
        for(let i=0;i<req.files.length;i++){
            const filePath = req.files[i].path;
            const fileUrl=await v2.uploader.upload(filePath)
            url.push(fileUrl.secure_url)
            fs.unlinkSync(filePath)
        } 
    }
    const newTour=new tour({
        admin:token.email,
        images:url,
        startLocation,endLocation,destinations,description,totalCapacity,startDate,endDate,price
    })
    await newTour.save()
    res.status(201).json({message:"Tour uploaded sucessfully"})

    }catch(err){
        console.log(err);
        res.status(500).json({err:"server error in tour Add"})
    }
}
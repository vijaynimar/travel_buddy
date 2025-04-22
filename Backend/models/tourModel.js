import { Schema ,model} from "mongoose";

const tourSchema=new Schema({
    admin:{type:String,required:true},
    start:{type:String,required:true},
    end:{type:String,required:true},
    destinations:[string],
    description:{type:String},
    images:[String],
    totalCapacity:{type:Number,required:true},
    inRolled:[{
         type:Schema.Types.ObjectId,
         ref:"User"
    }],
    startDate:{type:Date},
    endDate:{type:Date},
    price:{type:Number},
    requests:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    ]
})
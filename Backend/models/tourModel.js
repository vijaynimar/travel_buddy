import { Schema, Types, model } from "mongoose";

const tourSchema = new Schema({
    title: { type: String, required: true },
    admin: { type: String, required: true },
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    destinations: [String],
    description: { type: String },
    images: [String],
    totalCapacity: { type: Number, required: true },
    enrolled: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    startDate: { type: Date },
    endDate: { type: Date },
    price: { type: Number },
    requests: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]
})

const Tour = model("Tour", tourSchema)
export { Tour }
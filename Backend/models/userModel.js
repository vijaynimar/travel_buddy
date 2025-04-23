import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    profilePicture: { type: String, default: "" },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, },
    phone: { type: Number, required: true, trim: true, minlength: 10, maxlength: 10 },
    resetToken: { type: String, default: null },
    createdTours: [{ type: Schema.Types.ObjectId("tour"), }],
    enrollerTours: [{ type: Schema.Types.ObjectId }],
});
// Create the User model 
export const User = new model("User", userSchema);
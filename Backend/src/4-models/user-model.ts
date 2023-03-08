import mongoose from "mongoose";

export interface IUserModel extends mongoose.Document{
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

export const UserSchema = new mongoose.Schema<IUserModel>({
    firstName: {
        type: String,
        required: [true, "Missing First Name"],
        maxlength: [20, "First name cannot exceed 20 chars"],
        minlength: [2, "First name must exceed 2 chars"],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Missing Last Name"],
        maxlength: [20, "Last name cannot exceed 20 chars"],
        minlength: [2, "Last name must exceed 2 chars"],
        trim: true,
    },
    username: {
        type: String,
        required: [true, "Missing Username"],
        maxlength: [20, "Username cannot exceed 20 chars"],
        minlength: [2, "Username must exceed 2 chars"],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Missing password"],
        minlength: [5, "Password must exceed 5 chars"],
        max: [150, "Password cannot exceed 150 chars"],
    }
}, {
    versionKey: false,
});

export const UserModel = mongoose.model<IUserModel>("UserModel", UserSchema, "users");
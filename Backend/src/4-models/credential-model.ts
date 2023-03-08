import mongoose from "mongoose";

export interface ICredentialModel extends mongoose.Document{
    username: string;
    password: string;
}

export const CredentialsSchema = new mongoose.Schema<ICredentialModel>({
    username: {
        type: String,
        required: [true, "Missing Username"],
        maxlength: [20, "Username cannot exceed 20 chars"],
        minlength: [2, "Username must exceed 2 chars"],
        trim: true,
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

export const UserModel = mongoose.model<ICredentialModel>("CredentialModel", CredentialsSchema, "credentials");
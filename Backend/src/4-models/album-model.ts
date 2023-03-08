import { UploadedFile } from "express-fileupload";
import mongoose from "mongoose";
import { UserModel } from "./user-model";

export interface IAlbumModel extends mongoose.Document{
    header: string;
    creatorId: mongoose.Schema.Types.ObjectId;
    password: string;
    albumCode: string;
    writePermissions: string;
    readPermissions: string;
    headerImage: UploadedFile;
    imageName: string;
}

export const AlbumSchema = new mongoose.Schema<IAlbumModel>({
    header: {
        type: String,
        required: [true, "Missing Album Header"],
        maxLength: [20, "Album Header Can't exceed 20 chars"],
        minLength: [3, "Album Header Must exceed 3 chars"],
        trim: true,
        unique: true,
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    password: {
        type: String,
        required: [true, "Missing password"],
        minlength: [5, "Password must exceed 5 chars"],
        max: [150, "Password cannot exceed 150 chars"],
    },
    albumCode: {
        type: String,
        unique: true
    },
    writePermissions: {
        type: String,
        default: "creator",
    },
    readPermissions: {
        type: String,
        default: "code",
    },
    headerImage: {
        type: Object,
    },
    imageName: {
        type: String,
        required: [true, "Missing image name"],
        unique: true,
    }
},{
    versionKey: false,
    toJSON: {virtuals: true},
    id: false
});

AlbumSchema.virtual("user", {
    ref: UserModel,
    localField: "creatorId",
    foreignField: "_id",
    justOne: true
});

export const AlbumModel = mongoose.model<IAlbumModel>("AlbumModel", AlbumSchema, "albums");
import mongoose from "mongoose";
import { ImageModel } from "./image-model";
import { UserModel } from "./user-model";

export interface ILikesModel extends mongoose.Document{
    userId: mongoose.Schema.Types.ObjectId;
    imageName: string;
};

export const ViewsSchema = new mongoose.Schema<ILikesModel>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    imageName: {
        type: String,
    }
},{
    versionKey: false,
    toJSON: {virtuals: true},
    id: false
});

ViewsSchema.virtual("user", {
    ref: UserModel,
    localField: "userId",
    foreignField: "_id",
    justOne: true  
});

ViewsSchema.virtual("image", {
    ref: ImageModel,
    localField: "imageId",
    foreignField: "_id",
    justOne: true  
});

export const LikesModel = mongoose.model<ILikesModel>("LikesModel", ViewsSchema, "likes");
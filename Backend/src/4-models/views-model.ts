import mongoose from "mongoose";
import { ImageModel } from "./image-model";
import { UserModel } from "./user-model";

export interface IViewsModel extends mongoose.Document{
    userId: mongoose.Schema.Types.ObjectId;
    imageName: string;
};

export const ViewsSchema = new mongoose.Schema<IViewsModel>({
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

export const ViewsModel = mongoose.model<IViewsModel>("ViewsModel", ViewsSchema, "views");
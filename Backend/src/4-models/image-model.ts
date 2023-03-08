import { UploadedFile } from "express-fileupload";
import mongoose from "mongoose";
import { AlbumModel } from "./album-model";
import { LikesModel } from "./likes-model";
import { UserModel } from "./user-model";
import { ViewsModel } from "./views-model";

export interface IImageModel extends mongoose.Document {
  albumId: mongoose.Schema.Types.ObjectId;
  uploaderId: mongoose.Schema.Types.ObjectId;
  date: Date;
  image: UploadedFile;
  imageName: string;
}

export const ImageSchema = new mongoose.Schema<IImageModel>(
  {
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    uploaderId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    date:{
      type: Date,
    },
    image: {
      type: Object,
    },
    imageName: {
      type: String,
      required: [true, "Missing image name"],
      unique: true,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false,
  }
);

ImageSchema.virtual("album", {
  ref: AlbumModel,
  localField: "albumId",
  foreignField: "_id",
  justOne: true,
});

ImageSchema.virtual("user", {
  ref: UserModel,
  localField: "uploaderId",
  foreignField: "_id",
  justOne: true,
});

ImageSchema.virtual("viewsCount", {
  ref: ViewsModel,
  localField: "imageName",
  foreignField: "imageName",
  count: true,
});

ImageSchema.virtual("likesCount", {
  ref: LikesModel,
  localField: "imageName",
  foreignField: "imageName",
  count: true,
});

export const ImageModel = mongoose.model<IImageModel>(
  "ImageModel",
  ImageSchema,
  "images"
);

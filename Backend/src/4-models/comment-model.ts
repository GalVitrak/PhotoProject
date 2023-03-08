import mongoose from "mongoose";
import { ImageModel } from "./image-model";
import { UserModel } from "./user-model";

export interface ICommentModel extends mongoose.Document{
    imageId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    date: Date;
    text: string;
}

export const CommentSchema = new mongoose.Schema<ICommentModel>({
    imageId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    date: {
        type: Date,
    },
    text: {
        type: String,
        maxlength: [30, "Comment cannot exceed 30 chars"],
        minlength: [0, "Comment Cannot be empty"],
        required: true,
        trim: true,
    }
},
{
  versionKey: false,
  toJSON: { virtuals: true },
  id: false,
});

  
CommentSchema.virtual("user", {
    ref: UserModel,
    localField: "uploaderId",
    foreignField: "_id",
    justOne: true,
  });
  
  CommentSchema.virtual("image", {
    ref: ImageModel,
    localField: "imageId",
    foreignField: "_id",
    justOne: true,
  });

  export const CommentModel = mongoose.model<ICommentModel>("CommentModel", CommentSchema, "comments");
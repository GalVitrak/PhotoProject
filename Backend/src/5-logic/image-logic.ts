import fs from "fs";
import { randomUUID } from "crypto";
import {
  ResourceNotFoundErrorModel,
  ValidationErrorModel,
} from "../4-models/error-models";
import { IImageModel, ImageModel } from "../4-models/image-model";

function getAllImages(): Promise<IImageModel[]> {
  return ImageModel.find().populate(["album","user","likesCount","viewsCount"]).exec();
}

function getAllImagesByAlbum(albumId: string): Promise<IImageModel[]>{
    return ImageModel.find({albumId: albumId}).populate(["album","user","likesCount","viewsCount"]).exec();
}

async function getOneImage(_id:string): Promise<IImageModel> {
  return ImageModel.findOne({_id: _id}).populate(["album","user","likesCount","viewsCount"]).exec();
}

async function addImage(image: IImageModel): Promise<IImageModel> {
  const err = image.validateSync();
  if (err) throw new ValidationErrorModel(err.message);
  if (image.image) {
    const ext = image.image.name.substring(image.image.name.lastIndexOf("."));
    image.imageName = randomUUID() + ext;
    await image.image.mv("./src/1-assets/images/"+image.albumId+"/"+image.imageName);
    image.image = undefined;
  }
  return image.save();
}

async function updateImage(image: IImageModel): Promise<IImageModel> {
  const err = image.validateSync();
  if (err) throw new ValidationErrorModel(err.message);
  if (image.image) {
    if (fs.existsSync("./src/1-assets/images/"+image.albumId+"/"+image.imageName))
      fs.unlinkSync("./src/1-assets/images/"+image.albumId+"/"+image.imageName);
    const ext = image.image.name.substring(image.image.name.lastIndexOf("."));
    image.imageName = randomUUID() + ext;
    await image.image.mv("./src/1-assets/images/"+image.albumId+"/"+image.imageName);
    image.image = undefined;
  }
  const updatedImage = await ImageModel.findByIdAndUpdate(image._id, image, {
    returnOriginal: false,
  }).exec();
  if (!updatedImage) throw new ResourceNotFoundErrorModel(image._id);
  return updatedImage;
}

async function deleteImage(_id: string) {
  const deletedImage = await ImageModel.findByIdAndDelete(_id);
  if (!deletedImage) throw new ResourceNotFoundErrorModel(_id);
  if(deletedImage.imageName){
    if (fs.existsSync("./src/1-assets/images/"+deletedImage.albumId+"/"+deletedImage.imageName))
      fs.unlinkSync("./src/1-assets/images/"+deletedImage.albumId+"/"+deletedImage.imageName);
  }
}

export default {
  getAllImages,
  getOneImage,
  getAllImagesByAlbum,
  addImage,
  updateImage,
  deleteImage,
};

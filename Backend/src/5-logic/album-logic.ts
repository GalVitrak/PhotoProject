import fs from "fs";
import { randomUUID } from "crypto";
import { AlbumModel, IAlbumModel } from "../4-models/album-model";
import { ResourceNotFoundErrorModel, UnauthorizedErrorModel, ValidationErrorModel } from "../4-models/error-models";
import cyber from "../2-utils/cyber";

async function getAllAlbums(): Promise<IAlbumModel[]> {
    return AlbumModel.find().populate("user").exec();
}

async function getAllAlbumsByUser(userId:string): Promise<IAlbumModel[]>  {
    return AlbumModel.find({userId: userId}).populate("user").exec();
}

async function getAlbumByCode(code:string, password?:string): Promise<IAlbumModel>{
    password=cyber.hash(password);
    const album = await AlbumModel.findOne({albumCode: code}).populate("user").exec();
    if(album.password){
        if(album.password===password)
        {
            return album;
        }
        else{
            throw new UnauthorizedErrorModel("Incorrect Password")
        }
    }
    return album 
}

async function getAllOpenAlbums(): Promise<IAlbumModel[]>  {
    return AlbumModel.find({readPermissions: "open"}).populate("user").exec();
}

async function createAlbum(album: IAlbumModel): Promise<IAlbumModel> {
    const err = album.validateSync();
    if (err) throw new ValidationErrorModel(err.message);
    if (album.headerImage) {
        const ext = album.headerImage.name.substring(album.headerImage.name.lastIndexOf("."));
        album.imageName = randomUUID() + ext;
        await album.headerImage.mv("./src/1-assets/images/"+album._id+"/"+album.imageName);
        album.headerImage = undefined;
      }
      if(album.password){
        album.password=cyber.hash(album.password);
      }
    album.albumCode = randomUUID();
    return album.save();
}

async function updateAlbum(album: IAlbumModel): Promise<IAlbumModel> {
    const err = album.validateSync();
    if (err) throw new ValidationErrorModel(err.message);
    if (album.headerImage) {
      if (fs.existsSync("./src/1-assets/images/"+album._id+"/"+album.imageName))
        fs.unlinkSync("./src/1-assets/images/"+album._id+"/"+album.imageName);
      const ext = album.headerImage.name.substring(album.headerImage.name.lastIndexOf("."));
      album.imageName = randomUUID() + ext;
      await album.headerImage.mv("./src/1-assets/images/"+album._id+"/"+album.imageName);
      album.headerImage = undefined;
    }
    const updatedAlbum = await AlbumModel.findByIdAndUpdate(album._id, album, {returnOriginal: false,}).exec();
    if (!updatedAlbum) throw new ResourceNotFoundErrorModel(album._id);
    return updatedAlbum;
  }

  async function deleteAlbum(_id: string) {
    const deletedAlbum = await AlbumModel.findByIdAndDelete(_id);
    if (!deletedAlbum) throw new ResourceNotFoundErrorModel(_id);
      if (fs.existsSync("./src/1-assets/images/"+deletedAlbum._id))
        fs.unlinkSync("./src/1-assets/images/"+deletedAlbum._id);
    }

export default {
    getAllAlbums,
    getAlbumByCode,
    getAllAlbumsByUser,
    getAllOpenAlbums,
    createAlbum,
    updateAlbum,
    deleteAlbum
}
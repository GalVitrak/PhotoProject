import { UnauthorizedErrorModel, ValidationErrorModel } from "../4-models/error-models";
import { ILikesModel, LikesModel } from "../4-models/likes-model";
import { IViewsModel, ViewsModel } from "../4-models/views-model";

async function addView(view:IViewsModel): Promise<IViewsModel> {
    const err = view.validateSync();
    if(err) throw new ValidationErrorModel(err.message);
    const isExists = await checkAlreadyViewed(view);
    if (isExists) throw new UnauthorizedErrorModel("Already counted unique user view");
    return view.save();
}

async function changeLike(like:ILikesModel): Promise<ILikesModel> {
    const err = like.validateSync();
    if(err) throw new ValidationErrorModel(err.message);
    const isLiked = await checkAlreadyLiked(like);
    if(isLiked){
        like._id = (await LikesModel.findOne({ userId: like.userId, imageName: like.imageName }).exec())._id
        return LikesModel.findByIdAndUpdate(like._id, like).exec();
    }
    return like.save();
}

async function checkAlreadyLiked(like:ILikesModel): Promise<boolean> {
    const isLiked = LikesModel.findOne({userId: like.userId, imageName: like.imageName}).exec();
    if(isLiked) return true;
    return false;
}

async function checkAlreadyViewed(view:IViewsModel): Promise<boolean> {
    const isExists = ViewsModel.findOne({userId: view.userId, imageName: view.imageName}).exec();
    if(isExists) return true;
    return false;
}

export default {
    addView,
    changeLike
}
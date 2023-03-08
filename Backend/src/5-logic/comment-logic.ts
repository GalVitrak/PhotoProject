import { CommentModel, ICommentModel } from "../4-models/comment-model";
import { ResourceNotFoundErrorModel, ValidationErrorModel } from "../4-models/error-models";

async function addComment(comment:ICommentModel): Promise<ICommentModel> {
    const err = comment.validateSync();
    if(err) throw new ValidationErrorModel(err.message);
    comment.date=new Date();
    return comment.save();
}

async function updateComment(comment:ICommentModel): Promise<ICommentModel> {
    const err = comment.validateSync();
    if(err) throw new ValidationErrorModel(err.message);
    const updatedComment = await CommentModel.findByIdAndUpdate(comment._id, comment, {returnOriginal: false}).exec();
    if (!updatedComment) throw new ResourceNotFoundErrorModel(comment._id);
    return updatedComment;
}

async function deleteComment(_id:string) {
    const deletedComment = await CommentModel.findByIdAndDelete(_id);
    if (!deletedComment) throw new ResourceNotFoundErrorModel(_id);
}

export default{
    addComment,
    updateComment,
    deleteComment
}
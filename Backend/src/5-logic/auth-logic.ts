import cyber from "../2-utils/cyber";
import { ICredentialModel } from "../4-models/credential-model";
import { UnauthorizedErrorModel, ValidationErrorModel } from "../4-models/error-models";
import { IUserModel, UserModel } from "../4-models/user-model";

async function register(user: IUserModel): Promise<string> {
    const err = user.validateSync();
    if(err) throw new ValidationErrorModel(err.message);
    user.password=cyber.hash(user.password);
    user.save();
    const token = cyber.getNewToken(user);
    return token;
}

async function login(credentials: ICredentialModel): Promise<string> {
    const err = credentials.validateSync();
    if (err) throw new ValidationErrorModel(err.message);
    credentials.password = cyber.hash(credentials.password);
    const user = await UserModel.findOne({username: credentials.username, password: credentials.password}).exec();
    if (!user)
      throw new UnauthorizedErrorModel("Incorrect Username or Password");
    const token = cyber.getNewToken(user);
    return token;
  }

export default {
    register,
    login
}
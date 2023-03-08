import { Request } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { IUserModel } from "../4-models/user-model";

const jwtSecretKey = "ChicknezPhotoProject";

// a function to generate a new Token
function getNewToken(user: IUserModel): string {
  user.password=undefined;
  const container = { user };
  const options = { expiresIn: "12h" };
  const token = jwt.sign(container, jwtSecretKey, options);
  return token;
}

// a function to verify the token
function verifyToken(request: Request): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      const header = request.header("authorization");
      if (!header) {
        resolve(false);
        return;
      }
      const token = header.substring(7);
      if (!token) {
        resolve(false);
        return;
      }
      jwt.verify(token, jwtSecretKey, (err) => {
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      });
    } catch (err: any) {
      reject(err);
    }
  });
}

const salt = "SavtaShelGal'sFacebook";

// a function to encrypt passwords
function hash(plainText: string): string {
  if (!plainText) return null;

  // Hash with salt:
  const hashedText = crypto
    .createHmac("sha512", salt)
    .update(plainText)
    .digest("hex");

  return hashedText;
}


export default {
  getNewToken,
  verifyToken,
  hash,
};

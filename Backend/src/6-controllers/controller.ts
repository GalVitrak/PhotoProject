import express, { Request, Response, NextFunction, request } from "express";
import path from "path";
import { ImageModel } from "../4-models/image-model";
import imageLogic from "../5-logic/image-logic";
import logic from "../5-logic/image-logic";

const router = express.Router(); // Capital R

// GET http://localhost:3001/api/images
router.get("/images", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const images = await logic.getAllImages();
        response.json(images);
    }
    catch (err: any) {
        next(err);
    }
});

router.post("/images", async (request: Request, response: Response, next: NextFunction) => {
  try {
      request.body.image = request.files?.image;
      const image= new ImageModel(request.body);
      const addedImage = await imageLogic.addImage(image);
      response.status(201).json(addedImage); 
  }
  catch (err: any) {
      next(err);
  }
});

router.delete("/images/:_id", async (request: Request, response: Response, next: NextFunction) => {
  try {
      const _id = request.params._id;
      await imageLogic.deleteImage(_id);
      response.status(204);
  }
  catch (err: any) {
      next(err);
  }
});

// GET http://localhost:3001/api/images/albumId/imageName
router.get(
    "/images/:albumId/:imageName",
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const imageName = request.params.imageName;
        const albumId = request.params.albumId;
        const absolutePath = path.join(
          __dirname,
          "..",
          "1-assets",
          "images",
          albumId,
          imageName
        );
        response.sendFile(absolutePath);
      } catch (err: any) {
        next(err);
      }
    }
  );

export default router;


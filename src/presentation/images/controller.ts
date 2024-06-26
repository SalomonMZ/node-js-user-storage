import { Request, Response } from "express";
import { existsSync } from "fs";
import path from "path";

export class ImageController {
  /**
   *
   */
  constructor() {}

  getImage = (req: Request, res: Response) => {
    const { type = "", img = "" } = req.params;

    const imagePath = path.resolve(
      __dirname,
      `../../../uploads/${type}/${img}`
    );

    if (!existsSync(imagePath)) {
      return res.status(400).json({ error: "image does not exist" });
    }
    res.sendFile(imagePath);
  };
}

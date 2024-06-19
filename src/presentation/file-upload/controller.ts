import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services/file-upload.service";
import type { UploadedFile } from "express-fileupload";

const validFolders = ["users", "products", "categories"];

export class FileUploadController {
  //* DI
  constructor(private readonly fileUploadService: FileUploadService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError)
      return res.status(error.statusCode).json({ error: error.message });
    console.log(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  };

  uploadFile = (req: Request, res: Response) => {
    const folder = req.params.type;

    const file = req.body.files.at(0) as UploadedFile;

    this.fileUploadService
      .uploadSingle(file, `uploads/${folder}`)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => this.handleError(error, res));
  };

  updloadMultipleFiles = (req: Request, res: Response) => {
    const folder = req.params.type;
    const file = req.body.files as UploadedFile[];

    this.fileUploadService
      .uploadMultiple(file, `uploads/${folder}`)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => this.handleError(error, res));
  };
}

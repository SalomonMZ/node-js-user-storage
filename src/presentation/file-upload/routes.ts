import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CategoryService } from "../services";
import { FileUploadController } from "./controller";
import { FileUploadService } from "../services/file-upload.service";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";
import { TypeMiddleware } from "../middlewares/type.middleware";

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new FileUploadService();
    const controller = new FileUploadController(service);

    router.use(FileUploadMiddleware.containFiles);
    router.use(TypeMiddleware.validTypes(["users", "products", "categories"]));
    // api/upload/<user|category|product>/
    // api/upload/multiple/<user|category|product>/
    router.post("/single/:type", controller.uploadFile);
    router.post("/multiple/:type", controller.updloadMultipleFiles);

    return router;
  }
}

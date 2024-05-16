import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";

export class AuthMiddleware {
  //* DI is not going to be used, so we omit the ctor

  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.header("Authorization"); // alternative -> req.headers.authorization
    if (!authorizationHeader)
      return res.status(401).json({ error: "Token is missing" });
    if (!authorizationHeader.startsWith("Bearer "))
      return res.status(401).json({ error: "Invalid Bearer token" });
    const token = authorizationHeader.split(" ").at(1) ?? "";

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) return res.status(401).json({ error: "Invalid token" });

      const user = await UserModel.findById(payload.id);
      if (!user) return res.status(401).json({ error: "Invalid token - user" });
      req.body.user = UserEntity.fromObject(user).id;
      next();
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

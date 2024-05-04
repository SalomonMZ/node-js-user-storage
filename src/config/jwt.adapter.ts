import jwt from "jsonwebtoken";
import { envs } from "./envs";

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {
  //? DI?

  static generateToken = (payload: any, duration: string = "2h") => {
    console.log(this);
    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (error, token) => {
        if (error) return resolve(null);
        return resolve(token);
      });
    });
  };

  static validateToken = (token: string) => {
    throw new Error("Not implemented");
  };
}

import { Request, Response } from "express";
import { RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController {
  //* DI
  constructor(public readonly authService: AuthService) {}

  register = (req: Request, res: Response) => {
    const { body } = req;
    const [error, registerDto] = RegisterUserDto.create(body);
    if (error) return res.status(400).json({ error });
    this.authService.registerUser(registerDto!).then((user) => res.json(user));
  };

  loginUser = (req: Request, res: Response) => {
    res.json("loginUser");
  };

  validateEmail = (req: Request, res: Response) => {
    res.json("validateEmail");
  };
}



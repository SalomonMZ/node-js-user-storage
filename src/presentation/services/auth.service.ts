import { UserModel } from "../../data";
import { CustomError, RegisterUserDto } from "../../domain";

export class AuthService {
  constructor(
    
  ) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const isEmailInUse = await UserModel.findOne({
      email: registerUserDto.email,
    });
    if (isEmailInUse) throw CustomError.badRequest("Email is already in use");
    return "Todo ok";
  }
}


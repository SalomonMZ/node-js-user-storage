import { bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const isEmailInUse = await UserModel.findOne({
      email: registerUserDto.email,
    });
    if (isEmailInUse) throw CustomError.badRequest("Email is already in use");
    try {
      const user = new UserModel(registerUserDto);

      // TODO Encriptar password
      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      // TODO JWT <---- Mantener autenticacion de el usuario

      // TODO Email de confirmacion

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return { user: userEntity, token: "ABC" };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    //* Verificar que el usuario exista
    const isUserRegistered = await UserModel.findOne({
      email: loginUserDto.email,
    });

    if (!isUserRegistered) throw CustomError.notFound("User does not exist");

    //* Validar que las password sea correcta

    if (
      !bcryptAdapter.compare(loginUserDto.password, isUserRegistered.password)
    )
      throw CustomError.badRequest("Wrong password");

    const { password, ...userInfo } = UserEntity.fromObject(isUserRegistered);

    //* Return { user: {info usuario}, token: 'ABC} user info sin password

    return {
      user: userInfo,
      token: "ABC",
    };

  }
}

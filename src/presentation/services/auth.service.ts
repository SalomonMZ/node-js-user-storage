import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {
  constructor(
    //* DI de el email service
    private readonly emailService: EmailService
  ) {}

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
      const token = await JwtAdapter.generateToken({
        id: user.id,
      });
      if (!token) throw CustomError.internalServer("Error generating token");

      // TODO Email de confirmacion
      //? Como usar el serivico aqui?
      this.sendEmailValidationLink(user.email);

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return { user: userEntity, token };
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

    const token = await JwtAdapter.generateToken({
      id: userInfo.id,
      email: userInfo.email,
    });
    if (!token) throw CustomError.internalServer("Error generating token");

    //* Return { user: {info usuario}, token: 'ABC} user info sin password

    return {
      user: userInfo,
      token,
    };
  }

  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.unauthorized("Invalid token");

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer("Email not in token");

    const user = await UserModel.findOne({ email });

    if (!user) throw CustomError.internalServer("Email not exist");

    user.emailValidated = true;
    await user.save();
    return true;
  };

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServer("Error getting token");

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
    <h1>Validate your email</h1>
    <p>Click on the following link to validate your email: </p>
    <a href="${link}">Validate your email: ${email}</a>
    `;

    const options = {
      to: email,
      subject: "Validate your email",
      htmlBody: html,
    };

    const isSent = await this.emailService.sendEmail(options);

    if (!isSent) throw CustomError.internalServer("Error sending email");

    return true;
  };
}

import { ValidationService } from '../common/validation.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from './user.model';
import { UserModel } from './user.schema';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Config } from '../config';

export class UserService {
  private validationService: ValidationService;
  constructor() {
    this.validationService = new ValidationService();
  }

  login = async (request: LoginUserRequest): Promise<UserResponse> => {
    const loginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );
    if (loginUserRequest.error) {
      throw new Error(loginUserRequest.error.message);
    }

    const user = await UserModel.findOne({
      username: loginUserRequest.value.username,
    });
    if (!user) {
      throw new Error('Username or password is invalid');
    }

    const validPassword = await bcrypt.compare(
      loginUserRequest.value.password,
      user.password,
    );
    if (!validPassword) {
      throw new Error('Username or password is invalid');
    }

    const token = jwt.sign(
      { username: user.username, name: user.name },
      Config.SECRET_KEY,
      { expiresIn: '1h' },
    );
    return {
      username: user.username,
      name: user.name,
      token,
    };
  };

  register = async (request: RegisterUserRequest): Promise<UserResponse> => {
    const registerUserRequest = this.validationService.validate(
      UserValidation.REGISTER,
      request,
    );
    if (registerUserRequest.error) {
      throw new Error(registerUserRequest.error.message);
    }

    let user = await UserModel.findOne({
      username: registerUserRequest.value.username,
    });
    if (user) {
      throw new Error('Username already exists');
    }

    registerUserRequest.value.password = await bcrypt.hash(
      registerUserRequest.value.password,
      10,
    );
    user = await UserModel.create(registerUserRequest.value);
    return {
      username: user.username,
      name: user.name,
    };
  };
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { initialUser } from './consts';
import { CreateUserDTO } from './signUp.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createInitialUser() {
    const existingUser = await this.userModel.findOne({
      email: initialUser.email,
    });

    if (existingUser) {
      console.warn('Initial user already exists!');
    } else {
      const params = {
        firstName: initialUser.firstName,
        lastName: initialUser.lastName,
        email: initialUser.email,
        phoneNumber: initialUser.phoneNumber,
        password: initialUser.password,
      };
      const newUser = new this.userModel({
        ...params,
      });
      await newUser.save();
      console.warn('Initial user loaded successfully!');
    }
  }

  async signUp(signup) {
    const existingUser = await this.userModel.findOne({ email: signup.email });
    if (existingUser) {
      throw new BadRequestException('User already exists!');
    }
    const { confirmPassword, ...userData } = signup;
    if (signup.password !== confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password dont match!',
      );
    }
    const user = new this.userModel({ ...userData });
    return await user.save();
  }

  async login(login) {
    const existingUser = await this.userModel.findOne({ email: login.email });
    if (!existingUser) {
      throw new BadRequestException('User does not exist. Please check creds!');
    }
    if (existingUser.password !== login.password) {
      throw new BadRequestException('Passwords dont match!');
    }
    return existingUser;
  }
}

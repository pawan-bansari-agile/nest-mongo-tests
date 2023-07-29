import { BadRequestException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, UserSchema } from './user.schema';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/testSample'),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('login', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('should return the user on successful login', async () => {
      const creds = {
        email: 'pawan@yopmail.com',
        password: 'pawan@123',
      };
      const result = await appController.login(creds);
      expect(result).toBeDefined();
      expect(result._id).toBeInstanceOf(Types.ObjectId);
      expect(result.email).toEqual('pawan@yopmail.com');
      expect(result.password).toEqual('pawan@123');
      expect(result.phoneNumber).toEqual('7798813105');
      expect(result.firstName).toEqual('Pawan');
      expect(result.lastName).toEqual('Bansari');
    });

    it('should throw BadRequestException when invalid email is provided', async () => {
      const loginDTO = {
        email: 'wronguser@example.com',
        password: 'pawan@123',
      };

      try {
        await appController.login(loginDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.status).toBe(400);
        expect(error.message).toBe('User does not exist. Please check creds!');
      }
    });

    it('should throw BadRequestException when invalid password is provided', async () => {
      const loginDTO = {
        email: 'pawan@yopmail.com',
        password: 'pawan@12',
      };

      try {
        await appController.login(loginDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.status).toBe(400);
        expect(error.message).toBe('Passwords dont match!');
      }
    });
  });

  describe('signup', () => {
    it('should create a new user when valid data is provided', async () => {
      const newUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const response = await appController.signUP(newUser);

      expect(response).toBeDefined();
      expect(response._id).toBeInstanceOf(Types.ObjectId);
      expect(response.firstName).toBe('John');
      expect(response.lastName).toBe('Doe');
      expect(response.email).toBe('john.doe@example.com');
      expect(response.phoneNumber).toBe('1234567890');
      expect(response.password).toBe('password123');
    });

    it('should throw BadRequestException when user already exists', async () => {
      const newUser = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'existinguser@example.com', // Reusing the existing user's email
        phoneNumber: '5555555555',
        password: 'newpassword',
        confirmPassword: 'newpassword',
      };

      try {
        await appController.signUP(newUser);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.status).toBe(400);
        expect(err.message).toBe('User already exists!');
      }
    });

    it('should throw BadRequestException when password and confirmPassword do not match', async () => {
      const newUser = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phoneNumber: '9876543210',
        password: 'password123',
        confirmPassword: 'mismatchpassword', // Mismatching password and confirmPassword
      };

      try {
        await appController.signUP(newUser);
      } catch (err) {
        expect(err.message).toBe('Password and confirm password dont match!');
      }
    });
  });
});

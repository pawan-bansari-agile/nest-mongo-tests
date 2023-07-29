/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { User, UserSchema } from './user.schema';
import { CreateUserDTO } from './signUp.dto';

describe('AppService', () => {
  let appService: AppService;

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/testSample'),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [AppService],
    }).compile();

    appService = testModule.get<AppService>(AppService);
  });

  describe('signUp', () => {
    it('should throw BadRequestException when user already exists', async () => {
      const signupDTO: CreateUserDTO = {
        firstName: 'Pawan',
        lastName: 'Bansari',
        email: 'existinguser@example.com',
        phoneNumber: '7798813105',
        password: 'password',
        confirmPassword: 'password',
      };

      // Act & Assert
      try {
        await appService.signUp(signupDTO);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.status).toBe(400);
        expect(err.message).toBe('User already exists!');
      }
    });

    it('should throw BadRequestException when password and confirmPassword do not match', async () => {
      // Arrange
      const signupDTO: CreateUserDTO = {
        firstName: 'Pawan',
        lastName: 'Bansari',
        email: 'another@example.com',
        phoneNumber: '7798813105',
        password: 'password',
        confirmPassword: 'mismatchpassword',
      };

      // Act & Assert
      try {
        await appService.signUp(signupDTO);
      } catch (err) {
        expect(err.message).toBe('Password and confirm password dont match!');
      }
    });

    it('should create a new user when valid data is provided', async () => {
      // Arrange
      const signupDTO: CreateUserDTO = {
        firstName: 'Pawan',
        lastName: 'Bansari',
        email: 'testuser@example.com',
        phoneNumber: '7798813105',
        password: 'password',
        confirmPassword: 'password',
      };

      // Act
      const createdUser = await appService.signUp(signupDTO);

      // Assert
      expect(createdUser).toBeDefined();
      expect(createdUser._id).toBeInstanceOf(Types.ObjectId);
      expect(createdUser.firstName).toBe('Pawan');
      expect(createdUser.lastName).toBe('Bansari');
      expect(createdUser.email).toBe('testuser@example.com');
      expect(createdUser.phoneNumber).toBe('7798813105');
      expect(createdUser.password).toBe('password');
    });
  });

  describe('login', () => {
    it('should throw BadRequestException when user does not exist', async () => {
      // Arrange
      const loginDTO = {
        email: 'nonexistinguser@example.com',
        password: 'password',
      };

      // Act & Assert
      try {
        await appService.login(loginDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.status).toBe(400);
        expect(error.message).toBe('User does not exist. Please check creds!');
      }
    });

    it('should throw BadRequestException when passwords do not match', async () => {
      // Arrange
      const loginDTO = {
        email: 'john.doe@example.com',
        password: 'wrongpassword',
      };

      // Act & Assert
      try {
        await appService.login(loginDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.status).toBe(400);
        expect(error.message).toBe('Passwords dont match!');
      }
    });

    it('should return the existing user when valid credentials are provided', async () => {
      // Arrange
      const loginDTO = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      // Act
      const result = await appService.login(loginDTO);

      // Assert
      expect(result).toBeDefined();
      expect(result._id).toBeInstanceOf(Types.ObjectId);
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.email).toBe('john.doe@example.com');
      expect(result.phoneNumber).toBe('1234567890');
      expect(result.password).toBe('password123');
    });
  });
});

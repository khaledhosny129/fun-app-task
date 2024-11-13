import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRegisterRequestDto } from './dto/user-register.req.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

jest.mock('axios');

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('mockedValue'), // Mocking the get method to return a test API key
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService, // Providing the mocked ConfigService
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('doUserRegistration', () => {
    it('should register a new user and return it', async () => {
      const dto: UserRegisterRequestDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        latitude: 30.0444,
        longitude: 31.2357,
      };

      mockUserRepository.findOne.mockResolvedValue(undefined);
      mockUserRepository.create.mockReturnValue(dto);
      mockUserRepository.save.mockResolvedValue(dto);
      jest.spyOn(service, 'getCityFromCoordinates').mockResolvedValue('Cairo');

      const result = await service.doUserRegistration(dto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(repository.create).toHaveBeenCalledWith({ ...dto, city: 'Cairo' });
      expect(repository.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual(dto);
    });

    it('should throw BadRequestException if the email already exists', async () => {
      const dto: UserRegisterRequestDto = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
        latitude: 30.0444,
        longitude: 31.2357,
      };

      mockUserRepository.findOne.mockResolvedValue(dto);

      await expect(service.doUserRegistration(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'password123',
        } as User,
      ];

      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user: User = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      } as User;

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('getCityFromCoordinates', () => {
    it('should return city name when API call is successful', async () => {
      const latitude = 30.0444;
      const longitude = 31.2357;
      const mockResponse = {
        data: {
          results: [
            {
              components: {
                city: 'Cairo',
              },
            },
          ],
        },
      };

      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const city = await service.getCityFromCoordinates(latitude, longitude);

      expect(axios.get).toHaveBeenCalledWith(
        'https://api.opencagedata.com/geocode/v1/json',
        {
          params: {
            key: 'mockedValue',
            q: `${latitude},${longitude}`,
            language: 'en',
          },
        },
      );
      expect(city).toBe('Cairo');
    });
  });
});

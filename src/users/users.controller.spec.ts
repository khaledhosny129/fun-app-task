import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRegisterRequestDto } from './dto/user-register.req.dto';
import { User } from './entities/user.entity';
import { UserRoles } from './enums/user.enum';

// Mock data for testing
const mockUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'hashed_password',
  latitude: 30.0444,
  longitude: 31.2357,
  city: 'cairo',
  role: UserRoles.MEMBER,
  createdAt: new Date(),
  updatedAt: new Date(),
  setPassword: jest.fn(),
  hasId: jest.fn(() => true),
  save: jest.fn(),
  remove: jest.fn(),
  softRemove: jest.fn(),
  recover: jest.fn(),
  reload: jest.fn(),
};

const mockUsersService = {
  doUserRegistration: jest.fn().mockResolvedValue(mockUser),
  findAll: jest.fn().mockResolvedValue([mockUser]),
  findOne: jest.fn().mockResolvedValue(mockUser),
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('doUserRegistration', () => {
    it('should register a user and return the created user', async () => {
      const userDto: UserRegisterRequestDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'secure_password',
        latitude: 30.0444,
        longitude: 31.2357,
      };

      const result = await usersController.doUserRegistration(userDto);
      expect(result).toEqual(mockUser);
      expect(usersService.doUserRegistration).toHaveBeenCalledWith(userDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await usersController.findAll();
      expect(result).toEqual([mockUser]);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user by ID', async () => {
      const result = await usersController.findOne('1');
      expect(result).toEqual(mockUser);
      expect(usersService.findOne).toHaveBeenCalledWith(1);
    });
  });
});

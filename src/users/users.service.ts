import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRegisterRequestDto } from './dto/user-register.req.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  /**
   * Registers a new user.
   * Validates coordinates to ensure the user is located in Egypt and assigns city based on coordinates.
   *
   * @param userRegister Data to register the user
   * @throws BadRequestException If the coordinates are outside Egypt
   * @returns The newly created user
   */
  async doUserRegistration(
    userRegister: UserRegisterRequestDto,
  ): Promise<User> {
    const { name, email, password, latitude, longitude } = userRegister;

    // Check if the email already exists in the database
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Validate coordinates (ensure the user is within Egypt's bounds)
    this.validateCoordinates(latitude, longitude);

    // Get city from coordinates
    const city = await this.getCityFromCoordinates(latitude, longitude);

    const user = this.userRepository.create({
      name,
      email,
      password,
      latitude,
      longitude,
      city,
    });

    return await this.userRepository.save(user);
  }

  /**
   * Gets all users from the database.
   *
   * @returns A list of all users
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * Finds a user by their ID.
   *
   * @param id The ID of the user
   * @throws NotFoundException If no user is found with the given ID
   * @returns The found user
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Retrieves a user by their email.
   *
   * @param email The user's email
   * @returns The user if found, undefined otherwise
   */
  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  /**
   * Uses a geocoding API to get the city name based on latitude and longitude.
   *
   * @param latitude The latitude of the location
   * @param longitude The longitude of the location
   * @returns The city name or 'Unknown' if not found
   */
  async getCityFromCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<string> {
    const apiKey = this.configService.get<string>('API_KEY_opencagedata');

    try {
      const response = await axios.get(
        'https://api.opencagedata.com/geocode/v1/json',
        {
          params: {
            key: apiKey,
            q: `${latitude},${longitude}`,
            language: 'en',
          },
        },
      );

      const city = response.data.results[0]?.components.city || 'Unknown';
      return city;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve city from coordinates');
    }
  }

  /**
   * Validates that the provided coordinates are within the bounds of Egypt.
   *
   * @param latitude The latitude to check
   * @param longitude The longitude to check
   * @throws BadRequestException If coordinates are outside Egypt
   */
  private validateCoordinates(latitude: number, longitude: number): void {
    if (
      latitude < 22.0 ||
      latitude > 31.5 ||
      longitude < 25.0 ||
      longitude > 35.0
    ) {
      throw new BadRequestException('User must be located in Egypt');
    }
  }
}

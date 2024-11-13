import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates the user's credentials (email and password).
   * Compares the provided password with the hashed password stored in the database.
   *
   * @param email The user's email address
   * @param password The user's password
   * @throws BadRequestException If the email does not exist in the system
   * @throws UnauthorizedException If the password is incorrect
   * @returns The user object if the credentials are valid
   */

  async validateUserCreds(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) throw new BadRequestException('No user found with this email');

    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Incorrect password');

    return user;
  }

  /**
   * Generates a JWT token for the authenticated user.
   * The token includes the user's name, email, and ID as the payload.
   *
   * @param user The authenticated user object
   * @returns An object containing the generated JWT access token
   */

  generateToken(user: any) {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }),
    };
  }
}

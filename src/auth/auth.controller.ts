import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiBadRequestResponse({ description: 'No user found with this email' })
  @ApiUnauthorizedResponse({ description: 'Incorrect password' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto): Promise<any> {
    const user = await this.authService.validateUserCreds(
      loginDto.email,
      loginDto.password,
    );
    return this.authService.generateToken(user);
  }
}

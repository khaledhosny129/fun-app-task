import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRegisterRequestDto } from './dto/user-register.req.dto';
import { User } from './entities/user.entity';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @ApiBody({ type: UserRegisterRequestDto })
  @ApiCreatedResponse({
    description: 'Created user object as response',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'User cannot register. Try again!' })
  @UsePipes(ValidationPipe)
  async doUserRegistration(
    @Body()
    userRegister: UserRegisterRequestDto,
  ): Promise<User> {
    return await this.usersService.doUserRegistration(userRegister);
  }

  @Get()
  @ApiBearerAuth('token')
  @ApiOkResponse({
    description: 'getting users successfully',
    type: User,
  })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiForbiddenResponse({ description: 'User forbidden' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('token')
  @ApiNotFoundResponse({ description: 'User with this ID not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('member')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }
}

import { IsEmail, IsNotEmpty, IsNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterRequestDto {
  @ApiProperty({
    description: 'The name of the User',
    example: 'khaled',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The email address of the User',
    example: 'khaledhosny129@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The latitude of the User',
    example: '30.0444',
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'The longitude of the User',
    example: '31.2357',
  })
  @IsNumber()
  longitude: number;

  @ApiProperty({
    description: 'The password of the User',
    example: 'Password123',
  })
  @IsNotEmpty()
  @Length(8, 24)
  password: string;
}

import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRoles } from '../enums/user.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ description: 'Primary key as User ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'User name', example: 'Khaled' })
  @Column()
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'Khaledhosny129@gmail.com',
  })
  @Column({
    unique: true,
  })
  email: string;

  @ApiProperty({ description: 'latitude of user' })
  @Column({ type: 'numeric', precision: 9, scale: 6, nullable: true })
  latitude: number;

  @ApiProperty({ description: 'longitude of user' })
  @Column({ type: 'numeric', precision: 9, scale: 6, nullable: true })
  longitude: number;

  @ApiProperty({ description: 'City that get from the api', example: 'cairo' })
  @Column({ nullable: true })
  city: string;

  @ApiProperty({ description: 'Hashed user password' })
  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.MEMBER })
  role: UserRoles;

  @ApiProperty({ description: 'When user was created' })
  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }
}

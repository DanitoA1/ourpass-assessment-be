import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async signup(data: CreateUserDto) {
    const userExist = await this.userRepository.findOneBy({
      email: data.email,
    });
    if (userExist)
      throw new NotAcceptableException('User with phone number already exist');

    const salt = bcrypt.genSaltSync(10);
    const passHash = bcrypt.hashSync(data.password, salt);

    const user = await this.userRepository.create({
      ...data,
      password: passHash,
    });

    const createdUser = await this.userRepository.save(user);
    delete createdUser['password'];

    return {
      status: true,
      message: 'Successfully signed up',
      access_token: this.generateToken(createdUser),
      user: createdUser,
    };
  }

  generateToken(user: User) {
    const secret = process.env.JWT_SECRET_KEY;
    const payload = {
      user_uuid: user.id,
      email: user.email,
    };
    return this.jwtService.sign(payload, { secret });
  }

  async login(data: UserLoginDto) {
    const user = await this.userRepository.findOneBy({
      email: data.email,
    });
    console.log(user);
    if (!user)
      throw new UnauthorizedException(
        'User with this email address does not exist',
      );
    if (user && bcrypt.compareSync(data.password, user.password)) {
      delete user['password'];
      return {
        status: true,
        message: 'Log in successful',
        access_token: this.generateToken(user),
        user,
      };
    }
  }
}

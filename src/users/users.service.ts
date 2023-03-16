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
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { TokenService } from 'src/token/token.service';
import { CreateUpdateTokenDto } from 'src/token/dto/create-update-token.dto';
import * as moment from 'moment';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}
  async signup(data: CreateUserDto) {
    const userExist = await this.getUserByEmail(data.email);
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

    const access_token = this.generateToken(createdUser, '1d');
    const tokenObject: CreateUpdateTokenDto = {
      token: access_token,
      expiresAt: moment().add(1, 'd').format(),
      user,
    };

    await this.tokenService.saveAndUpdateToken(tokenObject);

    return {
      status: true,
      message: 'Successfully signed up',
      access_token,
      user: createdUser,
    };
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOneBy({
      email,
    });
  }

  generateToken(user: User, duration: string) {
    const secret = process.env.JWT_SECRET_KEY;
    const payload = {
      user_uuid: user.id,
      email: user.email,
    };
    return this.jwtService.sign(payload, { secret, expiresIn: duration });
  }

  async login(data: UserLoginDto) {
    const user = await this.getUserByEmail(data.email);

    if (!user)
      throw new UnauthorizedException(
        'User with this email address does not exist',
      );
    if (user && bcrypt.compareSync(data.password, user.password)) {
      delete user['password'];

      const access_token = this.generateToken(user, '1d');
      const tokenObject: CreateUpdateTokenDto = {
        token: access_token,
        expiresAt: moment().add(1, 'd').format(),
        user,
      };

      await this.tokenService.saveAndUpdateToken(tokenObject);

      return {
        status: true,
        message: 'Log in successful',
        access_token,
        user,
      };
    }

    throw new UnauthorizedException('Invalid email or password');
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.getUserByEmail(data.email);
    if (!user)
      throw new NotAcceptableException(
        'User with this email address does not exist',
      );

    const access_token = this.generateToken(user, '0.5h');
    const tokenObject: CreateUpdateTokenDto = {
      token: access_token,
      expiresAt: moment().add(30, 'm').format(),
      user,
    };

    await this.tokenService.saveAndUpdateToken(tokenObject);

    return {
      status: true,
      message:
        'Access token successfully generated for password reset, it expires in 30 minutes',
      access_token,
    };
  }

  async changePassword(data: ChangePasswordDto, user: User) {
    if (!bcrypt.compareSync(data.current_password, user.password))
      throw new NotAcceptableException('Current password entered is incorrect');
    const salt = bcrypt.genSaltSync(10);
    const passHash = bcrypt.hashSync(data.new_password, salt);

    await this.userRepository.update({ id: user.id }, { password: passHash });
    return {
      status: true,
      message: 'Password successfully changed',
    };
  }

  async resetPassword(data: ResetPasswordDto, user: User) {
    const salt = bcrypt.genSaltSync(10);
    const passHash = bcrypt.hashSync(data.new_password, salt);

    await this.userRepository.update({ id: user.id }, { password: passHash });
    return {
      status: true,
      message: 'Password reset successfully',
    };
  }
}

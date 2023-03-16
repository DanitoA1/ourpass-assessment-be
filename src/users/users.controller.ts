import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotAcceptableResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DecorateAll } from 'decorate-all';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtUserStrategy } from 'src/auth/jwt-auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Users')
@DecorateAll(ApiBadRequestResponse({ description: 'Bad Request' }))
@DecorateAll(ApiNotAcceptableResponse({ description: 'Not Accepted' }))
@DecorateAll(ApiUnauthorizedResponse({ description: 'Unauthorized' }))
@DecorateAll(
  ApiServiceUnavailableResponse({ description: 'Service Unavailable' }),
)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  signup(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }

  @Post('login')
  login(@Body(ValidationPipe) userLoginDto: UserLoginDto) {
    return this.usersService.login(userLoginDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto) {
    return this.usersService.forgotPassword(forgotPasswordDto);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtUserStrategy)
  @Post('change-password')
  changePassword(
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
    @Req() req,
  ) {
    return this.usersService.changePassword(changePasswordDto, req.user);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtUserStrategy)
  @Post('reset-password')
  resetPassword(
    @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
    @Req() req,
  ) {
    return this.usersService.resetPassword(resetPasswordDto, req.user);
  }
}

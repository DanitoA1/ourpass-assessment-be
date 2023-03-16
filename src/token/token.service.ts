import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUpdateTokenDto } from './dto/create-update-token.dto';
import { UserToken } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(UserToken)
    private userTokenRepository: Repository<UserToken>,
  ) {}

  async saveAndUpdateToken(data: CreateUpdateTokenDto) {
    return await this.userTokenRepository.upsert({ ...data }, ['user']);
  }

  async getToken(token: string) {
    return await this.userTokenRepository.findOneBy({
      token,
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  findAll() {
    return this.userRepo.find();
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  async create(data: { email: string; password: string; name?: string }) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async setRefreshToken(userId: number, hashedToken: string | null) {
    await this.userRepo.update(userId, { hashedRefreshToken: hashedToken });
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepo.remove(user);
  }
}

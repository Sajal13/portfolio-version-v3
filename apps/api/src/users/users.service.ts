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
  private static readonly MAX_OTP_ATTEMPTS = 5;

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

  async setOtp(userId: number, otpHash: string, otpExpiresAt: Date) {
  // Fresh OTP also resets the attempt counter
    await this.userRepo.update(userId, {
      otpCode: otpHash,
      otpExpiresAt,
      otpAttempts: 0
    });
  }

  async clearOtp(userId: number) {
    await this.userRepo.update(userId, {
      otpCode: null,
      otpExpiresAt: null,
      otpAttempts: 0
    });
  }

  async consumeOtp(userId: number, expectedHash: string): Promise<boolean> {
    const result = await this.userRepo
      .createQueryBuilder()
      .update(User)
      .set({ otpCode: null, otpExpiresAt: null, otpAttempts: 0 })
      .where('id = :userId', { userId })
      .andWhere('otpCode = :expectedHash', { expectedHash })
      .execute();

    return (result.affected ?? 0) > 0;
  }

  /**
   * Atomically increments the attempt counter and returns the new count.
   * Atomic so concurrent wrong guesses can't undercount each other.
   */
  async incrementOtpAttempts(userId: number): Promise<number> {
    await this.userRepo
      .createQueryBuilder()
      .update(User)
      .set({ otpAttempts: () => '"otpAttempts" + 1' })
      .where('id = :userId', { userId })
      .execute();

    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: { otpAttempts: true }
    });
    return user?.otpAttempts ?? UsersService.MAX_OTP_ATTEMPTS;
  }
  async updatePassword(userId: number, hashedPassword: string) {
    await this.userRepo.update(userId, { password: hashedPassword });
  }
}

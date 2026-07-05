import {
  Injectable,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>
  ) {}

  async getProfile(): Promise<Profile | null> {
    const [profile] = await this.profileRepository.find({ take: 1 });
    return profile ?? null;
  }

  async createProfile(dto: CreateProfileDto): Promise<Profile> {
    const existing = await this.profileRepository.find({ take: 1 });
    if (existing.length > 0) {
      throw new ConflictException(
        'Profile already exists — use update instead'
      );
    }
    const profile = this.profileRepository.create(dto);
    return this.profileRepository.save(profile);
  }

  async updateProfile(dto: UpdateProfileDto): Promise<Profile> {
    const [profile] = await this.profileRepository.find({ take: 1 });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    Object.assign(profile, dto);
    return this.profileRepository.save(profile);
  }
}

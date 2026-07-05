import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { ProfileService } from './profile.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get profile information' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async getProfile() {
    const profile = await this.profileService.getProfile();

    if (!profile) {
      return { success: true, message: 'Profile not found', data: [] };
    }

    return plainToInstance(ProfileResponseDto, profile);
  }

  @Post('/create')
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new profile' })
  @ApiResponse({ status: 201, type: ProfileResponseDto })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  async createProfile(@Body() dto: CreateProfileDto) {
    const profile = await this.profileService.createProfile(dto);
    return plainToInstance(ProfileResponseDto, profile);
  }

  @Put('/update')
  @Roles('admin')
  @ApiOperation({ summary: 'Update profile information' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async updateProfile(@Body() dto: UpdateProfileDto) {
    const profile = await this.profileService.updateProfile(dto);
    return plainToInstance(ProfileResponseDto, profile);
  }
}

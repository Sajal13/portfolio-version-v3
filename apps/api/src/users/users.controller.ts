import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 201, type: UserResponseDto, isArray: true })
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Delete('delete/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  async deleteUser(@Param('id', ParseIntPipe) userId: number) {
    return await this.usersService.deleteUser(userId);
  }
}

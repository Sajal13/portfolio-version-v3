import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 201, type: UserResponseDto, isArray: true })
  @ResponseMessage('User get successful.')
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Delete('/delete/:id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ResponseMessage('User deleted successfully.')
  async deleteUser(@Param('id', ParseIntPipe) userId: number) {
    return await this.usersService.deleteUser(userId);
  }
}

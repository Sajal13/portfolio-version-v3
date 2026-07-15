import { Body, Controller, Ip, Post, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Public } from '../auth/decorators/public.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ContactResponseDto } from './dto/contact-reponse.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all contact messages (newest first)' })
  @ApiResponse({ status: 200, type: ContactResponseDto, isArray: true })
  @ResponseMessage('Messages fetched successfully.')
  async getAllContacts() {
    return this.contactService.getAllContacts();
  }

  @Post()
  @Public()
  @Throttle({ default: { limit: 3, ttl: 600_000 } })
  @ApiOperation({ summary: 'Submit a contact form message' })
  @ApiResponse({ status: 201, description: 'Message received.' })
  @ApiResponse({ status: 429, description: 'Too many requests.' })
  @ResponseMessage('Message sent successfully.')
  async submitContact(@Body() dto: CreateContactDto, @Ip() ip: string) {
    return await this.contactService.submitContact(dto, ip);
  }
}

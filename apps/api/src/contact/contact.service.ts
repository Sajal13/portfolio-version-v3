import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { MailService } from '../mail/mail.service';

// How long a single email address must wait before submitting again.
const COOLDOWN_HOURS = 24;

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,

    private readonly mailService: MailService
  ) {}

  async getAllContacts(): Promise<Contact[]> {
    return await this.contactRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async submitContact(
    dto: CreateContactDto,
    ip: string
  ): Promise<{ success: true }> {
    // Honeypot field already rejected by the DTO's @IsEmpty validator
    // before this method is even reached, since it runs at the controller
    // boundary via the global ValidationPipe.

    const cooldownWindowStart = new Date(
      Date.now() - COOLDOWN_HOURS * 60 * 60 * 1000
    );

    const recentByEmail = await this.contactRepository.findOne({
      where: {
        email: dto.email,
        createdAt: MoreThan(cooldownWindowStart)
      }
    });

    if (recentByEmail) {
      throw new HttpException(
        `You've already sent a message recently. Please wait before sending another.`,
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    const contact = this.contactRepository.create({
      name: dto.name,
      email: dto.email,
      message: dto.message,
      ip
    });

    await this.contactRepository.save(contact);

    // Fire-and-forget: the message is already safely stored even if the
    // notification email fails.
    void this.mailService.sendContactNotification({
      name: dto.name,
      email: dto.email,
      message: dto.message
    });

    return { success: true };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface ContactNotificationPayload {
  name: string;
  email: string;
  message: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('gmail.sender'),
        pass: this.configService.get<string>('gmail.appPassword')
      }
    });
  }

  async sendContactNotification(
    payload: ContactNotificationPayload
  ): Promise<void> {
    console.log(
      this.configService.get<string>('gmail.sender'),
      this.configService.get<string>('gmail.appPassword')
    );
    const notifyTo = this.configService.get<string>('gmail.receiver');

    try {
      await this.transporter.sendMail({
        from: `"Portfolio Contact Form" <${this.configService.get<string>('gmail.sender')}>`,
        to: notifyTo,
        replyTo: payload.email,
        subject: `New contact message from ${payload.name}`,
        text: `Name: ${payload.name}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${this.escapeHtml(payload.name)}</p>
          <p><strong>Email:</strong> ${this.escapeHtml(payload.email)}</p>
          <p><strong>Message:</strong></p>
          <p>${this.escapeHtml(payload.message).replace(/\n/g, '<br />')}</p>
        `
      });
    } catch (error) {
      // Don't let email failure block the contact submission from being
      // saved — log it so you can follow up, but the user's message is
      // already safely in the database at this point.
      this.logger.error('Failed to send contact notification email', error);
    }
  }

  private escapeHtml(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

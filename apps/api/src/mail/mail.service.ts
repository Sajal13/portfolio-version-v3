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

  /**
   * Sends the one-time login code. This one is allowed to throw — if the
   * user never receives the code, the login attempt should fail rather
   * than silently leave them stuck at the OTP screen.
   */
  async sendOtpCode(to: string, otp: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Security" <${this.configService.get<string>('gmail.sender')}>`,
        to,
        subject: 'Your login verification code',
        text: `Your one-time verification code is ${otp}. It expires in 3 minutes. If you didn't request this, you can ignore this email.`,
        html: `
          <p>Your one-time verification code is:</p>
          <h2 style="letter-spacing: 4px;">${otp}</h2>
          <p>This code expires in <strong>3 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
        `
      });
    } catch (error) {
      this.logger.error('Failed to send OTP email', error);
      throw error;
    }
  }

  /**
   * Best-effort security alert to the admin/owner mailbox whenever a login
   * attempt with valid admin credentials happens. Swallows its own errors
   * so a flaky mail send never blocks the login itself.
   */
  async sendLoginNotification(email: string): Promise<void> {
    const notifyTo = this.configService.get<string>('gmail.receiver');
    const when = new Date().toISOString();

    try {
      await this.transporter.sendMail({
        from: `"Security Alerts" <${this.configService.get<string>('gmail.sender')}>`,
        to: notifyTo,
        subject: 'New admin login attempt',
        text: `A login attempt for ${email} occurred at ${when}.`,
        html: `<p>A login attempt for <strong>${this.escapeHtml(email)}</strong> occurred at ${when}.</p>`
      });
    } catch (error) {
      this.logger.error('Failed to send login notification email', error);
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
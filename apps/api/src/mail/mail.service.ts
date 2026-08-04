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
  async sendOtpCode(
    to: string,
    otp: string,
    meta: { requestedAt?: Date } = {}
  ): Promise<void> {
    const notifyTo = this.configService.get<string>('gmail.receiver');
    const when = (meta.requestedAt ?? new Date()).toISOString();

    // Combines the OTP delivery and the "someone tried to log in" security
    // alert into a single email, sent once, to whichever address is
    // appropriate. If the OTP recipient and the alert recipient are the
    // same address (typical for a single-admin setup), this halves the
    // send volume compared to firing two separate emails per login.
    const sameRecipient = to === notifyTo;

    try {
      await this.transporter.sendMail({
        from: `"Security" <${this.configService.get<string>('gmail.sender')}>`,
        to,
        // CC the notify address only when it differs from the OTP recipient
        // — avoids a redundant second copy to the same inbox.
        ...(sameRecipient || !notifyTo ? {} : { cc: notifyTo }),
        subject: 'Login attempt — your verification code',
        text: [
          `A login attempt for ${to} occurred at ${when}.`,
          `If this was you, your one-time verification code is: ${otp}`,
          `It expires in 3 minutes.`,
          `If you didn't request this, you can ignore this email — no one can access your account without this code.`
        ].join('\n\n'),
        html: `
          <p>A login attempt for <strong>${this.escapeHtml(to)}</strong> occurred at ${when}.</p>
          <p>If this was you, your one-time verification code is:</p>
          <h2 style="letter-spacing: 4px;">${otp}</h2>
          <p>This code expires in <strong>3 minutes</strong>.</p>
          <p style="color: #666; font-size: 0.9em;">
            If you didn't request this, you can safely ignore this email —
            no one can access your account without this code.
          </p>
        `
      });
    } catch (error) {
      this.logger.error('Failed to send OTP/login notification email', error);
      // Still allowed to throw — same reasoning as before: if the user
      // never receives the code, the login attempt should fail rather
      // than silently strand them at the OTP screen.
      throw error;
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
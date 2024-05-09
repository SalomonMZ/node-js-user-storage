import nodemailer, { Transporter } from "nodemailer";

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachements?: Attachement[];
}

export interface Attachement {
  filename: string;
  path: string;
}

type Props = {
  mailerService: string;
  mailerEmail: string;
  senderEmailPassword: string;
  preventEmail: boolean;
};

export class EmailService {
  private transporter: Transporter;
  private readonly preventEmail: boolean;

  constructor({
    mailerEmail,
    mailerService,
    senderEmailPassword,
    preventEmail,
  }: Props) {
    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: senderEmailPassword,
      },
    });
    this.preventEmail = preventEmail;
  }

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachements = [] } = options;

    if (!this.preventEmail) return true;

    try {
      await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachements,
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}

import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { Service, Inject } from "typedi";
import { SESSION_MAX_AGE, DEV_ENV, PROD_ENV } from "../../config";
import formData from "form-data";
import Mailgun from "mailgun.js";

type EmailOptions = {
  message: string;
  userName?: string;
  userEmail: string;
  isInternal?: boolean;
};
export interface EmailServiceI {
  sendEmail(orgEmail: string, orgName: string, options: EmailOptions): object;
}

@Service("EmailService")
class EmailService implements EmailServiceI {
  #MAILGUN_API_KEY: string;
  #MAILGUN_DOMAIN: string;
  #mailClient: any;

  constructor(
    @Inject("MAILGUN_API_KEY") MAILGUN_API_KEY: string,
    @Inject("MAILGUN_DOMAIN") MAILGUN_DOMAIN: string,
    @Inject("Logger") private logger,
  ) {
    this.logger = logger;
    this.#MAILGUN_API_KEY = MAILGUN_API_KEY;
    this.#MAILGUN_DOMAIN = MAILGUN_DOMAIN;

    const mg = new Mailgun(formData);
    this.#mailClient = mg.client({ key: MAILGUN_API_KEY, username: "api" });
  }

  public sendEmail = async (orgEmail: string, orgName: string, options?: EmailOptions): Promise<any> => {
    try {
      this.logger.info("EmailService::sendEmail:: - Initialized - ");

      //WE LIVE!!!!! (remove this comment)
      let recipient = DEV_ENV ? options.userEmail : orgEmail;

      const name = options.userName || null;
      const defaultMessage = `
      Hi ${orgName},\n
      ${
        name
          ? `${name}, a member of the ClearPath community has expressed interest in accessing your program/services.\n`
          : `Our Clearpath community member has expressed interest in accessing your program/services.\n`
      }

      ClearPath is an online resource directory, tailored towards youth experiencing homelessness, with the focus of connecting our trusting community to the right programs and resources with ease!\n

      ${
        name || "Our Clearpath community member"
      },would greatly appreciate it if you contacted them or provided the needed information to be considered for your programs.Please find their contact information CC'd in the email above!
      
      
      Best,\n
      ClearPath NYC Team
      info@clearpathnyc.org
      clearpath-foundation.org
      `;

      const data = {
        from: `ClearPathNYC User (${options.userEmail}) <Clearpathnyc@gmail.com> `,
        to: [recipient],
        subject: "A message from ClearPath - ",
        text: defaultMessage,
        cc: options.userEmail,
      };

      return this.#mailClient.messages.create(this.#MAILGUN_DOMAIN, data).then((res) => {
        this.logger.info("EmailService::sendEmail:: - Success -");
        return res;
      });
    } catch (err) {
      this.logger.error(err);
      throw new Error(`Failure when sending email: ${err}`);
    }
  };
}

export default EmailService;

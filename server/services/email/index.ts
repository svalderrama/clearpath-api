import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { Service, Inject } from "typedi";
import { SESSION_MAX_AGE, DEV_ENV } from "../../config";
import formData from "form-data";
import Mailgun from "mailgun.js";

type EmailOptions = {
  message: string;
  userName?: string;
  userEmail: string;
};
export interface EmailServiceI {
  sendEmail(orgEmail: string, orgName: string, options: EmailOptions): object;
}

@Service("EmailService")
class EmailService implements EmailServiceI {
  #MAILGUN_API_KEY: string;
  #MAILGUN_DOMAIN: string;
  #mailClient;

  constructor(
    @Inject("MAILGUN_API_KEY") MAILGUN_API_KEY: string,
    @Inject("MAILGUN_DOMAIN") MAILGUN_DOMAIN: string,
    @Inject("Logger") private logger,
  ) {
    this.logger = logger;
    this.#MAILGUN_API_KEY = MAILGUN_API_KEY;
    this.#MAILGUN_DOMAIN = MAILGUN_DOMAIN;

    const mg = new Mailgun(formData);

    // check if username is correct
    this.#mailClient = mg.client({ key: MAILGUN_API_KEY, username: "api" });
  }

  public sendEmail = async (orgEmail: string, orgName: string, options?: EmailOptions): Promise<any> => {
    try {
      this.logger.info("EmailService: sending email...");

      const TO_DATA = DEV_ENV ? `ClearPathDevUser, abartaddison1@clearpathnyc.org` : `${orgName}, ${orgEmail}`;

      const name = options.userName || null;
      const defaultMessage = `
      ${
        name
          ? `${name}, a member of the ClearPath community has expressed interest in accessing your programs!\n`
          : `Our Clearpath community member has expressed interest in accessing your programs!\n`
      }

      ClearPath is an online resource directory, tailored towards youth experiencing homelessness, with the focus of connecting our trusting community to the right programs and resources with ease!\n

      ${
        name || "Our Clearpath community member"
      },would greatly appreciate it if you contacted them or provided the needed information to be considered for your programs.Please find their contact information and/or necessary documentation below!`;

      const data = {
        from: `ClearPathNYC User ${options.userEmail ? `<${options.userEmail}>` : ""}`,
        to: TO_DATA,
        subject: "A message from ClearPath - ",
        text: defaultMessage,
      };

      this.#mailClient.messages().send(data, function (error, body) {
        if (error) {
          console.log("ERROR WITH MAIL---", error);
        } else {
          console.log(body);
        }
      });

      return this.#mailClient;
    } catch (err) {
      this.logger.error(err);
      throw new Error(`Failure when sending email: ${err}`);
    }
  };
}

export default EmailService;

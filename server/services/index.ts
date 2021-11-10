import AuthService from "./auth-service";
import OrgService from "./org-service";
import UserService from "./user-service";
import ApplicationService from "./application-service";
import EmailService from "./email";

/* ** NOTE: Export all services so that they can be loaded when the server runs! ** */
export default {
  AuthService,
  OrgService,
  UserService,
  EmailService,
  ApplicationService,
};

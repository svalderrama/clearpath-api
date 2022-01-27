import { Container } from "typedi";
import { Logger } from "winston";

import { OrgServiceI } from "../services/org-service";
import { UserServiceI } from "../services/user-service";
import { EmailServiceI } from "../services/email";
import ApplicationService from "../services/application-service";

function ApplicationController() {
  const logger: Logger = Container.get("Logger");
  const OrgService: OrgServiceI = Container.get("OrgService");
  const UserService: UserServiceI = Container.get("UserService");
  const EmailService: EmailServiceI = Container.get("EmailService");
  const ApplicationService: ApplicationService = Container.get("ApplicationService");

  return {
    /* Submit a user application */
    async submit(req, res, next: (err: any) => void) {
      try {
        logger.info(`ApplicationController::submit:: Starting submit action`);

        /* TODO: Validate data (need user id & org id, message optional) */
        const { message, userId, orgId } = req.body;
        const pendingApp = await ApplicationService.hasPendingApp(userId, orgId);

        if (pendingApp) {
          logger.info("ApplicationController::submit::failed:: Application already exists for this org");
          throw new Error("CONFLICT: An application has already been submitted for this org");
        }

        const org = await OrgService.getById(orgId);
        const user = await UserService.getById(userId);
        //TODO: Add custom exceptions and raise them. Sanitize org_id and user

        const modifiers = {
          userName: user?.firstName || null,
          userEmail: user.email,
          message: message || "",
        };

        const mailResponse = await EmailService.sendEmail(org.email, org.name, modifiers);

        if (mailResponse) {
          const application = await ApplicationService.create(userId, orgId, org.name, message);

          logger.info(`ApplicationController::submit::success:: Application submitted`, { userId, orgId });
          return res.status(200).json({ message: "ok", application });
        } else {
          logger.error(`ApplicationController:submit::Error submitting application`);
          next({ reqBody: req.body, org, user });
        }
      } catch (err) {
        logger.error(`ApplicationController::submit::error::`, err);
        next(err);
      }
    },

    async showAll(req, res, next: (err: any) => void) {
      try {
        const { userId } = req.params;

        logger.info(`ApplicationController:showAll:: Retrieving all user apps`);
        const { applications, stats } = await ApplicationService.getUserApplications(userId);

        return res.status(200).json({
          message: "ok",
          applications,
          stats,
          total: applications.length,
        });
      } catch (err) {
        logger.error(err);
        next(err);
      }
    },
  };
}

/** Instantiate */
const ApplicationControllerIns = ApplicationController();

export default ApplicationControllerIns;

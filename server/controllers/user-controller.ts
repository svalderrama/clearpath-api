import { Container } from "typedi";

import { UserServiceI } from "../services/user-service";
import { Logger } from "winston";

function UserController() {
  const UserService: UserServiceI = Container.get("UserService");
  const logger: Logger = Container.get("Logger");

  return {
    async update(req, res, next: (err: any) => void) {
      /* Get all Organizations */
      try {
        logger.info("UserController:update:: Starting response cycle");

        const userDetails = req.body;
        const userId = userDetails.id;
        const user = await UserService.getById(userDetails.id);

        if (!user) {
          return next({
            error: "UserController:update::Bad Request: User does not exist",
          });
        }

        delete userDetails.id;

        const updatedUser = await UserService.updateDetails(userId, userDetails);
        logger.info("UserController:update:: User details updated!");

        return res.status(200).json({  message: "ok",  data: updatedUser,});
      } catch (err) {
        logger.error(err);
        next(err);
      }
    },
  };
}

/** Instantiate */
const UserControllerIns = UserController();

export default UserControllerIns;

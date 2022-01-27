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

        console.log("transformedBody", req.body);

        // const { userId } = req.params;
        // const user = await UserService.getById(userId);

        // const userDetails = req.body;

        // if (!user) {
        //   return next({
        //     error: "UserController:update::Bad Request: User does not exist",
        //   });
        // }

        // delete userDetails.id;

        // const updatedUser = await UserService.updateDetails(userId, userDetails);

        // delete updatedUser.password;

        // logger.info("UserController:update:: User details updated!");
        return res.status(200).json({ message: "ok" });
        // return res.status(200).json({ message: "ok", user: updatedUser });
      } catch (err) {
        logger.error(err);
        next(err);
      }
    },

    async showOne(req, res, next: (err: any) => void) {
      /* Get one Organization by ID */
      try {
        logger.info("OrgsController:showOne:: Starting response cycle");

        const { userId } = req.params;
        const user = await UserService.getById(userId);

        if (!user) {
          return next({
            error: "UserController:update::Bad Request: User does not exist",
          });
        }

        delete user.password;

        return res.status(200).json({
          message: "ok",
          user,
        });
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

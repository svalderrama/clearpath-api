import { Container } from "typedi";

import { Request, Response } from "express";

import { APIResponse } from "../utils/types";
import { AuthServiceI } from "../services/auth-service";
import { Logger } from "winston";

function AuthController() {
  const AuthService: AuthServiceI = Container.get("AuthService");
  const logger: Logger = Container.get("Logger");

  return {
    async register(req: Request, res: Response) {
      try {
        logger.info("AuthController:register:: Starting response cycle");

        const { email, password, first_name } = req.body;
        const { user, token } = await AuthService.register(email, password, first_name);

        //@ts-ignore
        req.session.token = token;

        logger.info("AuthController:register:: Success");
        return res.status(200).json({ message: "success", data: user });
      } catch (e) {
        logger.info(`AuthController:register:: ${e}`);
        await req.session.destroy;
        return res.status(401).json({ error: `${e}` });
      }
    },

    async login(req: Request, res: Response) {
      try {
        logger.info("AuthController:login:: Starting response cycle");

        const { email, password } = req.body;
        const user = await AuthService.login(email, password);
        const token = await AuthService.generateToken(user.id);

        //@ts-ignore
        req.session.token = token;

        logger.info("AuthController:login:: Success");
        return res.status(200).json({ message: "success", data: user });
      } catch (e) {
        logger.info(`AuthController:login:: ${e}`);
        await req.session.destroy;
        return res.status(401).json({ error: `${e}` });
      }
    },

    async logout(req: Request, res: Response) {
      try {
        logger.info("AuthController:logout:: Starting response cycle");

        if (req.session) {
          await req.session.destroy((err) => {
            if (err) {
              throw new Error("AuthController:logout:: Unable to log out");
            } else {
              return res.send("Logout successful");
            }
          });
        } else {
          return res.end();
        }
      } catch (e) {
        logger.info(`AuthController:logout::error:: ${e}`);
        return res.status(400).json({ error: `${e}` });
      }
    },
  };
}

const _AuthControllerIns = AuthController();

export default _AuthControllerIns;

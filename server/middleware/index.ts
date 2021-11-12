import { Container } from "typedi";
import { Logger } from "winston";
import { APIUnauthorizedError } from "../controllers/errorTypes";
import { AuthServiceI } from "../services/auth-service";

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.token) {
    return next();
  } else {
    throw new APIUnauthorizedError();
  }
};

const isInternalAuthenticated = (req, res, next) => {
  if (req.session && req.session.token) {
    const AuthService: AuthServiceI = Container.get("AuthService");
    const isInternalUser = AuthService.isInternalUser(req.session.token);

    if (isInternalUser) next();
    else throw new APIUnauthorizedError();
  } else {
    throw new APIUnauthorizedError();
  }
};

export default {
  isAuthenticated,
  isInternalAuthenticated,
};

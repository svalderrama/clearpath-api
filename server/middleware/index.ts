import { Container } from "typedi";
import { Logger } from "winston";
import { APIUnauthorizedError } from "../controllers/errorTypes";
import { AuthServiceI } from "../services/auth-service";

const isAuthRequest = (req, res, next) => {
  const AuthService: AuthServiceI = Container.get("AuthService");
  const isAuth = AuthService.isAuthenticated(req);

  if (isAuth) {
    return next();
  } else {
    throw new APIUnauthorizedError();
  }
};

const isInternalAuthRequest = (req, res, next) => {
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
  isAuthRequest,
  isInternalAuthRequest,
};

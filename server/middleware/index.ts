import { Container } from "typedi";
import { Logger } from "winston";

import { APIUnauthorizedError } from "../controllers/errorTypes";

const isAuthenticated = (req, res, next) => {
  console.log("isAuthenticated", { id: req.session.id, ...req.session });
  if (req.session && req.session.token) {
    return next();
  } else {
    throw new APIUnauthorizedError();
  }
};

export default {
  isAuthenticated,
};

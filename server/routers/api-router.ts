import express from "express";

import validators from "./validators";
import mw from "../middleware";

import OrgsController from "../controllers/org-controller";
import AuthController from "../controllers/auth-controller";
import UserController from "../controllers/user-controller";
import ApplicationController from "../controllers/application-controller";
import AuthService from "../services/auth-service";

const apiRouter = express.Router();

//Auth Routes
apiRouter.post("/auth/register", validators.validateRegisterPost, AuthController.register);
apiRouter.get("/auth/refresh", mw.isAuthRequest, AuthController.refresh);

apiRouter.post("/auth/login", validators.validateLoginPost, AuthController.login);
apiRouter.delete("/auth/logout", AuthController.logout);

//User Routes
apiRouter.get("/user/:userId", mw.isAuthRequest, UserController.showOne);
apiRouter.put(
  "/user/:userId",
  mw.isAuthRequest,
  validators.validateUserDetailsPut,
  (req, res, next) => {
    const transformedBody = {
      race: req.body.race,
      sexuality: req.body.sexuality,
      gender: req.body.gender,
      dob: req.body.dob,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      priorAcademics: {
        level: req.body.level,
        school: req.body.school,
        department: req.body.department,
        specialization: req.body.specialization,
        year_of_grad: req.body.yearOfGrad,
      },
    };

    req.body = transformedBody;
    next();
  },
  UserController.update,
);
apiRouter.get("/user/:userId/applications", mw.isAuthRequest, ApplicationController.showAll);

//Organization Routes
apiRouter.get("/orgs", mw.isAuthRequest, OrgsController.index);
apiRouter.get("/orgs/:id", mw.isAuthRequest, OrgsController.showOne);
apiRouter.get("/orgs/type/:orgType", mw.isAuthRequest, OrgsController.showByOrgType);

//Application Routes
apiRouter.post("/application/submit", mw.isAuthRequest, ApplicationController.submit);

//Specialties Routes

//Internal Routes
apiRouter.post("/orgs/_seed", OrgsController.createSeedData);

export default apiRouter;

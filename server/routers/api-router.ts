import express from "express";

import validators from "./validators";
import mw from "../middleware";

import OrgsController from "../controllers/org-controller";
import AuthController from "../controllers/auth-controller";
import UserController from "../controllers/user-controller";
import ApplicationController from "../controllers/application-controller";

const apiRouter = express.Router();

//Auth Routes
apiRouter.post("/auth/register", validators.validateRegisterPost, AuthController.register);
apiRouter.post("/auth/login", validators.validateLoginPost, AuthController.login);
apiRouter.post("/auth/logout", AuthController.logout);

//User Routes
apiRouter.put("/user", mw.isAuthenticated, validators.validateUserDetailsPut, UserController.update);
apiRouter.get("/user/:userId/applications", mw.isAuthenticated, ApplicationController.showAll);

//Organization Routes
apiRouter.get("/orgs", mw.isAuthenticated, OrgsController.index);
apiRouter.get("/orgs/:id", mw.isAuthenticated, OrgsController.showOne);
apiRouter.get("/orgs/type/:orgType", mw.isAuthenticated, OrgsController.showByOrgType);

//Application Routes
apiRouter.post("/application/submit", mw.isAuthenticated, ApplicationController.submit);

//Specialties Routes

//Internal Routes
apiRouter.post("/orgs/_seed", mw.isInternalAuthenticated, OrgsController.createSeedData);

export default apiRouter;

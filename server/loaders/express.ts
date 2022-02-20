import cors from "cors";
import { Container } from "typedi";

import express from "express";
import session from "express-session";

import winston, { Logger } from "winston";
import expressWinston from "express-winston";
import { errors as JoiErrors } from "celebrate";

import uidSafe from "uid-safe";

import helmet from "helmet";

import type { Request, Response, Express } from "express";

import { APIError, SESSION_DB_NAME } from "../utils/constants";
import { SESSION_MAX_AGE } from "../config";
import apiRouter from "../routers/api-router";

import { Firestore } from "@google-cloud/firestore";
import { FirestoreStore } from "@google-cloud/connect-firestore";

import firebaseLoader from "../loaders/firebase-admin/connect";
import cookieParser from "cookie-parser";
import useragent from "express-useragent";

const db = firebaseLoader.firestore();

/* Need to extend session object for our needs*/
declare module "express-session" {
  interface SessionData {
    user?: string;
  }
}

const buildServer = (server: Express) => {
  /**********  Apply Base Middlewares **********/
  const applyMiddleWares = (server: Express) => {
    const logger: Logger = Container.get("Logger");
    /** CORS middleware */
    server.use(
      cors({
        origin: [
          "http://localhost:3000",
          "https://dev-clearpath.web.app",
          "https://clearpathnyc.com",
          "https://clearpathnyc.org",
        ],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
      }),
    );

    /** Helmet middleware */
    server.use(helmet());

    /* Useful since we are behind  a reverse proxy (Heroku)
     * It shows the real origin IP in the heroku logs
     */
    server.enable("trust proxy");

    /* Serve static files */
    // server.use(express.static(assetsDir));

    server.use(cookieParser(Container.get("SESSION_SECRET_KEY")));

    server.use(express.urlencoded({ extended: true }));

    /** JSON middleware */
    server.use(express.json());

    server.use(useragent.express());

    /** Sessions middleware -- (Currently depends on Firebase DB) */
    server.use(
      session({
        store: new FirestoreStore({
          dataset: new Firestore({
            projectId: db.config.projectId,
            credentials: { client_email: db.config.clientEmail, private_key: db.config.privateKey },
          }),
          kind: SESSION_DB_NAME,
        }),
        genid: (req) => {
          return uidSafe.sync(18);
        },
        name: "__session",
        secret: Container.get("SESSION_SECRET_KEY"),
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: SESSION_MAX_AGE },
      }),
    );

    /** Winston logging on request */
    server.use(
      expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(winston.format.colorize(), winston.format.json()),
        meta: true, // optional: control whether you want to log the meta data about the request (default to true)
        msg: "HTTP \n {{req.method}} \n {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
        expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
        colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
        // ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
      }),
    );
  };

  /********** Register routers ********/
  const attachAPIRouters = (server: Express) => {
    server.use("/api/v1", apiRouter);
  };

  /********** Healthcheck **********/
  const attachHealthCheckRoutes = (server: Express) => {
    server.get("/status", (req: Request, res: Response) => {
      res.status(200).send("You have reached the API!");
    });

    server.head("/status", (req, res) => {
      res.status(200).end();
    });
  };

  /********** Catch 404 and forward to error handler **********/
  const attachErrorHandlers = (server: Express) => {
    const logger: Logger = Container.get("Logger");

    /* Allow winston to log errors */
    server.use(
      expressWinston.errorLogger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(winston.format.colorize(), winston.format.json()),
      }),
    );

    /* Joi validation error handling*/
    server.use(JoiErrors());

    server.use("*", (req, res, next) => {
      logger.error("APIErrorHandler::Bad Request");
      return res.status(404).json({
        message: "Not Found",
      });
    });

    // /********** Base error handler **********/
    server.use((err: APIError, req: Request, res: Response, next: any) => {
      logger.error(`APIErrorHandler::${err.name || "Unknown"}::${err.status || "500"}`);

      res.status(err.status || 500);
      res.json({
        errors: {
          message: err.message,
        },
      });
    });

    // server.use("*", (req, res, next) => {
    //   logger.error("APIErrorHandler::Bad Request");
    //   return res.status(404).json({
    //     message: "Not Found",
    //   });
    // });
  };

  /********* Build Server *********/
  applyMiddleWares(server);
  attachAPIRouters(server);
  attachHealthCheckRoutes(server);
  attachErrorHandlers(server);

  return server;
};

export default buildServer;

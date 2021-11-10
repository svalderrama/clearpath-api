import type { Express } from "express";
import * as Services from "../services";

/** Loaders */
import firebaseLoader from "./firebase-admin/connect";
import loadDIContainer from "./dependency-injection";
import { Container } from "typedi";
import Logger from "./logger";

export default async (expressApp: Express) => {
  const _ = await firebaseLoader.admin();
  Logger.info("Loaders: 💼 FirebaseAdmin loaded!");

  const db = await firebaseLoader.firestore();
  Logger.info("Loaders: 🕋 FirebaseFirestore loaded!");
  Logger.info(`Loaders: FirebaseFirestore env: ${db.config.projectId}`);

  const container = await loadDIContainer();
  Logger.info("Loaders: DI container has finished loading!");

  await Services;
  Logger.info("Loaders: Services Registered!");

  /** We need to make sure container's have been injected,
   * and services have been registered before we build
   * express server...or else, this will bork
   * */
  const server = await require("./express").default(expressApp);
  Logger.info("🚄 Express loaded");

  return server;
};

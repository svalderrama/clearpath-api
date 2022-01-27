import "reflect-metadata"; //enable decorators

import express from "express";
import { API_PORT } from "./config";
import logger from "./loaders/logger";

async function startServer() {
  const expressApp = express();

  /** Start our loaders **/
  const server = await require("./loaders").default(expressApp);

  server
    .listen(API_PORT, () => {
      logger.info(`🛡️ Woooo! Server 🔥 🥵 🔥 on port: ${API_PORT} 🛡️`);
    })
    .on("error", (err: any) => {
      logger.error(err);
      process.exit(1);
    });
}

startServer();

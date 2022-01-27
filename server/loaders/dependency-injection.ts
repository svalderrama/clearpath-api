import dotenv from "dotenv";

import { Container } from "typedi";
import { JWKS_SIGNATURE, SESSION_SECRET_KEY, MAILGUN_API_KEY, MAILGUN_DOMAIN } from "../config";
import Logger from "./logger";

const loadDIContainer = () => {
  try {
    /** Inject Winston logger */
    Container.set("Logger", Logger);
    Logger.info("📝 DI: Winston Logger injected into container");

    /** Inject JWKS JWT_PRIVATE_KEY */
    Container.set("JWT_PRIVATE_KEY", JWKS_SIGNATURE);
    Logger.info("🔑 DI: JWT private key injected into container");

    /** Inject SESSION SECRET KEY */
    Container.set("SESSION_SECRET_KEY", SESSION_SECRET_KEY);
    Logger.info("👻🔑 DI: Session secret key injected into container");

    /** Inject Mailgun API KEY */
    Container.set("MAILGUN_API_KEY", MAILGUN_API_KEY);
    Logger.info("✉️ 🔑 DI: Mailgun API key injected into container");

    /** Inject Mailgun Domain KEY */
    Container.set("MAILGUN_DOMAIN", MAILGUN_DOMAIN);
    Logger.info("✉️ 🏠 DI: Mailgun domain injected into container");
  } catch (e) {
    Logger.error("🔥 dependencyInjection Error: Failed to set Logger!!: %o", e);
    throw e;
  }

  return Container;
};

export default loadDIContainer;

import dotenv from "dotenv";
import path from "path";

try {
  let env = undefined;

  process.env.NODE_ENV! === "production"
    ? (env = dotenv.config({ path: `.env.production` }))
    : (env = dotenv.config({ path: `.env.development` }));

  if (env.error) throw new Error(env.error);
} catch (e) {
  throw new Error(`⚠️  Couldn't find .env file : ${e}`);
}

const calculateSessionMaxAge = () => {
  const numWeeks = 4;
  const now = new Date();

  /* Roughly 4 weeks */
  const expiryDate = now.setDate(now.getDate() + numWeeks * 7);

  return expiryDate;
};

export const API_PORT = Number(process.env.API_PORT || 8081);
export const DATABASE_URL = process.env.FIREBASE_FIRESTORE_URL;

export const DEV_ENV = process.env.NODE_ENV === "development";
export const PROD_ENV = process.env.NODE_ENV === "production";

export const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
export const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
export const MAILGUN_PUBLIC_KEY = process.env.MAILGUN_PUBLIC_KEY;

export const JWKS_SIGNATURE = process.env.JWKS_SIGNATURE;
export const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY;

export const SESSION_MAX_AGE = calculateSessionMaxAge();

/** Used by winston logger */
export const LOGGER_CONFIG = { level: process.env.LOG_LEVEL || "silly" };

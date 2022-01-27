import path from "path";

export const buildDir = path.join(process.cwd() + "/build");
export const publicDir = path.join(process.cwd() + "/public");
export const assetsDir = path.join(process.cwd() + "/src/assets");

const PROFESSIONAL_SERVICES = "professional_services";
const MENTAL_WELLNESS = "mental_wellness";
const ACADEMIC_DEVELOPMENT = "academic_development";
const SHELTER = "shelter";

export const SESSION_DB_NAME = "auth-sessions";

//TODO: Move to types
export enum ORG_TYPE {
  PROFESSIONAL_SERVICES,
  MENTAL_WELLNESS,
  ACADEMIC_DEVELOPMENT,
  SHELTER,
}

export interface ORG_TYPES {
  [PROFESSIONAL_SERVICES]: typeof PROFESSIONAL_SERVICES;
  [MENTAL_WELLNESS]: typeof MENTAL_WELLNESS;
  [ACADEMIC_DEVELOPMENT]: typeof ACADEMIC_DEVELOPMENT;
  [SHELTER]: typeof SHELTER;
}

export interface APIError extends Error {
  status?: number;
}

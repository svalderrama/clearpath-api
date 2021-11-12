import { Container } from "typedi";
import { Logger } from "winston";
import { OrgServiceI } from "../services/org-service";
import { CLEARPATH_DB_SEED } from "../models/seed/";

function OrgsController() {
  const OrgService: OrgServiceI = Container.get("OrgService");
  const logger: Logger = Container.get("Logger");

  return {
    async index(req, res, next: (err: any) => void) {
      /* Get all Organizations */
      try {
        logger.info("OrgsController:index:: Starting response cycle");

        const orgs = await OrgService.getAll();

        return res.status(200).json({
          message: "ok",
          count: orgs.length,
          data: orgs,
        });
      } catch (err) {
        logger.error(err);
        next(err);
      }
    },

    async showOne(req, res, next: (err: any) => void) {
      /* Get one Organization by ID */
      try {
        logger.info("OrgsController:showOne:: Starting response cycle");

        const { id } = req.params;
        const org = await OrgService.getById(id);

        return res.status(200).json({
          message: "ok",
          data: org,
        });
      } catch (err) {
        logger.error(err);
        next(err);
      }
    },

    async showByOrgType(req, res, next: (err: any) => void) {
      try {
        logger.info("OrgsController:showByOrgType:: Starting response cycle");

        const { orgType } = req.params;
        const convertedType = orgType.replace("-", "_");

        const orgs = await OrgService.getByOrgType(convertedType);

        return res.status(200).json({
          message: "ok",
          count: orgs.length,
          data: orgs,
        });
      } catch (err) {
        logger.error(err);
        next(err);
      }
    },

    async createSeedData(req, res, next: (err: any) => void) {
      try {
        logger.info("OrgsController:createSeedData:: Starting response cycle");

        //check count of DB before seeding!!
        const dbEntries = await OrgService.getAll();
        const isDBPopulated = dbEntries.length;

        if (isDBPopulated) {
          throw new Error("OrgsController:createSeedData:: Could not seed DB!! Entries already exists for org model");
        }

        const orgs = await OrgService.pushSeed(CLEARPATH_DB_SEED);

        return res.status(200).json({
          message: "ok",
          count: orgs.length,
          data: orgs,
        });
      } catch (err) {
        logger.error(err);
        next(err);
      }
    },
  };
}

/** Instantiate */
const OrgsControllerIns = OrgsController();

export default OrgsControllerIns;

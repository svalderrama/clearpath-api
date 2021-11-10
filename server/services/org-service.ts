import { Service } from "typedi";

import Org from "../models/organization";
import type { QuerySetMany, QuerySet, DBRecord, Organization } from "../utils/types";

export interface OrgServiceI {
  getAll();
  getById(id: string);
  getByOrgType(orgType: string);
}

@Service("OrgService")
class OrgService {
  public async getAll() {
    return await Org.getAllDocs()
      .then((orgs: DBRecord<Organization>[]) => orgs)
      .catch((err) => {
        throw Error(err);
      });
  }

  public async getById(id: string) {
    return await Org.getDocById(id)
      .then((org: DBRecord<Organization>) => org)
      .catch((err) => {
        throw Error(err);
      });
  }

  public async getByOrgType(orgType: string) {
    return await Org.getByOrgType(orgType)
      .then((orgs: DBRecord<Organization>[]) => orgs)
      .catch((err) => {
        throw Error(err);
      });
  }
}

export default OrgService;

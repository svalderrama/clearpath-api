import { Service } from "typedi";

import Application from "../models/application";
import type { QuerySet, DBRecord, ApplicationI } from "../utils/types";

interface ApplicationService {
  create(userId, orgId, orgName, message);
  getById(id: string);
  getUserApplications(userId: string);
  hasPendingApp(userId: string, orgId: string);
}

@Service("ApplicationService")
class ApplicationService implements ApplicationService {
  private _aggregateAppStatus(apps) {
    const result = {
      pending: 0,
      declined: 0,
      completed: 0,
      submitted: 0,
    };

    apps.forEach((app) => {
      const status = app["status"];
      result[status]++;
    });

    return result;
  }

  public async create(userId, orgId, orgName, message) {
    return await Application.create(userId, orgId, orgName, message)
      .then((app: ApplicationI) => app)
      .catch((err) => {
        throw Error(err);
      });
  }

  public async getById(id: string) {
    return await Application.getDocById(id)
      .then((org: DBRecord<ApplicationI>) => org)
      .catch((err) => {
        throw Error(err);
      });
  }

  public async getUserApplications(userId: string) {
    return await Application.getAllByUserId(userId)
      .then((userApps: DBRecord<ApplicationI>[]) => userApps)
      .then((userApps) => {
        return {
          applications: userApps,
          stats: this._aggregateAppStatus(userApps),
        };
      })
      .catch((err) => {
        throw Error(err);
      });
  }

  public async hasPendingApp(userId: string, orgId: string) {
    return await Application.filter(userId, orgId)
      .then((apps: DBRecord<ApplicationI>[]) => {
        const hasPendingApp = apps.length > 0;
        return !!hasPendingApp;
      })
      .catch((err) => {
        throw Error(err);
      });
  }
}

export default ApplicationService;

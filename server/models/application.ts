import { DBAdapter } from "./common";
import { DBRecord, QuerySetMany } from "../utils/types";

class ApplicationDBAdapter extends DBAdapter {
  constructor() {
    super("application");
  }

  async create(user_id: string, org_id: string, org_name: string, message: string) {
    try {
      //TODO: create enum for status'
      return await this.model
        .add({
          user_id,
          org_id,
          org_name,
          message: message || null,
          status: "submitted",
        })
        .then(async (queryResult: DBRecord<any>) => {
          //TODO: Re-factor to common
          //Firebase returns a queryset. We must then call methods on it to get the actual data
          const data = await queryResult.get().then((res) => {
            return res.data();
          });

          return {
            /* ID come from Auto-generated id Firebase gives us*/
            id: queryResult.id,
            ...data,
          };
        });
    } catch (err) {
      throw new Error(`Application::DBAdapter::create:: ${err}`);
    }
  }

  async getAllByUserId(user_id: string) {
    try {
      return await this.getAllByKeyValue("user_id", user_id);
    } catch (err) {
      throw new Error(`Application::DBAdapter::filter:: ${err}`);
    }
  }

  async filter(user_id: string, org_id: string) {
    try {
      return await this.model
        .where("user_id", "==", user_id)
        .where("org_id", "==", org_id)
        .get()
        .then((queryResult: QuerySetMany<any>) => {
          //Default result:
          const records: DBRecord<any>[] = [];

          if (queryResult && queryResult.docs && queryResult.docs.length) {
            queryResult.docs.forEach((doc) => {
              const rawData = doc.data();
              records.push({ id: doc.id, ...rawData });
            });
          }

          return records;
        });
    } catch (err) {
      throw new Error(`Application::DBAdapter::filter:: ${err}`);
    }
  }
}

const Application = new ApplicationDBAdapter();

export default Application;

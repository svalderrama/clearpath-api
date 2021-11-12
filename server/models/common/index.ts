import loadFirbaseAdmin from "../../loaders/firebase-admin/connect";
import { ModelReference, QuerySetMany, DBRecord } from "../../utils/types";
import { FieldPath } from "@google-cloud/firestore";
interface FirebaseFirestoreAdapter {
  getDocById: (id: string) => Promise<any>;
  getAllDocs: () => Promise<any>;
  getOneByKeyValue: (key: string, value: string) => Promise<any>;
  getAllByKeyValue: (key: string, value: string) => Promise<any>;
}

/* Base DBAdpater:
 * All standard app models should inherit from the BaseDBAdapter
 */
export class DBAdapter implements FirebaseFirestoreAdapter {
  protected model: ModelReference;

  //TODO: Make modelName an enum (helps to keep all tables in one place)
  constructor(modelName: string) {
    const db = loadFirbaseAdmin.firestore();
    this.model = db.collection(modelName);
  }

  /* Fix type */
  async seedModel(data: any) {
    const _addEntry = async (entry: any) => {
      const queryResult = await this.model.add({ ...entry });
      const transformedResp = await queryResult.get().then((res) => res.data());

      return {
        id: queryResult.id,
        ...transformedResp,
      };
    };

    if (Array.isArray(data)) {
      const results = [];
      data.forEach((datum) => {
        const entry = _addEntry(datum);
        results.push(entry);
      });
      return results;
    } else {
      return _addEntry(data);
    }
  }

  async getDocById(id: string) {
    return await this.model
      .where("__name__", "==", id)
      .get()
      .then((queryResult: QuerySetMany<any>) => {
        //Default result:
        if (!queryResult.size) return null;

        const rawData = queryResult.docs[0].data();
        const result = { id: queryResult.docs[0].id, ...rawData };
        return result;
      });
  }

  async getAllDocs() {
    return await this.model.get().then((queryResult) => {
      if (!queryResult.size) return [];

      const records: DBRecord<any>[] = [];

      if (queryResult && queryResult.docs && queryResult.docs.length) {
        queryResult.docs.forEach((doc) => {
          const rawData = doc.data();
          records.push({ id: doc.id, ...rawData });
        });
      }

      return records;
    });
  }

  async getOneByKeyValue(key: string, value: string) {
    return await this.model
      .where(key, "==", value)
      .get()
      .then((queryResult: QuerySetMany<any>) => {
        //Default result:
        if (!queryResult.size) return null;

        const rawData = queryResult.docs[0].data();
        return { id: queryResult.docs[0].id, ...rawData };
      });
  }

  async getAllByKeyValue(key: string, value: string) {
    return await this.model
      .where(key, "==", value)
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
  }
}

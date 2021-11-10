import loadFirbaseAdmin from "../../loaders/firebase-admin/connect";
import { ModelReference, QuerySetMany, DBRecord } from "../../utils/types";

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

  async getDocById(id: string) {
    return await this.model
      .doc(id)
      .get()
      .then((res) => ({ id, ...res.data() }));
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

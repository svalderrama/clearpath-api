import admin from "firebase-admin";
import { DATABASE_URL } from "../../config";
import path from "path";

const loadServiceAccountJson = () => {
  const env = process.env.NODE_ENV;
  let gcpJSON;

  if (env === "production") {
    gcpJSON = require(path.relative(__dirname, "gcpServiceAccount.prod.json"));
  } else {
    gcpJSON = require(path.relative(__dirname, "gcpServiceAccount.dev.json"));
  }

  return gcpJSON;
};

const loadFirebaseAdmin = (() => {
  let instance: any = false;
  let firestore: any = false;

  const initAdmin = () => {
    /** Load Admin */
    admin.initializeApp({
      credential: admin.credential.cert(loadServiceAccountJson()),
      databaseURL: DATABASE_URL,
    });

    return admin;
  };

  const initFirestore = () => {
    if (!instance) instance = initAdmin();
    const db = instance.firestore();
    const gcpJSON = loadServiceAccountJson();

    /* Need to looad these for express to use in sessions*/
    db.config = {
      projectId: gcpJSON.project_id,
      clientEmail: gcpJSON.client_email,
      privateKey: gcpJSON.private_key,
    };

    return db;
  };

  return {
    admin: () => {
      if (!instance) instance = initAdmin();
      return instance;
    },

    firestore: () => {
      if (!firestore) firestore = initFirestore();
      return firestore;
    },
  };
})();

export default loadFirebaseAdmin;

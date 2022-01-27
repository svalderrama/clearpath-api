import FirebaseFirestore from "@firebase/firestore-types";

/* **ORM TYPES**
 * Types that extend the standard Firebase interfaces,
 * essentially just renaming for simplicity 🤫
 */
export interface QuerySetMany<T> extends FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> {}
export interface QuerySet<T> extends FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> {}
export interface ModelReference extends FirebaseFirestore.CollectionReference {}
export interface DBRecord<T> extends FirebaseFirestore.DocumentData {}

/* **Model TYPES** */
export interface Organization {
  address: string;
  age_lower: number;
  age_upper: number;
  borough: string;
  contact_number: string;
  description: string;
  email: string;
  name: string;
  org_type: string;
  requirements: string;
  specialty: string;
  url: string;
}

export interface UserDetails {
  id: string;
  email: string;
  race: string;
  sexuality: string;
  gender: string;
  dob: string;
  first_name: string;
  last_name: string;
  prior_academics: {
    level: string;
    school: string;
    department: string;
    specialization: string;
    year_of_grad: string;
  };
}

export interface ApplicationI {
  id: string;
  org_id: string;
  user_id: string;
  message?: string;
  status: string;
}

/* **MISC TYPES** */
export interface APIResponse {
  message: string;
  count?: number;
  data?: any[];
}

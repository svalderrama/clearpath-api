import { DBAdapter } from "./common";

class UserDBAdapter extends DBAdapter {
  constructor() {
    super("user");
  }

  async create(email: string, hashedPassword: string, firstName: string) {
    try {
      const queryResult = await this.model.add({
        email,
        password: hashedPassword,
        first_name: firstName,
      });
      //TODO: Re-factor to common
      //Firebase returns a queryset. We must then call methods on it to get the actual data
      const transformedResp = await queryResult.get().then((res) => res.data());

      return {
        /* ID come from Auto-generated id Firebase gives us*/
        firstName: transformedResp.first_name,
        email: transformedResp.email,
        id: queryResult.id,
      };
    } catch (err) {
      throw new Error(`User::DBAdapter::create:: ${err}`);
    }
  }

  async getByEmail(email: string) {
    try {
      return await this.getOneByKeyValue("email", email);
    } catch (err) {
      throw new Error(`User::DBAdapter::getByEmail:: ${err}`);
    }
  }

  async update(id: string, userDetails: object) {
    try {
      //TODO: Firebase is weird. We have to update and make a separate query to get
      const _ = await this.model.doc(id).update(userDetails);
      return await this.getDocById(id);
    } catch (err) {
      throw new Error(`User::DBAdapter::update:: ${err}`);
    }
  }
}

const User = new UserDBAdapter();

export default User;

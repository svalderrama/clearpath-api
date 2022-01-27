import { DBAdapter } from "./common";
import { Organization } from "../utils/types";

class OrganizationDBAdapter extends DBAdapter {
  constructor() {
    super("organization");
  }

  async getByOrgType(orgType: string) {
    try {
      return await this.getAllByKeyValue("org_type", orgType);
    } catch (err) {
      throw new Error(`Organization::DBAdapter::getByOrgType:: ${err}`);
    }
  }
}

// Create a reference to the Organizations collections
const Organization = new OrganizationDBAdapter();

export default Organization;

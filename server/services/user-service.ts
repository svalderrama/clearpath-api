import { Service, Inject } from "typedi";

import User from "../models/user";
import type { DBRecord, UserDetails } from "../utils/types";

export interface UserServiceI {
  /** TODO:
   * anonLogin()
   * fix types below!
   */
  getByEmail(email: string): any;
  getById(id: string): any;
  createWithEmailAndPassword(email: string, hashedPassword: string, rest);
  updateDetails(id: string, userDetails: object);
}

@Service("UserService")
class UserService implements UserServiceI {
  constructor(@Inject("Logger") private logger) {
    this.logger = logger;
  }

  public async getByEmail(email: string) {
    return await User.getByEmail(email)
      .then((user: DBRecord<UserDetails>) => user)
      .catch((err) => {
        throw Error(err);
      });
  }

  public async getById(id: string) {
    return await User.getDocById(id)
      .then((user: DBRecord<UserDetails>) => user)
      .catch((err) => {
        throw Error(err);
      });
  }

  public async createWithEmailAndPassword(email: string, hashedPassword: string, firstName: string) {
    return await User.create(email, hashedPassword, firstName)
      .then((user: DBRecord<UserDetails>) => user)
      .catch((err) => {
        throw Error(err);
      });
  }

  public async updateDetails(id: string, userDetails: object) {
    return await User.update(id, userDetails)
      .then((user: DBRecord<UserDetails>) => {
        //Need to remove hashed password
        delete user.password;
        return user;
      })
      .catch((err) => {
        throw Error(err);
      });
  }
}

export default UserService;

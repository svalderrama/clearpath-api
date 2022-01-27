import { APIError } from "../utils/constants";

class APIUnauthorizedError implements APIError {
  name = "APIUnauthorizedError";
  status = 401;
  message = "User is not authorized to view this resource!";
  stack = new Error(this.message).stack;
}

export { APIUnauthorizedError };

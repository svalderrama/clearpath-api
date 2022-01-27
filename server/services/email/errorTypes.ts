/* MailGun Error Types */

class MailgunUnauthorizedError extends Error {
  constructor() {
    super();
    this.name = "Mailgun:Unauthorized";
    this.message = "No valid API key provided";
  }
}

export { MailgunUnauthorizedError };
// 400	Bad Request - Often missing a required parameter
// 401	Unauthorized - No valid API key provided
// 402	Request Failed - Parameters were valid but request failed
// 404	Not Found - The requested item doesn’t exist
// 413	Request Entity Too Large - Attachment size is too big
// 429	Too many requests - An API request limit has been reached
// 500, 502, 503, 504	Server Errors - something is wrong on Mailgun’s end

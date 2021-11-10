// function InvalidValueError(value, type) {
//   this.message = "Expected `" + type.name + "`: " + value;
//   var error = new Error(this.message);
//   this.stack = error.stack;
// }ds
// InvalidValueError.prototype = new Error();
// InvalidValueError.prototype.name = InvalidValueError.name;
// InvalidValueError.prototype.constructor = InvalidValueError;

// function MyError(message) {
//   this.name = 'MyError';
//   this.message = message;
//   this.stack = (new Error()).stack;
// }

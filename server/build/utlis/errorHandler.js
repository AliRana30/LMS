"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandler extends Error {
    constructor(message, statuscode) {
        super(message);
        this.message = message;
        this.statuscode = statuscode;
        this.statuscode = statuscode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = ErrorHandler;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const apiError_1 = require("../utils/apiError");
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    if (err instanceof apiError_1.ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else {
        // Handling standard Node errors
        message = err.message || message;
    }
    const response = {
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.js.map
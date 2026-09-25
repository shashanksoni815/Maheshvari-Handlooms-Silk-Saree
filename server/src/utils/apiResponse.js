"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    success;
    message;
    data;
    constructor(message, data) {
        this.success = true;
        this.message = message;
        if (data !== undefined) {
            this.data = data;
        }
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=apiResponse.js.map
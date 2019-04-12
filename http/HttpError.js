"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpError = /** @class */ (function () {
    function HttpError(message, code) {
        if (code === void 0) { code = HttpStatusCode.InternalServerError; }
        this.code = code;
        this.messsage = message;
    }
    return HttpError;
}());
exports.HttpError = HttpError;
var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
    HttpStatusCode[HttpStatusCode["Created"] = 201] = "Created";
    HttpStatusCode[HttpStatusCode["InternalServerError"] = 500] = "InternalServerError";
    HttpStatusCode[HttpStatusCode["BadRequest"] = 400] = "BadRequest";
    HttpStatusCode[HttpStatusCode["Conflict"] = 409] = "Conflict";
    HttpStatusCode[HttpStatusCode["Forbidden"] = 403] = "Forbidden";
    HttpStatusCode[HttpStatusCode["NotFound"] = 404] = "NotFound";
    HttpStatusCode[HttpStatusCode["Unauthorized"] = 401] = "Unauthorized";
})(HttpStatusCode = exports.HttpStatusCode || (exports.HttpStatusCode = {}));

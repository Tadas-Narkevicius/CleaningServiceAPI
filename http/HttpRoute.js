"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpRoute = /** @class */ (function () {
    function HttpRoute(path, express) {
        this.path = path;
        this.setup(express);
    }
    return HttpRoute;
}());
exports.HttpRoute = HttpRoute;

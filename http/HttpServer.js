"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var AdvertRoute_1 = require("../http/AdvertRoute");
var RegisterRoute_1 = require("../http/RegisterRoute");
var LoginRoute_1 = require("../http/LoginRoute");
var HttpServer = /** @class */ (function () {
    function HttpServer(port) {
        this.express = express();
        var bodyParser = require('body-parser');
        this.express.use(bodyParser.json());
        var cors = require('cors');
        this.express.use(cors());
        this.setupRoutes();
        this.express.listen(port, function () {
            console.log("Server is running on port " + port);
        });
    }
    HttpServer.prototype.setupRoutes = function () {
        new RegisterRoute_1.RegisterRoute('/register', this.express);
        new LoginRoute_1.LoginRoute('/login', this.express);
        new AdvertRoute_1.AdvertRoute('/advert', this.express);
    };
    return HttpServer;
}());
exports.HttpServer = HttpServer;

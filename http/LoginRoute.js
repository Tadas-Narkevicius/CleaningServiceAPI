"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HttpRoute_1 = require("./HttpRoute");
var user_1 = require("../models/user");
var Utility_1 = require("../models/Utility");
var HttpError_1 = require("./HttpError");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jsonwebtoken");
var LoginRoute = /** @class */ (function (_super) {
    __extends(LoginRoute, _super);
    function LoginRoute() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoginRoute.prototype.setup = function (express) {
        express.post("" + this.path, this.loginUser.bind(this));
    };
    // Validacija
    LoginRoute.prototype.loginUser = function (request, response) {
        if (!Utility_1.Utility.ValidateEmail(request.body.email)) {
            response.status(HttpError_1.HttpStatusCode.BadRequest);
            response.send(new HttpError_1.HttpError('Invalid email', HttpError_1.HttpStatusCode.BadRequest));
            return;
        }
        if (!request.body.password || request.body.password.length < 4) {
            response.status(HttpError_1.HttpStatusCode.BadRequest);
            response.send(new HttpError_1.HttpError('Bad password format', HttpError_1.HttpStatusCode.BadRequest));
            return;
        }
        user_1.User.GetUserByEmail(request.body.email)
            .then(function (users) {
            if (users.length === 0) {
                response.status(HttpError_1.HttpStatusCode.NotFound);
                response.send(new HttpError_1.HttpError('User not found', HttpError_1.HttpStatusCode.NotFound));
            }
            else {
                var user_2 = users[0];
                console.log(user_2);
                bcrypt.compare(request.body.password, user_2.password, function (err, success) {
                    if (success) {
                        // User logged in
                        var tokenPayload = {
                            userId: user_2.id
                        };
                        // Sukuriama User Token.
                        user_2.token = jwt.sign(tokenPayload, Utility_1.Utility.JWTKey);
                        // delete user.password;
                        response.send(user_2);
                    }
                    else {
                        response.status(HttpError_1.HttpStatusCode.Unauthorized);
                        response.send(new HttpError_1.HttpError('Invalid details', HttpError_1.HttpStatusCode.Unauthorized));
                    }
                });
                // Checking user's password
                // bcrypt.compare(request.body.password, user.password).then((success: boolean) => {
                //     if (success) {
                //         // User logged in
                //         let tokenPayload = {
                //             userId: user.id
                //         };
                //         // Sukuriama User Token.
                //         user.token = jwt.sign(tokenPayload, Utility.JWTKey);
                //         // delete user.password;
                //         response.send(user);
                //     } else {
                //         response.status(HttpStatusCode.Unauthorized);
                //         response.send(new HttpError('Invalid details', HttpStatusCode.Unauthorized));
                //     }
                // });
            }
        })
            .catch(function (error) {
            response.status(error.code);
            response.send(error);
        });
    };
    return LoginRoute;
}(HttpRoute_1.HttpRoute));
exports.LoginRoute = LoginRoute;

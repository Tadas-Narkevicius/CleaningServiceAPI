"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var Utility = /** @class */ (function () {
    function Utility() {
    }
    Utility.ValidateEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
    Utility.ValidateName = function (username) {
        var re = /^[a-zA-Z]+$/;
        return re.test(String(username).toLowerCase());
    };
    // Advert validation.
    Utility.ValidatePrice = function (price) {
        var re = /^[0-9]*$/;
        return re.test(price.toString());
    };
    Utility.ValidateTitle = function (title) {
        var re = /^(?:[^"\'{};])+?$/;
        return re.test(String(title).toLowerCase());
    };
    Utility.ValidateAddress = function (address) {
        var re = /^(?:[^"\'{};])+?$/;
        return re.test(String(address).toLowerCase());
    };
    Utility.ValidatePhone = function (phone) {
        var re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.0-9]*$/;
        return re.test(phone.toString());
    };
    Utility.ValidateDescription = function (description) {
        var re = /^(?:[^"\'{};])+?$/;
        return re.test(String(description).toLowerCase());
    };
    Utility.VerifyToken = function (token) {
        try {
            var decodedJson = jwt.verify(token, Utility.JWTKey);
            return decodedJson;
        }
        catch (_a) {
            return false;
        }
    };
    Utility.JWTKey = 'sdsdeeef4cfygvhbjkn12375%^$';
    return Utility;
}());
exports.Utility = Utility;

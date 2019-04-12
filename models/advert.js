"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpError_1 = require("./../http/HttpError");
var Database_1 = require("../models/Database");
var Advert = /** @class */ (function () {
    function Advert() {
    }
    Advert.GetAdvertByAdvertID = function (advertId) {
        return new Promise(function (resolve, reject) {
            Database_1.Database.instance.connection.query("SELECT * FROM advert WHERE id =" + advertId, function (err, response) {
                if (err) {
                    reject(new HttpError_1.HttpError('Internal server error'));
                }
                else {
                    resolve(response);
                }
            });
        });
    };
    Advert.GetAdvertsByTitle = function (title) {
        return new Promise(function (resolve, rejects) {
            var sql = "SELECT * FROM advert WHERE title LIKE '" + title + "%'";
            Database_1.Database.instance.connection.query(sql, function (err, result) {
                if (err) {
                    rejects(new HttpError_1.HttpError('Unable to get advert'));
                }
                else {
                    resolve(result);
                }
            });
        });
    };
    Advert.GetAllAdverts = function () {
        return new Promise(function (resolve, rejects) {
            Database_1.Database.instance.connection.query("SELECT * FROM advert", function (err, result) {
                if (err) {
                    rejects(new HttpError_1.HttpError('Unable to get advert'));
                }
                else {
                    resolve(result);
                }
            });
        });
    };
    // TODO: do search and replace or GetAdverts(
    Advert.GetAdvertsByUserID = function (userId) {
        return new Promise(function (resolve, reject) {
            Database_1.Database.instance.connection.query("SELECT * FROM advert WHERE userId =" + userId, function (err, response) {
                if (err) {
                    reject(new HttpError_1.HttpError('Internal server error'));
                }
                else {
                    resolve(response);
                }
            });
        });
    };
    Advert.GetAdvertByUserIdAndAdvertId = function (userId, adId) {
        return new Promise(function (resolve, reject) {
            // console.log(">> userId: " + userId + " :: adId:" + adId);
            Database_1.Database.instance.connection.query("SELECT * FROM advert WHERE id = " + adId + " AND userId = " + userId, function (err, response) {
                if (err) {
                    reject(new HttpError_1.HttpError('Internal server error'));
                }
                else {
                    resolve(response);
                }
            });
        });
    };
    // Prideda advert į duomenu baze.
    Advert.AddAdvert = function (advert) {
        return new Promise(function (resolve, reject) {
            var sql = "INSERT INTO advert (title, price, address, phone, discription, userId) VALUES\n            ('" + advert.title + "', '" + advert.price + "', '" + advert.address + "', " + advert.phone + ", '" + advert.discription + "', " + advert.userId + ")";
            Database_1.Database.instance.connection.query(sql, function (err) {
                if (err) {
                    console.log(err);
                    reject(new HttpError_1.HttpError('DB error'));
                }
                else {
                    resolve(true);
                }
            });
        });
    };
    // Istrinsi advert pagal userId
    Advert.DeleteAdvert = function (advertId) {
        return new Promise(function (resolve, reject) {
            var sql = "DELETE FROM advert WHERE id = " + advertId;
            Database_1.Database.instance.connection.query(sql, function (err) {
                if (err)
                    reject(new Error('Database error'));
                else
                    resolve(true);
            });
        });
    };
    // advert objektas paduodamas į UpdateAdvert()
    Advert.UpdateAdvert = function (advert) {
        return new Promise(function (resolve, reject) {
            var sql = "UPDATE advert SET \n                            title = '" + advert.title + "',\n                            price = '" + advert.price + "',\n                            address = '" + advert.address + "',\n                            phone = " + advert.phone + ",\n                            discription = '" + advert.discription + "' \n                        WHERE id = " + advert.id;
            Database_1.Database.instance.connection.query(sql, function (err, result) {
                if (err)
                    reject(new Error('Database error'));
                else {
                    resolve(true);
                }
            });
        });
    };
    return Advert;
}());
exports.Advert = Advert;

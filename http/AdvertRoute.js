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
var Utility_1 = require("../models/Utility");
var advert_1 = require("../models/advert");
var HttpError_1 = require("../http/HttpError");
var user_1 = require("../models/user");
var AdvertRoute = /** @class */ (function (_super) {
    __extends(AdvertRoute, _super);
    function AdvertRoute() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AdvertRoute.prototype.setup = function (express) {
        express.get(this.path + "/public/:advertId", this.GetAdvertByAdvertID.bind(this));
        express.get(this.path + "/public", this.GetAdverts.bind(this));
        express.get("" + this.path, this.getUserAdvertById.bind(this));
        express.post("" + this.path, this.addAdvert.bind(this));
        express.delete(this.path + "/:advertId", this.deleteAdvert.bind(this));
        // url advert/advertId jisai interpretuos kaip id.
        express.put(this.path + "/:advertId", this.updateAdvert.bind(this));
    };
    AdvertRoute.prototype.GetAdvertByAdvertID = function (request, response) {
        if (request) {
            var advertId = Number(request.params.advertId);
            advert_1.Advert.GetAdvertByAdvertID(advertId)
                .then(function (adverts) {
                response.send(adverts);
            }).catch(function (error) {
                response.status(error.code);
                response.send(error);
            });
        }
        else {
            response.send(new HttpError_1.HttpError('Bad request', HttpError_1.HttpStatusCode.BadRequest));
        }
    };
    AdvertRoute.prototype.GetAdverts = function (request, response) {
        if (request) {
            var queryTitle = request.query.title;
            if (queryTitle != null) {
                advert_1.Advert.GetAdvertsByTitle(queryTitle)
                    .then(function (adverts) {
                    response.send(adverts);
                }).catch(function (error) {
                    response.status(error.code);
                    response.send(error);
                });
            }
            else {
                advert_1.Advert.GetAllAdverts()
                    .then(function (adverts) {
                    response.send(adverts);
                }).catch(function (error) {
                    response.status(error.code);
                    response.send(error);
                });
            }
        }
        else {
            response.send(new HttpError_1.HttpError('Bad request', HttpError_1.HttpStatusCode.BadRequest));
        }
    };
    AdvertRoute.prototype.updateAdvert = function (request, response) {
        var user;
        var advertId;
        user_1.User.ValidateToken(request)
            .then(function (userResponse) {
            user = userResponse;
            if (Object.keys(request).length === 0)
                throw new HttpError_1.HttpError('Empty body');
            advertId = Number(request.params.advertId);
            if (!advertId)
                throw new HttpError_1.HttpError('Advert ID is not provided');
            return advert_1.Advert.GetAdvertByUserIdAndAdvertId(user.id, advertId);
        }).then(function (advert) {
            // TODO: if advert = null - that means we did
            // not find any adds for this user
            if (Object.keys(advert).length === 0)
                throw new HttpError_1.HttpError('No such add for this user');
            advert.price = request.body.price;
            advert.title = request.body.title;
            advert.address = request.body.address;
            advert.phone = request.body.phone;
            advert.discription = request.body.discription;
            advert.id = advertId;
            if (!Utility_1.Utility.ValidatePrice(advert.price)) {
                response.status(HttpError_1.HttpStatusCode.Forbidden);
                response.send(new HttpError_1.HttpError('Invalid phone', HttpError_1.HttpStatusCode.BadRequest));
                return;
            }
            if (!Utility_1.Utility.ValidateTitle(advert.title)) {
                response.status(HttpError_1.HttpStatusCode.Forbidden);
                response.send(new HttpError_1.HttpError('Invalid title', HttpError_1.HttpStatusCode.BadRequest));
                return;
            }
            if (!Utility_1.Utility.ValidateAddress(advert.address)) {
                response.status(HttpError_1.HttpStatusCode.Forbidden);
                response.send(new HttpError_1.HttpError('Invalid address', HttpError_1.HttpStatusCode.BadRequest));
                return;
            }
            if (!Utility_1.Utility.ValidatePhone(advert.phone)) {
                response.status(HttpError_1.HttpStatusCode.Forbidden);
                response.send(new HttpError_1.HttpError('Invalid phone', HttpError_1.HttpStatusCode.BadRequest));
                return;
            }
            if (!Utility_1.Utility.ValidateDescription(advert.discription)) {
                response.status(HttpError_1.HttpStatusCode.Forbidden);
                response.send(new HttpError_1.HttpError('Invalid description', HttpError_1.HttpStatusCode.BadRequest));
                return;
            }
            return advert_1.Advert.UpdateAdvert(advert);
        }).then(function () {
            // TODO: Send decent response
            response.send({ status: 200 });
        }).catch(function (error) {
            console.log(error);
            response.status(error.code);
            response.send(error);
        });
    };
    // database call. select metodai.
    AdvertRoute.prototype.getUserAdvertById = function (request, response) {
        user_1.User.ValidateToken(request)
            .then(function (userResponse) {
            console.log(userResponse);
            return advert_1.Advert.GetAdvertsByUserID(userResponse.id);
        })
            .then(function (adverts) {
            response.send(adverts);
        })
            .catch(function (error) {
            response.status(error.code);
            response.send(error);
        });
    };
    AdvertRoute.prototype.addAdvert = function (request, response) {
        var user;
        console.log(response);
        user_1.User.ValidateToken(request)
            .then(function (userResponse) {
            console.log('USER VALIDATED');
            user = userResponse;
            var advert = new advert_1.Advert();
            advert.price = request.body.price;
            advert.title = request.body.title;
            advert.address = request.body.address;
            advert.phone = request.body.phone;
            advert.discription = request.body.discription;
            advert.userId = user.id;
            if (!Utility_1.Utility.ValidatePrice(advert.price)) {
                response.status(HttpError_1.HttpStatusCode.Forbidden);
                response.send(new HttpError_1.HttpError('Invalid price', HttpError_1.HttpStatusCode.BadRequest));
                return;
            }
            if (!Utility_1.Utility.ValidateTitle(advert.title)) {
                response.status(HttpError_1.HttpStatusCode.Forbidden);
                response.send(new HttpError_1.HttpError('Invalid title', HttpError_1.HttpStatusCode.BadRequest));
                return;
            }
            if (!Utility_1.Utility.ValidateAddress(advert.address)) {
                response.status(HttpError_1.HttpStatusCode.Forbidden);
                response.send(new HttpError_1.HttpError('Invalid address', HttpError_1.HttpStatusCode.BadRequest));
                return;
            }
            if (!Utility_1.Utility.ValidatePhone(advert.phone)) {
                response.status(HttpError_1.HttpStatusCode.Forbidden);
                response.send(new HttpError_1.HttpError('Invalid phone', HttpError_1.HttpStatusCode.BadRequest));
                return;
            }
            if (!Utility_1.Utility.ValidateDescription(advert.discription)) {
                response.status(HttpError_1.HttpStatusCode.Forbidden);
                response.send(new HttpError_1.HttpError('Invalid description', HttpError_1.HttpStatusCode.BadRequest));
                return;
            }
            return advert_1.Advert.AddAdvert(advert);
        })
            // Bus įvykdytas tik tuo metu, kai išsispręs AddAdvert promise
            .then(function () {
            return advert_1.Advert.GetAdvertsByUserID(user.id);
        })
            // Bus įvykdytas tik tuo metu, kai išsispręs GetAdvert promise
            .then(function (adverts) {
            response.send(adverts);
        })
            .catch(function (error) {
            console.log(error);
            response.status(error.code);
            response.send(error);
        });
    };
    AdvertRoute.prototype.deleteAdvert = function (request, response) {
        user_1.User.ValidateToken(request)
            .then(function () {
            var advertId = Number(request.params.advertId);
            if (advertId) {
                advert_1.Advert.DeleteAdvert(request.params.advertId)
                    .then(function () {
                    response.status(HttpError_1.HttpStatusCode.OK);
                    response.send("{}");
                })
                    .catch(function (err) {
                    response.send(new Error('Error deleting advert'));
                });
            }
            else {
                response.send(new HttpError_1.HttpError('Bad request', HttpError_1.HttpStatusCode.BadRequest));
            }
        })
            .catch(function (error) {
            response.status(error.code);
            response.send(error);
        });
    };
    return AdvertRoute;
}(HttpRoute_1.HttpRoute));
exports.AdvertRoute = AdvertRoute;

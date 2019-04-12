import {HttpRoute} from "./HttpRoute";
import {Express, Request, Response} from "express";
import {Utility} from "../models/Utility";
import {Advert} from "../models/advert";
import {HttpError, HttpStatusCode} from "../http/HttpError";
import { User } from "../models/user";

export class AdvertRoute extends HttpRoute {
    setup(express: Express): void {
        express.get(`${this.path}/public/:advertId`, this.GetAdvertByAdvertID.bind(this));
        express.get(`${this.path}/public`, this.GetAdverts.bind(this));
        express.get(`${this.path}`, this.getUserAdvertById.bind(this));
        express.post(`${this.path}`, this.addAdvert.bind(this));
        express.delete(`${this.path}/:advertId`, this.deleteAdvert.bind(this));
        // url advert/advertId jisai interpretuos kaip id.
        express.put(`${this.path}/:advertId`, this.updateAdvert.bind(this));
    }

    private GetAdvertByAdvertID(request: Request, response: Response): void {
        if(request){
            let advertId = Number(request.params.advertId);
            Advert.GetAdvertByAdvertID(advertId)
                .then((adverts: Advert[]) => {
                    response.send(adverts);
                }).catch((error: HttpError) => {
                    response.status(error.code);
                    response.send(error);
                });
        } else {
            response.send(new HttpError('Bad request', HttpStatusCode.BadRequest))
        }
    }

    private GetAdverts(request: Request, response: Response): void {
        if(request){
            let queryTitle: string = request.query.title;
            if(queryTitle != null) {
                Advert.GetAdvertsByTitle(queryTitle)
                    .then((adverts: Advert[]) => {
                        response.send(adverts);
                    }).catch((error: HttpError) => {
                        response.status(error.code);
                        response.send(error);
                    })
            } else {
                Advert.GetAllAdverts()
                    .then((adverts: Advert[]) => {
                        response.send(adverts);
                    }).catch((error: HttpError) => {
                        response.status(error.code);
                        response.send(error);
                    });
            }
        } else {
            response.send(new HttpError('Bad request', HttpStatusCode.BadRequest))
        }
    }

    private updateAdvert(request: Request, response: Response): void {
        let user: User;
        let advertId: number;
        User.ValidateToken(request)
            .then((userResponse: User) => {
                user = userResponse;
                if(Object.keys(request).length === 0)
                    throw new HttpError('Empty body');
                advertId = Number(request.params.advertId);
                if (!advertId)
                    throw new HttpError('Advert ID is not provided');
                return Advert.GetAdvertByUserIdAndAdvertId(user.id, advertId);
            }).then((advert: Advert) => {
                // TODO: if advert = null - that means we did
                // not find any adds for this user
                if(Object.keys(advert).length === 0)
                    throw new HttpError('No such add for this user');
                    advert.price = request.body.price;
                    advert.title = request.body.title;
                    advert.address = request.body.address;
                    advert.phone = request.body.phone;
                    advert.discription = request.body.discription;
                    advert.id = advertId;

                if (!Utility.ValidatePrice(advert.price)) {
                    response.status(HttpStatusCode.Forbidden);
                    response.send(new HttpError('Invalid phone', HttpStatusCode.BadRequest));
                    return;
                }    

                if (!Utility.ValidateTitle(advert.title)) {
                    response.status(HttpStatusCode.Forbidden);
                    response.send(new HttpError('Invalid title', HttpStatusCode.BadRequest));
                    return;
                }
        
                if (!Utility.ValidateAddress(advert.address)) {
                    response.status(HttpStatusCode.Forbidden);
                    response.send(new HttpError('Invalid address', HttpStatusCode.BadRequest));
                    return;
                }
        
                if (!Utility.ValidatePhone(advert.phone)) {
                    response.status(HttpStatusCode.Forbidden);
                    response.send(new HttpError('Invalid phone', HttpStatusCode.BadRequest));
                    return;
                }
        
                if (!Utility.ValidateDescription(advert.discription)) {
                    response.status(HttpStatusCode.Forbidden);
                    response.send(new HttpError('Invalid description', HttpStatusCode.BadRequest));
                    return;
                }

                return Advert.UpdateAdvert(advert);

            }).then(() => {
                // TODO: Send decent response
                response.send({status: 200});
            }).catch((error: HttpError) => {
                console.log(error);
                response.status(error.code);
                response.send(error);
            });
    }

    // database call. select metodai.
    private getUserAdvertById(request: Request, response: Response): void {
        User.ValidateToken(request)
            .then((userResponse: User) => {
                console.log(userResponse);
                return Advert.GetAdvertsByUserID(userResponse.id);
            })
            .then((adverts: Advert[]) => {
                response.send(adverts);
            })
            .catch((error: HttpError) => {
                response.status(error.code);
                response.send(error);
            });
    }

    private addAdvert(request: Request, response: Response): void {
        let user: User;
        console.log(response);
        User.ValidateToken(request)
            .then((userResponse: User) => {
                console.log('USER VALIDATED');
                user = userResponse;

                let advert = new Advert();
                advert.price = request.body.price;
                advert.title = request.body.title;
                advert.address = request.body.address;
                advert.phone = request.body.phone;
                advert.discription = request.body.discription;
                advert.userId = user.id;

                if (!Utility.ValidatePrice(advert.price)) {
                    response.status(HttpStatusCode.Forbidden);
                    response.send(new HttpError('Invalid price', HttpStatusCode.BadRequest));
                    return;
                }

                if (!Utility.ValidateTitle(advert.title)) {
                    response.status(HttpStatusCode.Forbidden);
                    response.send(new HttpError('Invalid title', HttpStatusCode.BadRequest));
                    return;
                }
        
                if (!Utility.ValidateAddress(advert.address)) {
                    response.status(HttpStatusCode.Forbidden);
                    response.send(new HttpError('Invalid address', HttpStatusCode.BadRequest));
                    return;
                }
        
                if (!Utility.ValidatePhone(advert.phone)) {
                    response.status(HttpStatusCode.Forbidden);
                    response.send(new HttpError('Invalid phone', HttpStatusCode.BadRequest));
                    return;
                }
        
                if (!Utility.ValidateDescription(advert.discription)) {
                    response.status(HttpStatusCode.Forbidden);
                    response.send(new HttpError('Invalid description', HttpStatusCode.BadRequest));
                    return;
                }

                return Advert.AddAdvert(advert);
            })
            // Bus įvykdytas tik tuo metu, kai išsispręs AddAdvert promise
            .then(() => {
                return Advert.GetAdvertsByUserID(user.id);
            })
            // Bus įvykdytas tik tuo metu, kai išsispręs GetAdvert promise
            .then((adverts: Advert[]) => {
                response.send(adverts);
            })
            .catch((error: HttpError) => { 
                console.log(error);
                response.status(error.code);
                response.send(error);
            });      
    }

    private deleteAdvert(request: Request, response: Response): void {
        User.ValidateToken(request)
            .then(() => {
                let advertId = Number(request.params.advertId);
                if (advertId) {
                    Advert.DeleteAdvert(request.params.advertId)
                        .then(() => {
                            response.status(HttpStatusCode.OK);
                            response.send("{}");
                        })
                        .catch((err: HttpError) => {
                            response.send(new Error('Error deleting advert'));
                        });
                } else {
                    response.send(new HttpError('Bad request', HttpStatusCode.BadRequest));
                }
            })  
        .catch((error: HttpError) => {
            response.status(error.code);
            response.send(error);
        });    
    }
}


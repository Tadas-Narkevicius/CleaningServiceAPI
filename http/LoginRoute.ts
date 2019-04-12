import {HttpRoute} from "./HttpRoute";
import {Express, Request, Response} from "express";
import { User } from "../models/user";
import {Utility} from "../models/Utility";
import { HttpStatusCode, HttpError } from "./HttpError";
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jsonwebtoken';

export class LoginRoute extends HttpRoute {
    setup(express: Express): void {
        express.post(`${this.path}`, this.loginUser.bind(this));
    }
    // Validacija
    private loginUser(request: Request, response: Response): void {
        if (!Utility.ValidateEmail(request.body.email)) {
            response.status(HttpStatusCode.BadRequest);
            response.send(new HttpError('Invalid email', HttpStatusCode.BadRequest));
            return;
        }

        if (!request.body.password || request.body.password.length < 4) {
            response.status(HttpStatusCode.BadRequest);
            response.send(new HttpError('Bad password format', HttpStatusCode.BadRequest));
            return;
        }

        User.GetUserByEmail(request.body.email)
            .then((users: any[]) => {
                if (users.length === 0) {
                    response.status(HttpStatusCode.NotFound);
                    response.send(new HttpError('User not found', HttpStatusCode.NotFound));
                } else {
                    let user = users[0];
                    console.log(user);

                    bcrypt.compare(request.body.password, user.password, (err, success) => {
                        if (success) {
                            // User logged in
                            let tokenPayload = {
                                userId: user.id
                            };
                            // Sukuriama User Token.
                            user.token = jwt.sign(tokenPayload, Utility.JWTKey);

                            // delete user.password;
                            response.send(user);
                        } else {
                            response.status(HttpStatusCode.Unauthorized);
                            response.send(new HttpError('Invalid details', HttpStatusCode.Unauthorized));
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
            .catch((error: HttpError) => {
                response.status(error.code);
                response.send(error);
            });
    }
}
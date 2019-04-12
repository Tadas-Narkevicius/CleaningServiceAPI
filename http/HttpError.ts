export class HttpError {
    code: HttpStatusCode;
    messsage: string;

    constructor(message: string, code: HttpStatusCode = HttpStatusCode.InternalServerError) {
        this.code = code;
        this.messsage = message;
    }
}

export enum HttpStatusCode {
    OK = 200,
    Created = 201,
    InternalServerError = 500,
    BadRequest = 400,
    Conflict = 409,
    Forbidden = 403,
    NotFound = 404,
    Unauthorized = 401
}

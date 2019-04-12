import {Express} from "express";

export abstract class HttpRoute {
    protected path: string;

    constructor(path: string, express: Express) {
        this.path = path;
        this.setup(express);
    }

    abstract setup(express: Express): void;
}
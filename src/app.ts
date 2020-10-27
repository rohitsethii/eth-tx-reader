// resolves all the modules
import 'module-alias/register';

import express from "express";
import bodyParser from "body-parser";

import routes from "@routes";

class Application {

    private app: express.Application;

    constructor() {
        this.app = express(); // initialize the express instance
        this.init();
    }

    /** gets the app instance */
    get instance(): express.Application {
        return this.app;
    }

    /** initializes app components */
    async init() {
        this.useRoutes(); // use routing
    }

    /** uses the middlewares for the app */
    useMiddlewares() {
        this.app.use(bodyParser.json()); // parses the incoming json requests
        this.app.use(bodyParser.urlencoded({ extended: false })); // parses the incoming query requests
    }

    /** uses the routes for the app */
    useRoutes() {
        this.app.use(routes.instance); // uses the in-app routing
    }
}

export default new Application();
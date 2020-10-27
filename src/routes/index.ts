import { Router } from "express";

import v1Routes from "./v1";
import BaseRoute from "./base.routes";

class Routes extends BaseRoute {

    // public path = '/api';

    constructor() {
        super();
        this.init();
    }

    get instance(): Router {
        return this.router;
    }

    /** initializes routes */
    private init() {
        this.router.use(v1Routes.path, v1Routes.instance);
    }
}

export default new Routes();
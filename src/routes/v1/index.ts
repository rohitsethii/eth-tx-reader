import { Router } from "express";

import BaseRoute from "@baseRoute";

import ETHTxRoute from "./eth.tx.routes";

class v1AppRoutes extends BaseRoute {

    public path = '/eth/api/v1';

    constructor() {
        super();
        this.init();
    }

    get instance(): Router {
        return this.router;
    }

    /** initializes routes */
    private init() {
        // routes go here
        this.router.use(ETHTxRoute.instance);
    }
}

export default new v1AppRoutes();
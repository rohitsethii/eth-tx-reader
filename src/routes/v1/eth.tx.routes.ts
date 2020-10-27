import { Request, Response, NextFunction, Router } from "express";
import BaseRoute from "@baseRoute";
import { ETHTxControllerV1 } from "@controllers";


export class ETHRoutes extends BaseRoute {
    
    constructor() {
        super();
        this.initRoutes();
    }

    get instance(): Router {
        return this.router;
    }

    initRoutes() {

        /** gets the detail of single art */
        this.router.get('/transaction/:txId',
            (req: Request, res: Response, next: NextFunction) => {
                ETHTxControllerV1.getTx(req, res, next);
            }
        );

    }

}

export default new ETHRoutes();
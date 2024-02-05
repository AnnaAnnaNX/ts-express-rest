import express from 'express'
import { CommonRoutesConfig } from '../common/commom.routes.config'
export class UsersRoutesConfig extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRotes')
    }
    configureRoutes(): express.Application {
        this.app.route('/users')
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send('List of users')
            })
            .post((req: express.Request, res: express.Response) => {
                res.status(200).send('Post to user')
            })

        this.app.route('/user/:userId')
            .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
                next()
            })
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send(`GET user ${req.params.userId}`)
            })
            .put((req: express.Request, res: express.Response) => {
                res.status(200).send(`PUT user ${req.params.userId}`)
            })
            .delete((req: express.Request, res: express.Response) => {
                res.status(200).send(`DELETE user ${req.params.userId}`)
            })
        return this.app
    }
}
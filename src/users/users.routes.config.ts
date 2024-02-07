import express from 'express'
import { CommonRoutesConfig } from '../common/commom.routes.config'
import usersControllers from './controlles/users.controllers'
import usersMiddleware from "./middlewares/users.middleware";
import UsersMiddleware from "./middlewares/users.middleware";
import UsersControllers from "./controlles/users.controllers";
export class UsersRoutesConfig extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRotes')
    }
    configureRoutes(): express.Application {
        this.app.route('/users')
            .get(usersControllers.listUsers)
            .post(
                usersMiddleware.validateRequestUserBodyFields,
                usersMiddleware.validateSameEmailDoesntExist,
                usersControllers.createUser
            )
        this.app.param('id', UsersMiddleware.extractUserId)
        this.app.route('/user/:id')
            .all(usersMiddleware.validateUserExists)
            .get(usersControllers.getUserById)
            .delete(usersControllers.removeUser)
        this.app.put('/user/:id', [
            UsersMiddleware.validateRequestUserBodyFields,
            UsersMiddleware.validateSameEmailBelongsToSameUser,
            UsersControllers.put
        ])
        this.app.patch('/user/:id', [
            UsersMiddleware.validatePatchEmail,
            usersControllers.patch
        ])
        return this.app
    }
}
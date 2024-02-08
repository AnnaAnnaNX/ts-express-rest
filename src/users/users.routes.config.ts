import express from 'express'
import { CommonRoutesConfig } from '../common/commom.routes.config'
import usersControllers from './controlles/users.controllers'
import usersMiddleware from './middlewares/users.middleware'
import UsersMiddleware from './middlewares/users.middleware'
import UsersControllers from './controlles/users.controllers'
import {body} from 'express-validator'
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware'
export class UsersRoutesConfig extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRotes')
    }
    configureRoutes(): express.Application {
        this.app.route('/users')
            .get(usersControllers.listUsers)
            .post(
                usersMiddleware.validateRequestUserBodyFields,
                body('email').isEmail(),
                body('password')
                    .isLength({ min: 5 })
                    .withMessage('Must include password (5+ characters)'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
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
            body('email').isEmail(),
            body('password')
                .isLength({ min: 5 })
                .withMessage('Must include password (5+ characters)')
                .optional(),
            body('firstName').isString().optional(),
            body('lastName').isString().optional(),
            body('permissionFlags').isInt().optional(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            UsersMiddleware.validatePatchEmail,
            usersControllers.patch
        ])
        return this.app
    }
}
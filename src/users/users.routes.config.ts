import express from 'express'
import {CommonRoutesConfig} from '../common/commom.routes.config'
import UsersControllers from './controlles/users.controllers'
import UsersMiddleware from './middlewares/users.middleware'
import {body} from 'express-validator'
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware'
import CommonPermissionMiddleware from "../common/middleware/common.permission.middleware";
import {PermissionFlag} from "../common/middleware/common.permissionflag.enum";
import jwtMiddleware from "../auth/middleware/jwt.middleware";

export class UsersRoutesConfig extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRotes')
    }
    configureRoutes(): express.Application {
        this.app.route('/users')
            .get([
                jwtMiddleware.validJwtNeeded,
                CommonPermissionMiddleware.permissionFlagRequired(PermissionFlag.ADMIN_PERMISSION),
                UsersControllers.listUsers
            ])
            .post(
                UsersMiddleware.validateRequestUserBodyFields,
                body('email').isEmail(),
                body('password')
                    .isLength({ min: 5 })
                    .withMessage('Must include password (5+ characters)'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                UsersMiddleware.validateSameEmailDoesntExist,
                UsersControllers.createUser
            )
        this.app.param('id', UsersMiddleware.extractUserId)
        this.app.route('/user/:id')
            .all(
                UsersMiddleware.validateUserExists,
                jwtMiddleware.validJwtNeeded,
                CommonPermissionMiddleware.permissionFlagRequired(PermissionFlag.ADMIN_PERMISSION)
            )
            .get(UsersControllers.getUserById)
            .delete(UsersControllers.removeUser)
        this.app.put('/user/:id', [
            UsersMiddleware.validateRequestUserBodyFields,
            UsersMiddleware.validateSameEmailBelongsToSameUser,
            CommonPermissionMiddleware.userCantChangePermission,
            CommonPermissionMiddleware.permissionFlagRequired(PermissionFlag.PAID_PERMISSION),
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
            CommonPermissionMiddleware.userCantChangePermission,
            CommonPermissionMiddleware.permissionFlagRequired(PermissionFlag.PAID_PERMISSION),
            UsersControllers.patch
        ])
        return this.app
    }
}
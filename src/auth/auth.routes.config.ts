import {CommonRoutesConfig} from "../common/commom.routes.config";
import express from 'express'
import {body} from 'express-validator'
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware'
import authMiddleware from './middleware/auth.middleware'
import authController from './controller/auth.controller'
import jwtMiddleware from './middleware/jwt.middleware'
import jwt from "jsonwebtoken";

export class AuthRoutesConfig extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'AuthRouter');
    }
    configureRoutes(): express.Application {
        this.app.post('/auth', [
            body('email').isEmail(),
            body('password').isString(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            authMiddleware.verifyUserPassword,
            authController.createJWT
        ])
        this.app.post('/auth/refresh-token', [
            jwtMiddleware.validJwtNeeded,
            jwtMiddleware.verifyRefreshBodyField,
            jwtMiddleware.validRefreshNeeded,
            authController.createJWT
        ])
        return this.app
    }
}
import express from 'express'
import crypto from 'crypto'
import UsersService from '../../users/users.service';
import jwt from 'jsonwebtoken'
import { Jwt } from '../../common/types/jwt'
import debug from "debug";
const log: debug.IDebugger = debug('app:jwt-middleware')

const jwtSecret: string = process.env.JWT_SECRET || 'qwerty'
class JwtMiddleware {
    verifyRefreshBodyField(req: express.Request, res:express.Response, next: express.NextFunction) {

        log('req?.body?.refreshToken', req?.body?.refreshToken)
        if (req?.body?.refreshToken) {
            return next()
        } else {
            return res.status(400).send({ errors: ['Missing required field: refreshToken'] })
        }
    }
    async validRefreshNeeded(req: express.Request, res:express.Response, next: express.NextFunction) {
        const user = await UsersService.getUserByEmailWithPassword(res.locals.jwt.email)
        const salt = crypto.createSecretKey(Buffer.from(res.locals.jwt.refreshKey.data))
        const hash = crypto
            .createHmac('sha512', salt)
            .update(res.locals.jwt.userId + jwtSecret)
            .digest('base64')
        if (hash === req.body.refreshToken) {
            req.body = {
                userId: user?._id,
                email: user?.email,
                permissionFlags: user?.permissionFlags
            }
            return next()
        } else {
            return res.status(400).send({ errors: ['Invalid refreshToken'] })
        }
    }
    validJwtNeeded(req: express.Request, res:express.Response, next: express.NextFunction) {
        log('req.headers[\'authorization\']', req.headers['authorization'])
        if (req.headers['authorization']) {
            try {
                const authorization = req.headers['authorization'].split(' ')
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send()
                } else {
                    res.locals.jwt = jwt.verify(authorization[1], jwtSecret) as Jwt
                    next()
                }
            } catch(err) {
                return res.status(403).send()
            }
        } else {
            return res.status(401).send()
        }
    }
}
export default new JwtMiddleware()
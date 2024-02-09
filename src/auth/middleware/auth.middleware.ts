import express from 'express'
import UsersService from '../../users/users.service'
import argon2 from 'argon2'
import debug from "debug";

const log: debug.IDebugger = debug('app:auth-middleaware')
class AuthMiddleware {
    async verifyUserPassword(req: express.Request, res: express.Response, next: express.NextFunction) {
        const user: any = await UsersService.getUserByEmailWithPassword(req.body.email)
        log('user', user)
        if (user) {
            const passwordHash = user.password
            log('user.password', user.password)
            log('await argon2.verify(passwordHash, req.body.password)', await argon2.verify(passwordHash, req.body.password))
            if (await argon2.verify(passwordHash, req.body.password)) {
                req.body = {
                    userId: user._id,
                    email: user.email,
                    permissionFlags: user.permissionFlags
                }
                return next()
            }
        }
        res.status(400).send({ errors: ['Invalid email and/or password'] })
    }
}
export default new AuthMiddleware()
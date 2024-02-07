
import debug from 'debug'
import express from "express";
import UsersService from "../users.service";

const log: debug.IDebugger = debug('app:users-controller')
class UsersMiddleware {
    async validateRequestUserBodyFields (req: express.Request, res: express.Response, next: express.NextFunction) {
        log('req.body', req.body)
        if (req.body && req.body.email && req.body.password) {
            next()
        } else {
            res.status(400).send({
                error: 'Missing required fields email and password'
            })
        }
    }
    async validateSameEmailDoesntExist(req: express.Request, res: express.Response, next: express.NextFunction) {
        const user = await UsersService.readById(req.body.id)
        if (user) {
            res.status(400).send({
                error: 'User email already exists'
            })
        } else {
            next()
        }
    }
    async validateSameEmailBelongsToSameUser (req: express.Request, res: express.Response, next: express.NextFunction) {
        const user = await UsersService.getUserByEmail(req.body.email)
        if (user && user.id === req.params.id) {
            next()
        } else {
            res.status(400).send({
                error: 'Invalid email'
            })
        }
    }
    validatePatchEmail = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.body.password) {
            log('Validating email', req.body.email)
            this.validateSameEmailBelongsToSameUser(req, res, next)
        } else {
            next()
        }
    }
    async validateUserExists(req: express.Request, res: express.Response, next: express.NextFunction) {
        const user = await UsersService.readById(req.params.id)
        if (user) {
            next()
        } else {
            res.status(400).send({
                error: `User ${req.params.id} not found111`
            })
        }
    }
    async extractUserId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.id = req.params.id
        next()
    }
}
export default new UsersMiddleware()


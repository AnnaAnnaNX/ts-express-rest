import {PermissionFlag} from './common.permissionflag.enum'
import express from 'express'
import debug from 'debug'

const log: debug.IDebugger = debug('app:permission-middleware')
class PermissionMiddleware {
    permissionFlagRequired(requiredPermissionFlag: PermissionFlag) {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                log('res.locals.jwt.permissionFlags', res.locals.jwt.permissionFlags)
                const userPermissionFlags = parseInt(res.locals.jwt.permissionFlags)
                if (userPermissionFlags & requiredPermissionFlag) {
                    next()
                } else {
                    res.status(403).send()
                }
            } catch(e) {
                log(e)
            }
        }
    }
    async onlySameUserOrAdmin (req: express.Request, res: express.Response, next: express.NextFunction) {
        const userPermissionFlags = parseInt(res.locals.jwt.permissionFlags)
        if (req.params && req.params.userId === res.locals.jwt.userId) {
            return next()
        } else {
            if (userPermissionFlags & PermissionFlag.ADMIN_PERMISSION) {
                return next()
            } else {
                return res.status(403).send()
            }
        }
    }
    async userCantChangePermission(req: express.Request, res: express.Response, next: express.NextFunction) {
        if ('permissionFlags' in req.body
            && req.body.permissionFlags !== res.locals.user.permissionFlags) {
            res.status(400).send({ errors: ['User cannot change permission flags'] })
        } else {
            next()
        }
    }
}
export default new PermissionMiddleware()
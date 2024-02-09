import express from 'express'
import * as http from 'http'
import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import cors from 'cors'
import { CommonRoutesConfig } from './common/commom.routes.config'
import { UsersRoutesConfig } from './users/users.routes.config'
import { AuthRoutesConfig } from './auth/auth.routes.config'
import debug from 'debug'

import dotenv from 'dotenv'
const dotenvResult = dotenv.config()
if (dotenvResult.error) {
    throw dotenvResult.error
}

const app: express.Application = express()
const server: http.Server = http.createServer(app)
const port = 3000
const routes: Array<CommonRoutesConfig> = []
const debugLog: debug.IDebugger = debug('app')

app.use(express.json())
app.use(cors())

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    )
}

if (!process.env.DEBUG) {
    loggerOptions.meta = false
}

app.use(expressWinston.logger(loggerOptions))

routes.push(new UsersRoutesConfig(app))
routes.push(new AuthRoutesConfig(app))

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send('111')
})

server.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`)
    })
    console.log(`Server running on port ${port}`)
})
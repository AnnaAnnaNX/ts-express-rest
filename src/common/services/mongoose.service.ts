import * as mongoose from 'mongoose'
import debug from 'debug'

const log: debug.IDebugger = debug('app:mongoose-service')

class MongooseService {
    private count = 0
    private mongooseOptions: mongoose.ConnectOptions = {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        // userFindAndModify: false
    }

    constructor() {
        this.connectWithRetry()
    }

    getMongoose() {
        return mongoose
    }

    connectWithRetry = () => {
        log('Attempting MongoDB connect (will retry if needed)')
        mongoose
            .connect('mongodb://localhost:27017/api-db', this.mongooseOptions)
            .then(() => {
                log('MongoDB in connected')
            })
            .catch((err) => {
                const retrySeconds = 5
                log(`Mongo connection unsuccessful (will retry ${++this.count} after ${retrySeconds} seconds)`, err)
                setTimeout(this.connectWithRetry, retrySeconds * 1000)
            })
    }

}

export default new MongooseService()
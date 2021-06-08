require('dotenv').config()

import {DATABASE_TYPE} from "./constante"
import sequelize from "../orm/sequelize/sequelize"
import {mongoDbProvider} from "../orm/mongodb/mongodb"

export const init = async function() {
    if(process.env.connections === DATABASE_TYPE.MYSQL || process.env.connections === DATABASE_TYPE.POSTGRES) {
        try {
            await sequelize.sync()
            console.log('Connection to DB has been established successfully.')
        } catch (err) {
            console.error('Unable to connect to the database:', err)
        }
    } else {
        try {
            const DATABASE_NAME = process.env.MONOGO_DATABASE??""
            await mongoDbProvider.connectAsync(DATABASE_NAME)
            console.log('Connection to DB has been established successfully.')
        } catch (error) {
            console.error('Unable to connect to the database:', error)
        }
    }
}
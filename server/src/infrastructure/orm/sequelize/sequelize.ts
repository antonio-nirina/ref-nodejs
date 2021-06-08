import {Sequelize} from "sequelize"

// const DATABASE_URI:string = process.env.DATABASE_URI ?? ""

const sequelize = new Sequelize('todo', 'root', 'password', {
    host: 'localhost',
    dialect: "mysql"
})

export default sequelize
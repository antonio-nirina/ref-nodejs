import {init} from "./infrastructure/config/bootstrap"
import morgan from "morgan"
import express from "express"
import cors from "cors"

import Router from "./interfaces/routes/todo"

const Init = async function() {
    const app = express()
    try {
        await init()
        app.use(express.json())
        app.use(express.urlencoded({extended: true}))
        app.use(cors())
        app.use('/api', Router)
        const port = Number(process.env.PORT || 4000)
        app.listen(port,function() {
            console.log("Server runing at : "+ port)
        })
      } catch (err) {
        console.log(err);
        process.exit(1);
      }
}

Init()
import { Request, Response, Router } from "express"
import {IRequest,RequestError} from "../entities/constante"
import StatusCodes from "http-status-codes"
import TodoNextRepository from "../repository/todoNextRepository"
import { TodoInterface } from "../entities/todo"


const routerNext = Router()
const { BAD_REQUEST, CREATED, OK } = StatusCodes
const todoNextRepository = new TodoNextRepository()

routerNext.get("/todos", async (req: Request, res: Response) => {
    const todos = await todoNextRepository.getAllTodo()
    return res.status(OK).json({ "data":todos })
  })
  
  routerNext.post("/todo", async (req: Request, res: Response) => {
    const todo:TodoInterface  = {
        title:req.body.title,
        content:req.body.content,
        statut:req.body.statut,
    }
    // Use_case pass

    if (!todo) {
        return res.status(BAD_REQUEST).json({
            error: RequestError,
        })
    }
    const todos = await todoNextRepository.addTodo(todo)
    return res.status(CREATED).json({ "data":todos })
})

routerNext.put("/todo/:id", async (req: Request, res: Response) => {
    const todo:TodoInterface  = {
        title:req.body.title,
        content:req.body.content,
        statut:req.body.statut,
    }
    const { id } = req.params
    if (!todo) {
        return res.status(BAD_REQUEST).json({
        error: RequestError,
        })
    }

    await todoNextRepository.updateTodo(id,todo)
    return res.status(OK).end()
})
  

routerNext.delete("/todo/:id", async (req: IRequest, res: Response) => {
    const { id } = req.params
    await todoNextRepository.deleteTodo(id)
    return res.status(OK).end()
})

export default routerNext
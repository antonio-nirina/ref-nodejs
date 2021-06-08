import StatusCodes from "http-status-codes"
import { Request, Response, Router } from "express"
import {IRequest,RequestError} from "../entities/constante"
import TodoRepository from "../repository/todoRepository"
import { TodoInterface } from "../entities/todo"

const router = Router()
const todoRepository = new TodoRepository()
const { BAD_REQUEST, CREATED, OK } = StatusCodes

router.get("/todos", async (req: Request, res: Response) => {
    const todos = await todoRepository.getAllTodo()
    return res.status(OK).json({ "data":todos })
  })
  
router.post("/todo", async (req: Request, res: Response) => {
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
    const todos = await todoRepository.addTodo(todo)
    return res.status(CREATED).json({ "data":todos })
})

router.put("/todo/:id", async (req: Request, res: Response) => {
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

    await todoRepository.updateTodo(id,todo)
    return res.status(OK).end()
})
  

router.delete("/todo/:id", async (req: IRequest, res: Response) => {
    const { id } = req.params
    await todoRepository.deleteTodo(id)
    return res.status(OK).end()
})

export default router
import {TodoRepositoryInterface} from "./todoRepository"
import {TodoInterface} from "../entities/todo"
import {Todo} from "../../infrastructure/orm/sequelize/schema/todo"

import sequelize from "../../infrastructure/orm/sequelize/sequelize"


class TodoNextRepository implements TodoRepositoryInterface {

    public async getOneTodo(id: string): Promise<TodoInterface | null> {
        return Promise.resolve(null)
    }

    public async getAllTodo(): Promise<TodoInterface[]> {
        return Promise.resolve([])
        
    }

    public async addTodo(todo: TodoInterface): Promise<TodoInterface | null>{
        const seqUser = await Todo.create(
            {
                title:todo.title,
                content:todo.content,
                statut:todo.statut
            }
        )
        await seqUser.save()
        return Promise.resolve(null)
    }

    public async updateTodo(id:string, todo: TodoInterface): Promise<TodoInterface | null>{
        return Promise.resolve(null)
    }

    public async deleteTodo(id: string):Promise<void> {

    }
}

export default TodoNextRepository
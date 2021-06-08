import {TodoInterface} from "../entities/todo"
import {mongoDbProvider} from "../../infrastructure/orm/mongodb/mongodb"
import { ObjectID } from 'mongodb'

export interface TodoRepositoryInterface {
    getOneTodo: (id: string) => Promise<TodoInterface | null>
    getAllTodo: () => Promise<TodoInterface[]>
    addTodo: (todo: TodoInterface) => Promise<TodoInterface | null>
    updateTodo: (id:string,todo: TodoInterface) => Promise<TodoInterface | null>
    deleteTodo: (id: string) => Promise<void>
}

class TodoRepository implements TodoRepositoryInterface {
    public async getOneTodo(id: string): Promise<TodoInterface | null> {
        const res: TodoInterface = await mongoDbProvider.todoCollection.findOne({ _id: new ObjectID(id) }) as TodoInterface

	    return res
    }

    public async getAllTodo(): Promise<TodoInterface[]> {
        const results = await mongoDbProvider.todoCollection.find().toArray()

	    return results
    }

    public async addTodo(todo: TodoInterface): Promise<TodoInterface>{
        const res = await mongoDbProvider.todoCollection.insertOne({
            title:todo.title,
            content:todo.content,
            statut:todo.statut,
        })

        return todo
    }

    public async updateTodo(id:string, todo: TodoInterface): Promise<TodoInterface>{
       await mongoDbProvider.todoCollection.updateOne(
            { _id: new ObjectID(id)},
            {
                $set: {
                    title:todo.title,
                    content:todo.content,
                    statut:todo.statut,
                },
            }
        )

        return todo
    }

    public async deleteTodo(id: string):Promise<void> {
        await mongoDbProvider.todoCollection.deleteOne({_id:new ObjectID(id)})
        
        return Promise.resolve(undefined)
    }

}

export default TodoRepository
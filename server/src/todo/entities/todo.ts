import { ObjectID } from "mongodb"
export interface TodoInterface {
    title:string
    content:string
    statut:boolean
}

class Todo implements TodoInterface {
    public title: string
    public content : string
    public statut: boolean

    constructor(title:string,content:string,statut:boolean) {
        this.content    = content
        this.title      = title
        this.statut     = statut
    }
    
}

export default Todo
import { Router } from "express"
import todo from "../../todo/controller/todoController"
import todoNext from "../../todo/controller/todoNextController"

const router = Router()
router.use("/",todo)
router.use("/next",todoNext)

export default router
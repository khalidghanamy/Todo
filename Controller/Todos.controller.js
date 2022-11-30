import Todo from "../Models/Todo.js";
import User from "../Models/User.js";


const checkUser = async (req, res, next) => {
    const { id } = req.user
    const user = await User.findById(id);

    if (!user) {
        return res.status(400).json({ status: false, msg: "User does not exist" });
    }


}



export const createTodo = async (req, res, next) => {



    const { userId } = req.params;
    try {
        //check if user exist in database
        await checkUser(req, res, next);
        //create Todo
        const todo = await Todo.create({ ...req.body, userId });
        //add Todo to user
        const user = await User.findByIdAndUpdate(userId, {
            $push: {
                todos: todo._id
            }
        }, { new: true });

        return res.status(200).json({ status: true, todo, msg: "Todo created successfully" });
    } catch (error) {
        next(error);
    }


}

export const getOneTodo = async (req, res, next) => {
    const { id } = req.params;
    try {
        //check if user exist in database
        await checkUser(req, res, next);
        //get Todo
        const todo = await Todo.findById(id);
        return res.json(todo);

    } catch (error) {
        next(error);
    }
}
export const getTodos = async (req, res, next) => {

    const { id } = req.user
    try {
        //check if user exist in database

        await checkUser(req, res, next);
        //get todos
        const user = await User.findById(id).populate("todos");
        console.log(user.todos);
        const data = user.todos.map(todo => {
            return {
                id: todo._id,
                title: todo.title,
                description: todo.description,
                priority: todo.priority,
                status: todo.status,
                startedAt: todo.startedAt,
                finishedAt: todo.finishedAt
            }
        });
        return res.status(200).json({ status: true, userTodos: data });

    } catch (error) {
        next(error);
    }
}

export const updateTodo = async (req, res, next) => {
    const { id } = req.params;


    try {
        let isOwner = await isUserOwner(req, res, next);
        if (!isOwner) {
            return res.status(400).json({ status: false, msg: "You are not the owner of this todo" });
        }
        //update Todo
        const todoData = await Todo.findByIdAndUpdate(id,
            { $set: req.body },
            { new: true }
        );
        if (!todoData) {
            return res.status(400).json({ status: false, msg: "Todo does not exist" });
        }
        const todo =
        {
            id: todoData._id,
            title: todoData.title,
            description: todoData.description,
            priority: todoData.priority,
            status: todoData.status,
            startedAt: todoData.startedAt,
            finishedAt: todoData.finishedAt
        }
        return res.status(200).json({ todo: todo, status: true, msg: "Todo updated successfully" });
    } catch (error) {
        next(error);
    }
}



export const deleteTodo = async (req, res, next) => {
    const { id } = req.params;
    try {
        let isOwner = await isUserOwner(req, res, next);
        if (!isOwner) {
            return res.status(400).json({ status: false, msg: "You are not the owner of this todo" });
        }
        const todo = await Todo.findByIdAndDelete(id);
        await User.findByIdAndUpdate(todo.userId, { $pull: { todos: todo._id } });

        return res.status(200).json({ status: true, msg: "Todo has been deleted" });

    } catch (error) {
        next(error);
    }
}


export const isUserOwner = async (req, res, next) =>{
    const { id } = req.params;
    let user = await User.findById(req.user.id);
    let todo = user.todos.find(todo => todo == id);
    if (todo) {
        return todo
    } else {
        return false
    }
}
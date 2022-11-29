import Todo from "../Models/Todo.js";
import User from "../Models/User.js";


const checkUser = async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
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
                Todos: todo._id
            }
        });


        return res.status(200).json({ status: true, msg: "Todo created successfully" });
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


export const updateTodo = async (req, res, next) => {
    const { id } = req.params;
    

    try {
        //check if user is the owner of the Todo
        const user = await User.findById(req.user.id);
        if ( user.id == id) {

        //update Todo
        const todoData = await Todo.findByIdAndUpdate(id,
            { $set: req.body },
            { new: true });
        const Todo =
        {
            id: todoData._id,
            title: todoData.title,
            description: todoData.description,
            priority: todoData.priority,
            status: todoData.status,
            startedAt: todoData.startedAt,
            finishedAt: todoData.finishedAt
        }
            


            return res.status(200).json({ todo: todoData, status: true, msg: "Todo updated successfully" });
        }
        else {
            return res.status(400).json({ status: false, msg: "You are not the owner of this Todo" });
        }

    } catch (error) {
        next(error);
    }
}

export const deleteTodo = async (req, res, next) => {
    const { id } = req.params;
    try {
        //check if user is the owner of the Todo
        const user = await User.findById(req.user.id);
        if (user.id == id) {

            const todo = await Todo.findByIdAndDelete(id);
            await User.findByIdAndUpdate(todo.user, { $pull: { todos: todo._id } });
            console.log('done');
            return res.status(200).json({ status: true, msg: "Todo has been deleted" });
        }
        else {
            return res.status(400).json({ status: false, msg: "You are not the owner of this Todo" });
        }

    } catch (error) {
        next(error);
    }
}
import mongoose from "mongoose";

const { Schema } = mongoose;

const todoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Todo", "InProgress", "Completed"],
        default: "Todo"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"

    }
    ,
    startedAt: {
        type: String,
        default: "30/6/2022"
    }
    ,
    finishedAt: {
        type: String,
        default: "1/7/2022"
    }
}
);
const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
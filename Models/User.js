import mongoose from "mongoose";
const { Schema } = mongoose;
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    todos: [
        {
        type: Schema.Types.ObjectId,
        ref: "Todo"
    }]
});
const User = mongoose.model("User", userSchema);
export default User;
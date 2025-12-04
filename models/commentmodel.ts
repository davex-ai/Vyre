import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    postId: {type:mongoose.Schema.Types.ObjectId, ref: "Post"},
    userId: {type: String, ref: "User"},
    content: {type: String}
}, {timestamps: true})

const Comment = mongoose.models.Comment || mongoose.model("Post", commentSchema)
export default Comment
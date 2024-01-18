import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema({
    content:{
        type: String,
        require: true
    },
    video:{
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps: true})

// allow plugin function like pre or post before some action or after
videoSchema.plugin(mongooseAggregatePaginate);
export const comment = mongoose.model("Comment",commentSchema)
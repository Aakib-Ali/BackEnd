import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema =new Schema(
    {
        videoFile :{   ///cloudnary url
            type: String,
            require : true
        },
        thumbnail:{ ///cloudnary url
            type: String,
            require : ture
        },
        title:{ 
            type : String,
            require : true
        },
        description:{
            type: String,
            require : true
        },
        duration :{  ///cloudnary url
            type : Number,
            require: true
        },
        views :{
            type : Number,
            default: 0
        },
        isPublished : {
            type : Boolean,
            default : true
        },
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    },
    {
        timestamps:true
    }
)

// allow plugin function like pre or post before some action or after
videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video",videoSchema);
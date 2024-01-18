import mongoose,{Schema} from "mongoose";

const subscriptionSchema = new Schema(
    {
        subscriber:{
            type: Schema.Types.ObjectId, //one who is subscribe
            ref: "User"
        },
        channel:{
            type: Schema.Types.ObjectId, // onw whom to subsriber is subscribing
            ref: "User"
        }
    },
    {
        timestamps:true
    }
)

export const Subscription = mongoose.model("Subscription",subscriptionSchema);
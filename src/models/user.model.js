import mongoose, {Schema} from "mongoose";
import jwt from JsonWebToken;
import bcrypt from bcrypt;

const userSchema = new Schema(
    {
        userName:{
            type: String,
            require: true,
            unique : true,
            lowcase: true,
            trim : true,
            index: true
        },
        email:{
            type: String,
            require: true,
            unique : true,
            lowcase: true,
            trim : true
        },
        fullName:{
            type: String,
            require: true,
            trim : true,
            index: true
        },
        avatar:{
            type: String, // using cloudnary
            require: true,
        },
        coverImage:{
            type: String,
        },
        watchHistory:[
            {
                type: Schema.Types.OdbjectId,
                ref: "Video"
            }
        ],
        password:{
            type:String,
            require: [true, "Password is required"]
        },
        refreceToken:{
            type: String
        }
    },
    {
        timestamps: true
    }
)

//middleware
//pre hook which is provided by mongoose-agregate which will allow some action before save data
userSchema.pre('save', async function(next){

    //ismodified is a function which is provided by mongoose to check given field is modified or not
    if(!this.isModified("password")) return next();

    this.password=bcrypt.hash(this.password,10)
    next()
})


///create own method to verify user password is correct or not using mongoose
userSchema.methods.isPasswrodCorrect= async function (password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id : this._id,
            userName : this.userName,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            exparesIn: process.env.ACCESS_TOKEN_EXPARY
        }
    )
}


userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            exparesIn: process.env.REFRESH_TOKEN_EXPARY
        }
    )
}

export const User= mongoose.model("User",userSchema)
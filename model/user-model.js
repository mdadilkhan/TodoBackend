import mongoose from "mongoose";


const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
        default: null
    },
    list:[
        {
            type:mongoose.Types.ObjectId,
            ref:'List'
        }
    ]
})



// module.exports=mongoose.model("User",listSchema)


const User=mongoose.model('User',userSchema);
export default User;
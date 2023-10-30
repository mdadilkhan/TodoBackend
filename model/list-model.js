import mongoose from "mongoose";


const listSchema=mongoose.Schema({
    tite:{
        type:String,
        required:true
    },
    tite:{
        type:String,
        required:true
    },
    user:[
        {
            type:mongoose.Types.ObjectId,
            ref:'User'
        }
    ]
})



module.exports=mongoose.model("List",listSchema)




  
  
  
  
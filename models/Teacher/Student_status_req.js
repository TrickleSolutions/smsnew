const mongoose=require('mongoose')
const stStatusReqSchema=new mongoose.Schema({
    regno:{
        type:Number,
        required:true
        
    },
    name:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model("stStatusRequest",stStatusReqSchema)
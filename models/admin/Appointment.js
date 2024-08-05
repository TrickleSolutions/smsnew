const mongoose=require('mongoose')
const AppointmentSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    msg:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model("appointment_tbl",AppointmentSchema)
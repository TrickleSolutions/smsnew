const mongoose = require("mongoose");
const AcademicSchema = new mongoose.Schema({
    student:{
        type:String,
       // required:true
    }, 
    course:{
        type:String,
       // required:true
    }
     
});


module.exports = mongoose.model('Academic_tbl',AcademicSchema);
 
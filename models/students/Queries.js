const mongoose = require("mongoose");
const QueriesSchema = new mongoose.Schema({
    regno:{
        type:Number,
       // required:true
    },
    name:{
        type:String,
       // required:true
    },
    query:{
        type:String,
      //  required:true
    },
    date:{
        type:String,
       // required:true
    },
    status:{
        type:String,
        default:"pending"
    },
    response:{
        type:String,
        default:""
    } 
});


module.exports = mongoose.model('Queries_tbl',QueriesSchema);
 
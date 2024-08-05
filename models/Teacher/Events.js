const mongoose = require("mongoose");
const EventsSchema = new mongoose.Schema({
     
    event:{
        type:String,
       // required:true
    },
    desc:{
        type:String,
      // required:true
    },
    from:{
        type:String,
///required:true
    },
    to:{
        type:String,
     //   required:true
    },
    img:{
        type:String,
     //   required:true
    }
 
     
    
});


module.exports = mongoose.model('Events_tbl',EventsSchema);
 
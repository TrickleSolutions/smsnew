const mongoose = require("mongoose");
const LibrarySchema = new mongoose.Schema({
    des:{
        type:String,
       // required:true
    },
    title:{
        type:String,
       // required:true
    },
   book_no:{
        type:Number,
       // required:true
    },
    isbn_no:{
        type:String,
       // required:true
    },
    publisher:{
        type:String,
       // required:true
    },
    author:{
        type:String,
      //  required:true
    },
    subject:{
        type:String,
      //  required:true
    },
    rack_no:{
        type:Number,
       // required:true
    } ,
    qty:{
        type:Number,
       // required:true
    } ,
    available:{
        type:Number,
       // required:true
    } ,
    price:{
        type:Number,
       // required:true
    },
    date:{
        type:String,
       // required:true
    } 
});


module.exports = mongoose.model('AddLibrary_tbl',LibrarySchema);
 
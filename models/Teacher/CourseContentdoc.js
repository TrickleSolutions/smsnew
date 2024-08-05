const mongoose = require("mongoose");
const COurseContentDocxSchema = new mongoose.Schema({
     
    name:{
        type: String,
      //  required: true,
      }, 
      doc:{
        type: String,
      //  required: true,
      },
      course:{
        type: String,
      //  required: true,
      } 
    
}); 
module.exports = mongoose.model('COurseContentDoc_tbl',COurseContentDocxSchema);
 
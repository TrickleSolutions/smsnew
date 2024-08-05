const mongoose = require("mongoose");
const COurseContentVedioSchema = new mongoose.Schema({
     
    name: {
        type: String,
      //  required: true,
      },
      duration: {
        type: String,
//required: true,
      },
      video: {
        type: String,
      //  required: true,
      } ,
       course: {
        type: String,
      //  required: true,
      } ,
    
    
      desc: {
        type: String,
      //  required: true,
      }
    
}); 
module.exports = mongoose.model('COurseContentVedio_tbl',COurseContentVedioSchema);
 
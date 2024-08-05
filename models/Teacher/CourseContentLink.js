const mongoose = require("mongoose");
const COurseContentLinkSchema = new mongoose.Schema({
     
    name: {
        type: String,
      //  required: true,
      },
      
    
      link: {
        type: String,
      //  required: true,
      },
      course: {
        type: String,
      //  required: true,
      } 
    
}); 
module.exports = mongoose.model('COurseContentLink_tbl',COurseContentLinkSchema);
 
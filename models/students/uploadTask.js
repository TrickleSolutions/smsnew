const mongoose = require("mongoose");
const upload_task = new mongoose.Schema({
     
    img: {
        type: String,
      //  required: true,
      },
      
    regno: {
      type: Number,
      required: true,
    },
      name: {
        type: String,
      //  required: true,
      },
      
}); 
module.exports = mongoose.model('upload_task_tbl',upload_task);
 
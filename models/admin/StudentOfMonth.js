const mongoose = require("mongoose");
const StudentOfMonthSchema = new mongoose.Schema({
     
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
      course: {
        type: String,
       // required: true,
      }
    
}); 
module.exports = mongoose.model('StudentOfMonth_tbl',StudentOfMonthSchema);
 
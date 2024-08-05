const mongoose = require("mongoose");
const InstructorOfMonthSchema = new mongoose.Schema({
     
    img: {
        type: String,
        required: true,
      }, 
      name: {
        type: String,
    required: true,
      },
      course: {
        type: String,
       required: true,
      },
      desc: {
        type: String,
        required: true,
      }
      
    
}); 
module.exports = mongoose.model('InstructorOfMonth_tbl',InstructorOfMonthSchema);
 
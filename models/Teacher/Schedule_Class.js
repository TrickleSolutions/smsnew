const mongoose = require("mongoose");
const Sheduleclass_Schema = new mongoose.Schema({
     
    course: {
        type: String,
       // required: true,
      },
      topic: {
        type: String,
        //   required: true,
      },
      description: {
        type: String,
          // required: true,
      },
     
      date: {
        type:  Date,
        default: Date.now 
      },
      topic: {
        type: String,
         //  required: true,
      },
      link: {
        type: String,
         //  required: true,
      },
      time: {
        type: String,
          // required: true,
      },
      contact_instructor: {
        type: Number,
          // required: true,
      },
   
      
}); 
module.exports = mongoose.model('schedule_class_tbl',Sheduleclass_Schema);
 

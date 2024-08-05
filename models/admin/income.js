const mongoose = require("mongoose");
const IncomeSchema = new mongoose.Schema({
     
  time : {
    type: String,
   //required: true,
  },
  date: {
    type: String,
   //    required: true,
  }, 
  amount: {
    type: Number,
  //required: true,
  },
  desc: {
    type: String,
     //  required: true,
  }
    
});


module.exports = mongoose.model('Income_tbl',IncomeSchema);
 
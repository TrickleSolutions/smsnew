const mongoose = require("mongoose");
const PaymentSchema = new mongoose.Schema({
     
     order: {
        type: Number,
       required: true,
      },
      student: {
        type: String,
           required: true,
      },
    
      date: {
        type: String,
          required: true,
      },
      amount: {
        type: String,
           required: true,
      },
      status: {
        type: String,
       required: true,
      },
    
    
    
}); 
module.exports = mongoose.model('Payment_tbl',PaymentSchema);
 
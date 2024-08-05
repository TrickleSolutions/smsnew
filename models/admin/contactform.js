const mongoose = require("mongoose");
const ContactSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contact: {
    type: Number,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  }
  //  {name,email,contact,subject,desc}

}, {
  timestamps: true
});


module.exports = mongoose.model('contactform_tbl', ContactSchema);

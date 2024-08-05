const mongoose = require("mongoose");
const JoinInstructorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  //  {name,email,contact ,qualification,exp,  cv }
  qualification: {
    type: String,
    required: true,
  },
  exp: {
    type: Number,
    required: false,
  },
  cv: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("JoinInstructorRegister", JoinInstructorSchema);

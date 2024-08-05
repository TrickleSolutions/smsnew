const mongoose = require("mongoose");
const InstructorRegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  doj: {
    type: Date,
    default: new Date(),
  },
  degree: {
    type: String,
    required: false,
  },
  exp: {
    type: Number,
    required: false,
  },
  password: {
    type: String,
    default: 12345,
  },
  profilePic: {
    type: String,
    default: "user.jfif",
  },
  cv: {
    type: String,
    default: "user.jfif",
  },

  aadhar: {
    type: String,
    default: "user.jfif",
  },
  salary: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "leave", "break", "hold"],
  },
});

module.exports = mongoose.model("InstructorRegister", InstructorRegisterSchema);

const mongoose = require("mongoose");
const Student_RegisterSchema = new mongoose.Schema(
  {
    regno: {
      type: Number,
      required: true,
      unique: true,
      // required:true
    },
    name: {
      type: String,
      // required:true
    },
    fname: {
      type: String,
      //  required:true
    },
    address: {
      type: String,
      // required:true
    },
    contact: {
      type: Number,
      required: true,
      unique: true,
      //  required:true
    },
    email: {
      type: String,
      // required:true
    },
    gender: {
      type: String,
      // required:true
    },
    dob: {
      type: String,
      // required:true
    },
    admdate: {
      type: String,
      // required:true
    },

    refby: {
      type: String,
      // required:false
    },
    token: {
      type: String,
    },
    password: {
      type: String,
      default: 12345,
    },
    profilePic: {
      type: String,
      default: "user.jfif",
    },
    idCardimg: {
      type: String,
      default: "user.jfif",
    },
    tenthMarksheet: {
      type: String,
      default: "user.jfif",
    },
    twelthMarksheet: {
      type: String,
      default: "user.jfif",
    },
    status: {
      type: String,
      enum: ["active", "break", "completed"],
      default: "active",
    },
    aadhar_pan: {
      type: String,
    },
    course: {
      type: String,
      required: false,
    },
    shift: {
      type: String,
      required: false,
    },
    locker_no: {
      type: Number,
      default: 0,
    },
    thumb: {
      type: String,
    },
    signature: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student_Register", Student_RegisterSchema);

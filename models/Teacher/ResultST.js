const mongoose = require("mongoose");
const result_Schema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student_registers ",
    required: true,
  },
  name: {
    type: String,
    // required: true,
  },
  resultType: {
    type: String,
    enum: ["other", "surprise", "module", "final"],
    default: "other",
  },
  regno: {
    type: Number,
    //   required: true,
  },
  certificate: {
    type: String,
  },
  course: {
    type: String,
    //  required: true,
  },
  topic: {
    type: String,
    //  required: true,
  },
  total_marks: {
    type: Number,
    // required: true,
  },
  obtain_marks: {
    type: Number,
    // required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("result_tbl", result_Schema);

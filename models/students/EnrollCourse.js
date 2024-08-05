const mongoose = require("mongoose");
const EnrollCourseSchema = new mongoose.Schema({
  student: {
    type: String,
    // required: true,
  },

  course: {
    type: String,
    //  required: true,
  },

  create_at: {
    type: String,
    //  required: true,
  },
});
module.exports = mongoose.model("Enrollcourses_tbl", EnrollCourseSchema);

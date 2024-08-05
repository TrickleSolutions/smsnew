const mongoose = require("mongoose");
const assignment_Schema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  instructions: {
    type: String,
    //   required: true,
  },

  due_date: {
    type: String,
  },

  upload: {
    type: String,
    //  required: true,
  },
  contact_instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instructorregisters",
  },
});
module.exports = mongoose.model("assignment_tbl", assignment_Schema);

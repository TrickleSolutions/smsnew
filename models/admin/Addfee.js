const mongoose = require("mongoose");
const Addfee_Schema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  regno: {
    type: Number,
    //   required: true,
  },

  contact: {
    type: Number,
    // required: true,
  },
  course: {
    type: String,
    //  required: true,
  },
  total: {
    type: Number,
    //  required: true,
  },

  paid: {
    type: Number,
    //   required: true,
  },
  contact: {
    type: Number,
    //  required:true
  },
  pending: {
    type: Number,
    //  required:true
  },
  mode: {
    type: String,
    //   required:true
  },
  trans_id: {
    type: String,
    //  required:true
  },
});
module.exports = mongoose.model("Addfee_tbl", Addfee_Schema);

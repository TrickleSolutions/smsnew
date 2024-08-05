const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    id: String,
    seq: Number,
  },
  {
    timestamps: true,
  }
);

const EnquiryNo = model("enquiry-no", schema);

module.exports = EnquiryNo;

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

const RecieptId = model("reciept-ids", schema);

module.exports = RecieptId;

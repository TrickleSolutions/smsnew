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

const CertificateNumber = model("certificate-no", schema);

module.exports = CertificateNumber;

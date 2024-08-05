const { Schema, model, default: mongoose } = require("mongoose");

const schema = new Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "student_registers" },
    data: {
      type: Object,
      required: true,
    },
    sr_no: {
      type: String,
      required: true,
    },
    certificate: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course_admins",
    },
  },
  {
    timestamps: true,
  }
);

const CertificateModel = model("cetificates", schema);

module.exports = CertificateModel;

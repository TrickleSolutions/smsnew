const { model, Schema, default: mongoose } = require("mongoose");

const schema = new Schema(
  {
    recieptId: {
      type: String,
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student_registers",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course_admins",
    },
    amount: {
      type: Number,
    },
    remark: {
      type: String,
    },
    fee_of: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const ExamFeeRecieptModel = model("exam-fee-reciepts", schema);

module.exports = ExamFeeRecieptModel;

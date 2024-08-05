const { default: mongoose } = require("mongoose");
const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instructorregisters",
    },
    batchTime: {
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
        required: true,
      },
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course_admins",
    },
    students: [
      { type: mongoose.Schema.Types.ObjectId, ref: "student_registers" },
    ],
  },
  {
    timestamps: true,
  }
);

const BatchModel = model("batches", schema);

module.exports = BatchModel;

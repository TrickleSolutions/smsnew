const { model, Schema, default: mongoose } = require("mongoose");

const Plan = new Schema(
  {
    day: {
      type: Number,
      required: true,
    },
    theory: {
      type: String,
    },
    practical: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    // studentRemark: [
    //   { type: mongoose.Schema.Types.ObjectId, ref: "student_registers" },
    // ],
    // teacherRemark: [
    //   { type: mongoose.Schema.Types.ObjectId, ref: "instructorregisters" },
    // ],
  },
  {
    timestamps: true,
  }
);

const schema = new Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course_admin",
    },
    plan: {
      type: [Plan],
    },
  },
  {
    timestamps: true,
  }
);

const DayByDayModel = model("day-by-days", schema);

module.exports = DayByDayModel;

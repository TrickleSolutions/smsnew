const { default: mongoose } = require("mongoose");
const { model, Schema } = require("mongoose");

const Plan = new Schema(
  {
    day: {
      type: Number,
      required: true,
    },
    theory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "new_course_lessions",
      },
    ],
    practical: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "new_course_lessions",
      },
    ],
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
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

const NewDayByDayModel = model("new_day_by_day", schema);

module.exports = NewDayByDayModel;

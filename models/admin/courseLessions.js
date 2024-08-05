const { model, Schema, default: mongoose } = require("mongoose");

const schema = new Schema(
  {
    lession_no: {
      type: Number,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course_admins",
    },
    uploads: {
      type: Array,
    },

    title: {
      type: String,
      required: true,
      index: "text",
    },
    subtitle: {
      type: Array,
    },
    downloaded: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const CourseLessionModel = model("course_lessions", schema);

module.exports = CourseLessionModel;

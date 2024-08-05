const { model, Schema, default: mongoose } = require("mongoose");

const TopicSchema = new Schema({
  day: {
    type: Number,
    required: true,
  },
  topics: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
});

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
    subject: {
      title: String,
      daycounts: {
        type: Number,
        default: function () {
          return this.topic?.length;
        },
      },
    },
    topic: [TopicSchema],
    instructorList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "instructorregisters",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const NewCourseLessionSchema = model("new_course_lessions", schema);

module.exports = NewCourseLessionSchema;

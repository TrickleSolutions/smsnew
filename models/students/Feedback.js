const { default: mongoose } = require("mongoose");
const { model, Schema } = require("mongoose");

const schema = new Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student_registers",
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FeedBackModel = model("feedbacks", schema);

module.exports = FeedBackModel;

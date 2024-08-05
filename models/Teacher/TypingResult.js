const { default: mongoose } = require("mongoose");
const { model, Schema } = require("mongoose");

const TypingSchema = new Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student_registers",
    },
    regno: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
    typingLang: {
      type: String,
      enum: ["english", "hindi"],
    },
    fname: {
      type: String,
    },
    speed: {
      type: Number,
    },
    accuracy: {
      type: Number,
    },
    from: {
      type: Date,
    },
    to: {
      type: Date,
    },
    total_marks: {
      type: Number,
      // required: true,
    },
    obtain_marks: {
      type: Number,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TypingModel = model("typing-results", TypingSchema);

module.exports = TypingModel;

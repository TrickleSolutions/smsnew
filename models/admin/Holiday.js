const { model, Schema } = require("mongoose");

const schema = new Schema(
  {
    name: {
      type: String,
    },
    from: {
      type: Date,
    },
    to: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const HolidayModel = model("holidays", schema);

module.exports = HolidayModel;

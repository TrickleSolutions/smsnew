const { model, Schema } = require("mongoose");

const schema = new Schema(
  {
    img: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const SliderModel = model("home-slider", schema);

module.exports = SliderModel;

const { model, Schema } = require("mongoose");

const schema = new Schema(
  {
    year: {
      type: Number,
      unique: true,
      required: true,
    },
    openingBalance: {
      type: Number,
      required: true,
    },
    totalExpense: {
      type: Number,
      required: true,
      default: 0,
    },
    totalIncome: {
      type: Number,
      required: true,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    closingBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["running", "close"],
      default: "running",
    },
  },
  {
    timestamps: true,
  }
);

const CashBookYearModel = model("cashbooks", schema);

module.exports = CashBookYearModel;

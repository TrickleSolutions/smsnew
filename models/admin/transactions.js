const { model, Schema } = require("mongoose");

const TransactionsSchema = new Schema(
  {
    discrption: {
      type: String,
    },
    incomeType: {
      type: String,
      enum: ["debit", "credit"],
      default: "debit",
    },
    source: {
      type: String,
    },
    amount: {
      type: Number,
    },
    dateTime: {
      type: Date,
    },
    approved: {
      type: Boolean,
      default: function () {
        return this.incomeType !== "debit"; // Return true for credit, false otherwise
      },
    },
  },
  {
    timestamps: true,
  }
);

const TransactionsModel = model("transactions", TransactionsSchema);

module.exports = TransactionsModel;

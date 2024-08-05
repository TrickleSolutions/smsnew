const { model, Schema, default: mongoose } = require("mongoose");
const TransactionsModel = require("./transactions");

const schema = new Schema(
  {
    year: {
      type: Number,
      required: true,
      unique: true,
    },
    OpeningBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    ClosingBalance: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    totalExpense: {
      type: Number,
      default: 0,
    },
    totalIncome: {
      type: Number,
      default: 0,
    },
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "transactions" },
    ],
  },
  {
    timestamps: true,
  }
);

const CashbookModel = model("cash_ledger", schema);

module.exports = CashbookModel;

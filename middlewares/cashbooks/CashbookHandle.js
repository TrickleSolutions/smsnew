const { EventEmitterAsyncResource } = require("nodemailer/lib/xoauth2");
const CashbookModel = require("../../models/admin/Cashbook");
const joi = require("joi");
const TransactionsModel = require("../../models/admin/transactions");
const { default: mongoose } = require("mongoose");
const CashBookYearModel = require("../../models/admin/CashLedgerYear");

const handleCashbook = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();

    if (parseInt(req.params.year) !== currentYear) {
      return res.status(400).json({
        error: "You are adding a transaction for another financial year.",
      });
    }

    const [_checktheFincialTable, _perviousFinalcialTable] = await Promise.all([
      await CashbookModel.findOne({ year: currentYear }),
      await CashbookModel.find({ year: { $lt: currentYear } }),
    ]);

    if (!_checktheFincialTable) {
      let openingBalance = 0;

      if (_perviousFinalcialTable.length !== 0) {
        openingBalance = _perviousFinalcialTable[0].ClosingBalance;
      }

      const _createNew = await new CashbookModel({
        year: currentYear,
        OpeningBalance: openingBalance,
      }).save();

      if (_createNew) {
        req.Cashbook = _createNew;
        return next();
      }
    }

    req.Cashbook = _checktheFincialTable;
    return next();
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

const HandleCascade = async (req, res, next) => {
  const currentYear = new Date().getFullYear();

  switch (req.method) {
    // if the request to enter transaction
    case "POST":
      let _findCashbook;
      const [_CashbookData, _PreviousYearCashbook] = await Promise.all([
        CashbookModel.findOne({ year: currentYear }),
        CashbookModel.find({ year: { $lt: req.params.year } }),
      ]);
      if (!_CashbookData) {
        const formdata = req.body;
        const validate = await DataValidate(formdata);
        if (validate.error)
          return res
            .status(400)
            .json({ error: true, message: validate.message });
        const totalIncome =
          formdata.incomeType === "debit" ? parseFloat(formdata.amount) : 0;
        const totalExpense =
          formdata.incomeType === "credit" ? parseFloat(formdata.amount) : 0;

        _findCashbook = await new CashbookModel({
          year: currentYear,
          OpeningBalance: _PreviousYearCashbook[0].ClosingBalance,
          ClosingBalance:
            _PreviousYearCashbook[0].ClosingBalance +
            totalIncome -
            totalExpense,
          totalIncome: totalIncome,
          totalExpense: totalExpense,
          totalRevenue: totalIncome - totalExpense,
        }).save();
      } else {
        const formdata = req.body;
        const validate = await DataValidate(formdata);
        if (validate.error)
          return res
            .status(400)
            .json({ error: true, message: validate.message });
        const totalIncome =
          formdata.incomeType === "debit" ? parseFloat(formdata.amount) : 0;
        const totalExpense =
          formdata.incomeType === "credit" ? parseFloat(formdata.amount) : 0;

        const finalTotalIncome =
          parseFloat(_CashbookData.totalIncome) + totalIncome;

        const finalTotalExpense =
          parseFloat(_CashbookData.totalExpense) + totalExpense;

        _findCashbook = await CashbookModel.findOneAndUpdate(
          {
            year: currentYear,
          },
          {
            totalIncome: finalTotalIncome,
            totalExpense: finalTotalExpense,
            totalRevenue: finalTotalIncome - finalTotalExpense,
            ClosingBalance:
              _CashbookData.OpeningBalance +
              finalTotalIncome -
              finalTotalExpense,
          },
          { new: true }
        );
      }
      req.Cashbook = _findCashbook;
      return next();
    case "GET":
      return next();
    case "PATCH":
      let transid = req.params.id;
      const status = req.query;

      const validate = UpdateStatusValidate(status);
      if (validate.error)
        return res.status(400).json({ error: true, message: validate.message });

      const [_transDetials, _cashLedger] = await Promise.all([
        TransactionsModel.findById(transid),
        CashbookModel.findOne({ year: currentYear }),
      ]);
      if (!_cashLedger)
        return res.status(403).json({
          error: true,
          message: "only current month Expense status Change is allowed ",
        });
      if (_transDetials.approved === status.status) {
        return next();
      }

      if (_transDetials.approved === true && status.status === false) {
        if (_transDetials.incomeType === "debit") {
          const totalIncome = _cashLedger.totalIncome - _transDetials.amount;
          const _updated = await CashbookModel.findOneAndUpdate(
            { year: currentYear },
            {
              totalIncome: totalIncome,
              totalExpense: _cashLedger.totalExpense,
              totalRevenue: totalIncome - _cashLedger.totalExpense,
              ClosingBalance:
                _cashLedger.OpeningBalance +
                totalIncome -
                _cashLedger.totalExpense,
            },
            { new: true }
          );
          if (_updated) {
            req.Cashbook = _updated;
            return next();
          }
        } else if (_transDetials.incomeType === "credit") {
          const totalExpense = _cashLedger.totalExpense - _transDetials.amount;
          const totalIncome = _cashLedger.totalIncome;
          const _updated = await CashbookModel.findOneAndUpdate(
            { year: currentYear },
            {
              totalIncome: totalIncome,
              totalExpense: totalExpense,
              totalRevenue: totalIncome - totalExpense,
              ClosingBalance:
                _cashLedger.OpeningBalance + totalIncome - totalExpense,
            },
            { new: true }
          );
          if (_updated) {
            req.Cashbook = _updated;
            return next();
          }
        }
      } else if (_transDetials.approved === false && status.status === true) {
        if (_transDetials.incomeType === "debit") {
          const totalIncome = _cashLedger.totalIncome + _transDetials.amount;
          const totalExpense = _cashLedger.totalExpense;
          const _updated = await CashbookModel.findOneAndUpdate(
            { year: currentYear },
            {
              totalIncome: totalIncome,
              totalExpense: totalExpense,
              totalRevenue: totalIncome - totalExpense,
              ClosingBalance:
                _cashLedger.OpeningBalance + totalIncome - totalExpense,
            },
            { new: true }
          );
          if (_updated) {
            req.Cashbook = _updated;
            return next();
          }
        } else if (_transDetials.incomeType === "credit") {
          const totalExpense = _cashLedger.totalExpense + _transDetials.amount;
          const totalIncome = _cashLedger.totalIncome;
          const _updated = await CashbookModel.findOneAndUpdate(
            { year: currentYear },
            {
              totalIncome: totalIncome,
              totalExpense: totalExpense,
              totalRevenue: totalIncome - totalExpense,
              ClosingBalance:
                _cashLedger.OpeningBalance + totalIncome - totalExpense,
            },
            { new: true }
          );
          if (_updated) {
            req.Cashbook = _updated;
            return next();
          }
        }
      } else {
        req.Cashbook = _cashLedger;
        return next();
      }

      return next();

    case "DELETE":
      const { id } = req.params;
      const [_transactionDetails, _cashbookdata] = await Promise.all([
        TransactionsModel.findById(id),
        CashbookModel.findOne({ year: currentYear }),
      ]);
      if (!_cashbookdata)
        return res.status(403).json({
          error: true,
          message:
            "Opps You are trying to delete previous balance sheet details ",
        });
      const totalIncome =
        _transactionDetails.incomeType === "debit"
          ? _cashbookdata.totalIncome - _transactionDetails.amount
          : _cashbookdata.totalIncome;
      const totalExpense =
        _transactionDetails.incomeType === "credit"
          ? _cashbookdata.totalExpense - _transactionDetails.amount
          : _cashbookdata.totalExpense;
      const _updateChange = await CashbookModel.findOneAndUpdate(
        { year: currentYear },
        {
          totalIncome: totalIncome,
          totalExpense: totalExpense,
          totalRevenue: totalIncome - totalExpense,
          ClosingBalance:
            _cashbookdata.OpeningBalance + totalIncome - totalExpense,
        },
        { new: true }
      );
      req.Cashbook = _updateChange;
      return next();
    default:
      break;
  }
  next();
};

const DataValidate = async (formdata) => {
  const ValidateSchema = joi.object({
    discrption: joi.string().required(),
    incomeType: joi.string().required().valid("debit", "credit"),
    source: joi.string(),
    amount: joi.number().required(),
    dateTime: joi.string().isoDate(),
  });

  const { error } = ValidateSchema.validate(formdata);
  if (error) return { error: true, message: error.details[0].message };
  return { error: false, message: "success" };
};

const UpdateStatusValidate = async (body) => {
  const validateSchema = joi.object({
    status: joi.boolean().required(true),
  });

  const { error } = validateSchema.validate(body);
  if (error) return { error: true, message: error.details[0].message };
  return { error: false, message: "success" };
};

const updateTheCashbook = async (year) => {
  try {
    const incomes = await TransactionsModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00Z`),
            $lte: new Date(`${year}-12-31T23:59:59Z`),
          },
          approved: true,
        },
      },
      {
        $group: {
          _id: "$incomeType",
          amount: { $sum: "$amount" },
        },
      },
    ]);
    console.log(incomes);

    const findIncome = (type) =>
      incomes?.find((item) => item._id === type)?.amount || 0;

    const totalIncome = findIncome("credit");
    const totalExpense = findIncome("debit");
    const totolRevenue = totalIncome - totalExpense;

    const cashbookData = await CashBookYearModel.findOne({ year: year });

    await CashBookYearModel.findOneAndUpdate(
      { year: year },
      {
        totalExpense: totalExpense,
        totalIncome: totalIncome,
        totalRevenue: totolRevenue,
        closingBalance:
          cashbookData.openingBalance + totalIncome - totalExpense,
      },
      { new: true }
    );
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { handleCashbook, HandleCascade, updateTheCashbook };

const cron = require("node-cron");
const CashBookYearModel = require("../models/admin/CashLedgerYear");

const CreateFinancialYearAndCloseLastYear = async () => {
  try {
    // Find the previous year's Cashbook
    const previousYearCashBooks = await CashBookYearModel.find({}).sort({
      year: -1,
    });

    const currentYear = new Date().getFullYear();
    const previousYear = previousYearCashBooks[0].year;
    const updatedYear =
      previousYear <= currentYear ? currentYear + 1 : currentYear;

    const [_closedPrevious, _CreatedNew] = await Promise.all([
      CashBookYearModel.findByIdAndUpdate(
        previousYearCashBooks[0]._id,
        {
          status: "close",
        },
        { new: true }
      ),
      new CashBookYearModel({
        openingBalance: previousYearCashBooks[0].closingBalance,
        closingBalance: previousYearCashBooks[0].closingBalance,
        year: updatedYear,
      }).save(),
    ]);

    if (_closedPrevious && _CreatedNew)
      return console.log(
        `financial year ${previousYear} was closed successfully and created new financial Year ${updatedYear}`
      );

    console.log("Financial year created successfully.");
  } catch (error) {
    // Handle specific error types
    if (error) {
      console.log("Specific error occurred:", error.message);
    } else {
      console.log("An error occurred:", error.message);
    }
  }
};

// set the auto financial Year Change on 31 dec 11 pm every year

// cron.schedule("* * * * *" , CreateFinancialYearAndCloseLastYear)
cron.schedule("0 23 31 12 *", CreateFinancialYearAndCloseLastYear);

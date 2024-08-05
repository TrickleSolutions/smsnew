const RecieptId = require("../models/RecieptId");

const GenerateRecieptId = async () => {
  let SeqData;
  SeqData = await RecieptId.findOneAndUpdate(
    {},
    { $inc: { seq: 1 } },
    { new: true }
  );

  if (!SeqData) {
    SeqData = await new RecieptId({
      id: "SMS",
      seq: 0,
    }).save();
  }
  SeqData.seq++;
  return `SMS${SeqData.seq.toString().padStart(4, "0")}`;
};

module.exports = GenerateRecieptId;

const EnquiryNo = require("../models/enquiryNumber");

const generateEnquiryNo = async () => {
  let SeqData;
  SeqData = await EnquiryNo.findOneAndUpdate(
    {},
    { $inc: { seq: 1 } },
    { new: true }
  );

  if (!SeqData) {
    SeqData = await new EnquiryNo({
      id: "EN",
      seq: 2100,
    }).save();
  }
  SeqData.seq++;
  return `${SeqData.seq.toString().padStart(4, "0")}`;
};

module.exports = generateEnquiryNo;

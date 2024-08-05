const CertificateNumber = require("../models/certificateNumber");
const CourseSchema = require("./../models/admin/Add_Course");

const GenerateCertificatesNumber = async (data, admissionDate) => {
  const calclulate = await calculateTotalDurationInMonths(data);
  const startDate = await new Date(admissionDate).getFullYear();

  const endDate = new Date(admissionDate);
  endDate.setMonth(endDate.getMonth() + calclulate);

  // Get the year of the resulting date
  const endYear = endDate.getFullYear();

  const sessionYear = `${startDate}${endYear}`;

  const date = new Date().getFullYear();
  let SeqData;
  SeqData = await CertificateNumber.findOneAndUpdate(
    {},
    { $inc: { seq: 1 } },
    { new: true }
  );

  if (!SeqData) {
    SeqData = await new CertificateNumber({
      id: sessionYear,
      seq: 0,
    }).save();
  }
  SeqData.seq++;
  return `${sessionYear}${SeqData.seq.toString().padStart(4, "0")}`;
};

function calculateTotalDurationInMonths(data) {
  let totalMonths = 0;

  data.forEach((entry) => {
    const match = entry.match(/(\d+)\s*(year|month)s?/i);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();

      if (unit === "year") {
        totalMonths += value * 12;
      } else {
        totalMonths += value;
      }
    }
  });

  return totalMonths;
}

module.exports = GenerateCertificatesNumber;

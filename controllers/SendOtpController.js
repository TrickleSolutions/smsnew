const { default: axios } = require("axios");
const VerifyModel = require("../models/VerifyModel");

function generateOTP() {
  // Generate a random number between 1000 and 9999
  const otp = Math.floor(Math.random() * 9000) + 1000;
  return otp;
}

const msgFormat = (number, otp) => {
  const query = {
    key: "564E06C89106D7",
    campaign: "11704",
    routeid: "37",
    type: "text",
    senderid: "AIRCAM",
    contacts: number,
    msg: `Dear Customer your OTP is- ${otp} Please do not share your OTP anyone.`,
    template_id: "1207161520274849189",
  };

  // Convert it to the query string
  const queryString = new URLSearchParams(query).toString();
  return queryString;
};

module.exports = async (req, res) => {
  try {
    const { number } = req.query;

    const otp = generateOTP();
    const generatedString = msgFormat(number, otp);

    const smsApiUrl = "http://byebyesms.com/app/smsapi/index.php?";
    const response = await axios.get(smsApiUrl + generatedString);
    // console.log(smsApiUrl + generatedString);

    if (response.status === 200) {
      const isReqStored = await new VerifyModel({
        otp: otp,
        otpid: response.data,
        otpExpireTime: Date.now() + 40000,
      }).save();

      if (!isReqStored) {
        return res
          .status(400)
          .json({ error: true, message: "Failed to send OTP" });
      }
      res.status(200).json({
        error: false,
        message: "OTP sent successfully",
        data: isReqStored.otpid,
      });
    } else {
      res
        .status(response.status)
        .json({ error: true, message: "Failed to send OTP" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

const mongoose = require("mongoose");
const Enquiry_adminSchema = new mongoose.Schema(
  {
    enquiryNo: {
      type: String,
    },
    name: {
      type: String,
      // required: true,
    },
    fname: {
      type: String,
      //   required: true,
    },

    address: {
      type: String,
      // required: true,
    },
    dob: {
      type: String,
      //  required: true,
    },
    maritalStatus: {
      type: String,
    },
    course: {
      type: String,
      //   required: true,
    },
    contact: {
      type: Number,
      //  required:true
    },
    email: {
      type: String,
      //  required:true
    },
    ref_by: {
      type: String,
      //   required:true
    },
    gender: {
      type: String,
      //  required:true
    },
    counseller: {
      type: String,
      //  required:true
    },
    note: {
      type: String,
      //  required:true
    },
    academicQualifications: {
      type: String,
    },
    computerAwareness: {
      type: String,
    },
    previousknowledge: {
      type: String,
    },
    pdClasses: {
      type: Boolean,
    },
    carrierClasses: {
      type: Boolean,
    },
    status: {
      type: String,
      enum: ["pending", "joined", "not-interested"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Enquiry_admin", Enquiry_adminSchema);

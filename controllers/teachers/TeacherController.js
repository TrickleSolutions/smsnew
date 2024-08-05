const InstructorRegisterSchema = require("../../models/admin/InstructorModel");
const resultSchema = require("../../models/Teacher/ResultST");
const Sheduleclass_Schema = require("../../models/Teacher/Schedule_Class");
const assignment_Schema = require("../../models/Teacher/Add_Assignment");
const AddFeeSchema = require("../../models/Teacher/Add_fee");
const crypto = require("crypto");
const Handlebars = require("handlebars");
const Functions = require("../../library/functions");
const nodemailer = require("nodemailer");
const EventsSchema = require("../../models/Teacher/Events");
const QueriesSchema = require("../../models/students/Queries");
const AcademicSchema = require("../../models/students/Academicjs");
const stStatusReqSchema = require("../../models/Teacher/Student_status_req");
const COurseContentLinkSchema = require("../../models/Teacher/CourseContentLink");
const COurseContentDocxSchema = require("../../models/Teacher/CourseContentdoc");
const CourseSchema = require("../../models/admin/Add_Course");
const COurseContentVedioSchema = require("../../models/Teacher/CourseConent_vadio");
const VerifyModel = require("../../models/VerifyModel");
const GenerateRecieptId = require("../../funcs/RecieptNumbergenerater");
const ExamFeeRecieptModel = require("../../models/Teacher/ExamFeeReciept");
const Reciept = require("./invoice");
const TypingModel = require("../../models/Teacher/TypingResult");
const { default: mongoose } = require("mongoose");
const StudentModel = require("../../models/students/StudentModel");
// const loginInstructor=async(req,resp,next)=>{
//     try {
//       const email = req.body.email;
//       const password = req.body.password;
//       const usermail = await InstructorRegisterSchema.findOne({
//         email: email,
//         password: password,
//       });
//       if (usermail) {
//         resp.status(200).json({
//           code: 200,
//           message: "user Login successfully",
//           data: {
//             _id: usermail._id,
//             name: usermail.name,
//             email: usermail.email,
//             contact: usermail.contact,
//           },
//           error: false,
//           status: true,
//         });
//         console.log(usermail._id);
//       } else {
//         resp.status(404).json({
//           code: 404,
//           message: "Invalid User details, Try Again.  ",
//           data: [],
//           error: false,
//           status: false,
//         });
//       }
//       } catch (err) {
//         console.log(err);
//       }
// }
const loginInstructor = async (req, res) => {
  const { contact, otp, otpid } = req.query;

  try {
    if (!contact || !otp || !otpid)
      return res
        .status(400)
        .json({ error: true, message: "invalid credentials" });

    // find the user
    const isUser = await InstructorRegisterSchema.findOne({ contact: contact });
    if (!isUser)
      return res.status(404).json({ error: true, message: "No user found" });
    // Verify the OTP
    const verifiedOtp = await VerifyModel.findOne({
      otp: otp,
      otpid: otpid,
      otpExpireTime: { $gt: Date.now() },
    });

    if (!verifiedOtp) {
      return res
        .status(404)
        .json({ error: true, message: "Invalid OTP or OTP expired" });
    }

    res.status(200).json({
      code: 200,
      message: "user Login successfully",
      data: {
        _id: isUser._id,
        name: isUser.name,
        email: isUser.email,
        contact: isUser.contact,
      },
      error: false,
      status: true,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error during login:", error);
    res.status(500).json({ error: true, message: error.message });
  }

  // try {

  //   const email = req.body.email;
  //   const password = req.body.password;
  //   const usermail = await InstructorRegisterSchema.findOne({
  //     email: email,
  //     password: password,
  //   });
  //   if (usermail) {
  //     resp.status(200).json({
  //       code: 200,
  //       message: "user Login successfully",
  //       data: {
  //         _id: usermail._id,
  //         name: usermail.name,
  //         email: usermail.email,
  //         contact: usermail.contact,
  //       },
  //       error: false,
  //       status: true,
  //     });
  //     console.log(usermail._id);
  //   } else {
  //     resp.status(404).json({
  //       code: 404,
  //       message: "Invalid User details, Try Again.  ",
  //       data: [],
  //       error: false,
  //       status: false,
  //     });
  //   }
  // } catch (err) {
  //   console.log(err);
  // }
};

const createAddFee = async (req, res) => {
  const { regno, name, amount, mode, transId, paid, date, course } = req.body;
  let data = new AddFeeSchema({
    regno,
    name,
    amount,
    mode,
    transId,
    paid,
    date,
    course,
  });

  let result = await data.save();
  res.status(200).json({
    code: 200,
    message: "  Result Created successfully",
    error: false,
    status: true,
  });
};

const putAddFee = async (req, res) => {
  try {
    const { regno, name, amount, mode, transId, paid, date, course } = req.body;

    let data = await AddFeeSchema.updateOne(
      { regno: req.params.regno },
      {
        $set: { regno, name, amount, mode, transId, paid, date, course },
      }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const delAddFee = async (req, res) => {
  try {
    console.log(req.params);
    let data = await AddFeeSchema.deleteOne({ regno: req.params.regno });
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const getAllAddFee = async (req, res) => {
  let data = await AddFeeSchema.find();
  res.send(data);
};
const getsingleFee = async (req, res) => {
  let data = await AddFeeSchema.find({ regno: req.params.regno });
  res.send(data);
};
const getFee = async (req, res) => {
  let data = await AddFeeSchema.find();
  res.send(data);
};
const gettotalpaidFee = async (req, res) => {
  //let r=await AddFeeSchema.find({regno:req.params.regno});
  // res.send(data)
  let regno = req.params.regno;
  let data = await AddFeeSchema.aggregate([
    {
      $group: { _id: "$regno", totalpaid: { $sum: "$paid" } },
    },
  ]);
  res.send(data);
};
{
  /*  RESULT SECTION */
}
const createResult = async (req, res) => {
  const data = req.body;
  try {
    // file the already final result is uploaded or not
    const uploaded = await resultSchema.findOne({
      regno: data?.regno,
      course: data?.course,
      resultType: "final",
    });

    if (uploaded)
      return res.status(409).json({
        error: true,
        message: "already final result upload of this course for this student",
      });

    const response = await new resultSchema(data).save();
    if (!response)
      return res
        .status(404)
        .json({ error: true, message: "result not created" });

    res.status(200).json({
      code: 200,
      message: "  Result Created successfully",
      error: false,
      status: true,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const putResult = async (req, res) => {
  const { regno } = req.params;
  try {
    const formdata = req.body;
    const [uploaded, findData] = await Promise.all([
      resultSchema.findOne({
        regno: formdata?.regno,
        course: formdata?.course,
        resultType: "final",
      }),
      resultSchema.findOne({
        regno: regno,
      }),
    ]);

    if (uploaded) {
      if (uploaded.regno !== findData.regno) {
        if (formdata?.resultType === "final")
          return res.status(409).json({
            error: true,
            message: "already final result for this course is uploaded ",
          });
      }
    }

    const data = await resultSchema.findByIdAndUpdate(
      { _id: findData?._id },
      { ...formdata },
      { new: true }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const delResult = async (req, res) => {
  try {
    console.log(req.params);
    let data = await resultSchema.deleteOne({ regno: req.params.regno });
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const getAllResult = async (req, res) => {
  try {
    let data = await resultSchema.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: "student_registers",
          localField: "student",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
    ]);
    res.send(data);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
const getsingleResult = async (req, res) => {
  let data = await resultSchema.find({ regno: req.params.regno });
  res.send(data);
};

const GetResultUploadStudent = async (req, res) => {
  const { id } = req.params;
  const { certificate } = req.query;
  try {
    const response = await resultSchema.findByIdAndUpdate(id, {
      certificate: certificate,
    });
    if (!response)
      return res.status(400).json({ error: true, message: response });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

{
  /*     ScheduleClas */
}
const getAllScheduleClass = async (req, res) => {
  let data = await Sheduleclass_Schema.find();
  res.send(data);
};
const createScheduleClass = async (req, res) => {
  const { topic, course, time, date, contact_instructor, link } = req.body;
  let data = new Sheduleclass_Schema({
    topic,
    course,
    time,
    date,
    contact_instructor,
    link,
  });

  await data.save();
  res.status(200).json({
    code: 200,
    message: "  Class Scheduled successfully",
    error: false,
    status: true,
  });
};

const putScheduleClass = async (req, res) => {
  try {
    const { topic, course, time, date, contact_instructor, link } = req.body;

    let data = await Sheduleclass_Schema.updateOne(
      { contact_instructor: req.params.contact_instructor },
      {
        $set: { topic, course, time, date, contact_instructor, link },
      }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const delScheduleClass = async (req, res) => {
  try {
    console.log(req.params);
    let data = await Sheduleclass_Schema.deleteOne({
      contact_instructor: req.params.contact_instructor,
    });
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

{
  /*     ADD ASSGINMENT */
}
const getAssignment = async (req, res) => {
  let data = await assignment_Schema.find();
  res.send(data);
};
const createAssignment = async (req, res) => {
  const { title, instructions, due_date, contact_instructor, upload } =
    req.body;
    const uploads = req.file.filename;
  let data = new assignment_Schema({
    title,
    instructions,
    due_date,
    upload: uploads,
    contact_instructor,
  });

  await data.save();
  res.status(200).json({
    code: 200,
    message: "  Assignment created successfully",
    error: false,
    status: true,
  });
};

const putAssignment = async (req, res) => {
  try {
    const { title, instructions, due_date, contact_instructor, upload } =
      req.body;

    let data = await assignment_Schema.updateOne(
      { contact_instructor: req.params.contact_instructor },
      {
        $set: { title, instructions, due_date, upload, contact_instructor },
      }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const delAssignment = async (req, res) => {
  try {
    let data = await assignment_Schema.deleteOne({
      contact_instructor: req.params.contact_instructor,
    });
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const createEvent = async (req, resp) => {
  try {
    const img = req.file.filename;

    const { event, desc, from, to } = req.body;
    let data = new EventsSchema({ event, desc, from, to, img });
    let result = await data.save();
    resp.send(result);
  } catch (err) {
    console.log(err);
  }
};

const getEvent = async (req, res) => {
  let data = await EventsSchema.find();
  res.send(data);
};
const getSingleEvent = async (req, res) => {
  let data = await EventsSchema.find({ _id: req.params._id });

  res.send(data);
};

const deleteEvent = async (req, resp) => {
  try {
    console.log(req.params);
    let data = await EventsSchema.deleteOne({ _id: req.params._id });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};
const putEvent = async (req, res) => {
  try {
    const img = req.file.filename;

    const { event, desc, from, to } = req.body;
    let data = await EventsSchema.updateOne(
      { _id: req.params._id },
      { $set: { event, desc, from, to, img } }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

const createQuery = async (req, resp) => {
  try {
    const { regno, name, query, date, status, response } = req.body;
    let data = new QueriesSchema({
      regno,
      name,
      query,
      date,
      status,
      response,
    });
    let result = await data.save();
    resp.send(result);
  } catch (err) {
    console.log(err);
  }
};

const getQuery = async (req, res) => {
  let data = await QueriesSchema.find();
  res.send(data);
};
const getSingleQuery = async (req, res) => {
  let data = await QueriesSchema.find({ regno: req.params.regno });

  res.send(data);
};

const deleteQuery = async (req, resp) => {
  try {
    console.log(req.params);
    let data = await QueriesSchema.deleteOne({ _id: req.params._id });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};
const putQuery = async (req, res) => {
  try {
    const { regno, name, query, date, status, response } = req.body;
    let data = await QueriesSchema.updateOne(
      { _id: req.params._id },
      { $set: { regno, name, query, date, status, response } }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const createAcademic = async (req, resp) => {
  try {
    const { student, course } = req.body;
    let data = new AcademicSchema({ student, course });
    let result = await data.save();
    resp.send(result);
  } catch (err) {
    console.log(err);
  }
};

const getAcademic = async (req, res) => {
  let data = await AcademicSchema.find();
  res.send(data);
};
const getSingleAcademic = async (req, res) => {
  let data = await AcademicSchema.find({ _id: req.params._id });

  res.send(data);
};

const deleteAcademic = async (req, resp) => {
  try {
    console.log(req.params);
    let data = await AcademicSchema.deleteOne({ _id: req.params._id });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};
const putAcademic = async (req, res) => {
  try {
    const { student, course } = req.body;
    let data = await AcademicSchema.updateOne(
      { _id: req.params._id },
      { $set: { student, course } }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

const createContentVideo = async (req, resp) => {
  try {
    const video = req.file.filename;
    const { name, duration, course, desc } = req.body;
    let data = new COurseContentVedioSchema({
      name,
      duration,
      video,
      course,
      desc,
    });
    let result = await data.save();
    resp.send(result);
  } catch (err) {
    console.log(err);
  }
};

const getContentVideo = async (req, res) => {
  let data = await COurseContentVedioSchema.find();
  res.send(data);
};
const getSingleContentVideo = async (req, res) => {
  let data = await COurseContentVedioSchema.find({ _id: req.params._id });

  res.send(data);
};

const deleteContentVideo = async (req, resp) => {
  try {
    console.log(req.params);
    let data = await COurseContentVedioSchema.deleteOne({
      _id: req.params._id,
    });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};
const putContentVideo = async (req, res) => {
  try {
    const video = req.file.filename;
    const { name, duration, course, desc } = req.body;
    let data = await COurseContentVedioSchema.updateOne(
      { _id: req.params._id },
      { $set: { name, duration, video, course, desc } }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

const createContentDoc = async (req, resp) => {
  try {
    const doc = req.file.filename;
    const { name, course } = req.body;
    let data = new COurseContentDocxSchema({ name, doc, course });
    let result = await data.save();
    resp.send(result);
  } catch (err) {
    console.log(err);
  }
};

const getContentDoc = async (req, res) => {
  let data = await COurseContentDocxSchema.find();
  res.send(data);
};
const getSingleContentDoc = async (req, res) => {
  let data = await COurseContentDocxSchema.find({ _id: req.params._id });

  res.send(data);
};

const deleteContentDoc = async (req, resp) => {
  try {
    console.log(req.params);
    let data = await COurseContentDocxSchema.deleteOne({ _id: req.params._id });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};
const putContentDoc = async (req, res) => {
  try {
    const doc = req.file.filename;
    const { name, course } = req.body;
    let data = await COurseContentDocxSchema.updateOne(
      { _id: req.params._id },
      { $set: { name, doc, course } }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

const createContentLink = async (req, resp) => {
  try {
    const { name, link, course } = req.body;
    let data = new COurseContentLinkSchema({ name, link, course });
    let result = await data.save();
    resp.send(result);
  } catch (err) {
    console.log(err);
  }
};

const getContentLink = async (req, res) => {
  let data = await COurseContentLinkSchema.find();
  res.send(data);
};
const getSingleContentLink = async (req, res) => {
  let data = await COurseContentLinkSchema.find({ _id: req.params._id });

  res.send(data);
};

const deleteContentLink = async (req, resp) => {
  try {
    console.log(req.params);
    let data = await COurseContentLinkSchema.deleteOne({ _id: req.params._id });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};
const putContentLink = async (req, res) => {
  try {
    const { name, link, course } = req.body;
    let data = await COurseContentLinkSchema.updateOne(
      { _id: req.params._id },
      { $set: { name, link, course } }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const createStStatusReq = async (req, resp) => {
  try {
    const { regno, name, status } = req.body;
    let data = new stStatusReqSchema({ regno, name, status });
    let result = await data.save();
    resp.send(result);
  } catch (err) {
    console.log(err);
  }
};

const getStStatusReq = async (req, res) => {
  let data = await stStatusReqSchema.find();
  res.send(data);
};
const getSingleStStatusReq = async (req, res) => {
  let data = await stStatusReqSchema.find({ _id: req.params._id });

  res.send(data);
};

const deleteStStatusReq = async (req, resp) => {
  try {
    console.log(req.params);
    let data = await stStatusReqSchema.deleteOne({ _id: req.params._id });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};
const putStStatusReq = async (req, res) => {
  try {
    const { regno, name, status } = req.body;
    let data = await stStatusReqSchema.updateOne(
      { _id: req.params._id },
      { $set: { regno, name, status } }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

const GetCreateFee = async (req, res) => {
  const { regno } = req.params;
  const data = req.body;
  let pending_amount;
  const _find = await AddFeeSchema.find({
    course: data.course,
    regno: regno,
  });
  if (_find) {
    const paidAmount = _find?.reduce((a, b) => a + b.paid, 0);
    if (paidAmount === data.courseFee)
      return res.status(401).json({
        error: true,
        message: "Already Paid The full Amount for this course",
      });
    pending_amount = parseInt(data.courseFee - (paidAmount + data.paid));
  } else {
    pending_amount = data.courseFee - data.paid;
  }
  try {
    const recieptNo = await GenerateRecieptId();
    const response = await new AddFeeSchema({
      ...data,
      pending: pending_amount,
      recieptNo: recieptNo,
    }).save();
    if (!response)
      return res
        .status(400)
        .json({ error: true, message: "missing required fields" });
    res.status(200).json({ error: false, message: "succes", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetDeleteFee = async (req, res) => {
  const { id } = req.params;
  const idToDelete = id.toLowerCase() === "all" ? {} : { _id: id };
  try {
    const response = await AddFeeSchema.deleteMany(idToDelete);
    if (response.deletedCount === 0)
      return res
        .status(404)
        .json({ error: true, message: "No data found with this id " });
    res.status(200).json({ error: false, message: "success" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetAllThFeeData = async (req, res) => {
  const { regno } = req.query;

  const _find = regno ? { regno: parseInt(regno) } : {};
  try {
    const response = await AddFeeSchema.aggregate([
      { $match: _find },
      {
        $lookup: {
          from: "course_admins",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $lookup: {
          from: "instructorregisters",
          localField: "instructor",
          foreignField: "_id",
          as: "instructor",
        },
      },
      { $unwind: "$course" },
      { $unwind: "$instructor" },
      { $sort: { createdAt: -1 } },
    ]);
    if (!response)
      return res.status(404).json({ error: true, message: "no data found" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Recipte Id generate
const GenerateRecieptID = async (req, res) => {
  try {
    const response = await GenerateRecieptId();
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Create Reciept
const CreateExamReciept = async (req, res) => {
  const data = req.body;
  try {
    // check All the Data
    const response = await new ExamFeeRecieptModel(data).save();
    if (!response)
      res
        .status(400)
        .json({ error: true, message: "required credentials missing" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
const UpdateExamReciept = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const response = await ExamFeeRecieptModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!response)
      res
        .status(400)
        .json({ error: true, message: "required credentials missing" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetAllExamReciept = async (req, res) => {
  try {
    const response = await ExamFeeRecieptModel.find({});
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const DeleteExamReciept = async (req, res) => {
  const { id } = req.params;
  try {
    const _delete = id.toLowerCase() !== "all" ? { _id: id } : {};
    const response = await ExamFeeRecieptModel.deleteMany(_delete);
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Generate the reciept
const GenerateReceiptPDF = async (req, res) => {
  const data = req.body;
  try {
    const newData = {
      regno: data.regno,
      name: data.name,
      fname: data.fname,
      recieptid: data.recieptid,
      course: data.course,
      srno: data.srno,
      course_amount: data.course_amount,
      currentdate: data.currentdate,
      totalCourseAmount: data.totalCourseAmount,
      totalAmount: data.totalAmount,
    };

    console.log("New data:", newData);

    const template = await Handlebars.compile(`
    <html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{name}} Reciept {{currentdate}}</title>

</head>

<body>
    <div style="padding: 20px; max-width: 100%; margin: auto auto;box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;">
      <div style="display: flex; justify-content: center; align-items: start;">
        <div style="margin: 2px; justify-content: center; width: fit-content;">
          <h3 style="font-size: 0.875rem; line-height: 1.25rem;">
            ISO Certified : 9001:2008
          </h3>
          <img
            src="https://server.smseducations.com/1702719806132-443488112SMS-PNG-LOGO.png"
            style="width: 80px; height: 80px;"
          />
        </div>
        <div style="margin: 4px; text-align: center; font-size: 1.25rem;">
          <h1 style=" margin-bottom: 10px; font-size: 3rem; line-height: 1;">
            SMS Education
          </h1>
          <h3 style="margin: 2px">Opp. Laxman Nursery, Gauri Sarojini Nagar</h3>
          <h3 style="margin-top: 8px; margin-bottom: 8px; ">
            Lucknow - 226008
          </h3>
          <h3 style="margin-top: 8px; margin-bottom: 8px;">
            Email : <span>smseducationlko@gmail.com</span>
          </h3>
        </div>
        <div style="margin: 0.5rem; text-align: center;">
          <h3>ISO Certified : 9001:2008</h3>
          <img
            src="https://server.smseducations.com/1702719806132-443488112SMS-PNG-LOGO.png"
            style="width: 80px; height: 80px;"
          />
        </div>
      </div>

      <h2 style="font-size: large; text-align: center; margin-top: 8px;">
        Fee Receipt
      </h2>

      <div style="margin-top: 5px; justify-content: space-between; display: flex; border-bottom: 1px solid #000; font-weight: 800;">
        <div style="margin: 12px;">
          <div style="display: flex;">
            <div style="font-size: large; width: 19rem;">Registration No: {{regno}}</div>
          </div>

          <div style="display: flex;">
            <div style="font-size: large; width: 19rem;">Name: {{name}}</div>
          </div>

          <div style="display: flex;">
            <div style="font-size: large; width: 19rem;">Father's Name: {{fname}}</div>
          </div>
        </div>

        <div style="margin: 12px;">
          <div style="display: flex;">
            <div style="font-size: large; width: 19rem;">Receipt Id :</div>
            <div>{{recieptid}}</div>
          </div>

          <div style="display: flex;">
            <div style="font-size: large; width: 19rem;">Date :</div>
            <div>{{currentdate}}</div>
          </div>
        </div>
      </div>

      <div style="margin-top: 40px; margin: auto;"></div>
      <div style="display: flex; justify-content: space-between; border: black; font-size: small; padding-left: 8px; padding-top: 8px; font-weight: 700;">
        <div>Sr. No.</div>
        <div>Course</div>
        <div>Amount</div>
      </div>
      <div style="display: flex; justify-content: space-between; border: black; font-size: small; padding-left: 8px; padding-top: 8px;border-bottom: 1px solid #000">
        <div>{{srno}}</div>
        <div>{{course}}</div>
        <div>{{course_amount}}</div>
      </div>
      <div style="display: flex; justify-content: space-between; border: black; font-size: small; padding-left: 8px; padding-top: 8px; border-bottom: 1px solid #000;">
        <div style="margin-left: 40px;">Total</div>
        <div></div>
        <div>{{totalAmount}}</div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: small; margin-top: 4px;">
        <div>
          <span style="font-size:large;"></span>
          Print Date & Time :{" "}
          <span>{moment().format("MMMM Do YYYY, h:mm:ss a")}</span>
        </div>
        <div style="font-size: large;">SMS Education</div>
      </div>
    </div>
    </body>

</html>
`);
    const generateddata = await template(newData);

    res.send(generateddata);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: error.message });
  }
};

// Typing result creation

const CreateTypingResult = async (req, res) => {
  try {
    const response = await new TypingModel(req.body).save();
    if (!response)
      return res
        .status(400)
        .json({ error: true, message: "required field data is missing" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const UpdateTypingResult = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const response = await TypingModel.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true }
    );
    if (!response)
      return res
        .status(400)
        .json({ error: true, message: "missing required credentials " });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const DeletetheTypingResult = async (req, res) => {
  try {
    const { id } = req.params;
    const _delete = id.toLowerCase() === "all" ? {} : { _id: id };

    const response = await TypingModel.deleteMany(_delete);
    if (response.deletedCount === 0)
      return res
        .status(404)
        .json({ error: true, message: "no data found to delete" });
    res.status(200).json({ error: false, message: "deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetTheTypingResult = async (req, res) => {
  try {
    const { id } = req.query;
    const _find = id ? { _id: new mongoose.Types.ObjectId(id) } : {};
    const response = await TypingModel.aggregate([
      { $match: _find },
      {
        $lookup: {
          from: "student_registers",
          foreignField: "_id",
          localField: "student",
          as: "student",
        },
      },
      { $unwind: "$student" },
    ]);
    if (!response)
      return res.status(404).json({ error: true, message: "no data found" });
    res.status(200).json({ error: true, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const UpdateStudentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.query;
  try {
    const update = await StudentModel.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    if (!update)
      return res.status(400).json({
        error: true,
        message: "accepts only [ active, break, completed]",
      });
    res.status(200).json({ error: false, message: "success" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

module.exports = {
  UpdateStudentStatus,
  CreateTypingResult,
  UpdateTypingResult,
  DeletetheTypingResult,
  GetTheTypingResult,
  GenerateReceiptPDF,
  CreateExamReciept,
  UpdateExamReciept,
  GenerateRecieptID,
  GetAllExamReciept,
  DeleteExamReciept,
  GetCreateFee,
  GetAllThFeeData,
  createContentLink,
  getContentLink,
  getSingleContentLink,
  getSingleContentLink,
  deleteContentLink,
  putContentLink,
  createContentDoc,
  getContentDoc,
  getSingleContentDoc,
  deleteContentDoc,
  putContentDoc,
  createContentVideo,
  getContentVideo,
  getSingleContentVideo,
  deleteContentVideo,
  putContentVideo,
  createAcademic,
  getAcademic,
  getSingleAcademic,
  deleteAcademic,
  putAcademic,
  createEvent,
  getEvent,
  getSingleEvent,
  deleteEvent,
  putEvent,
  createQuery,
  getQuery,
  getSingleQuery,
  deleteQuery,
  putQuery,
  getAssignment,
  createAssignment,
  putAssignment,
  delAssignment,
  createAddFee,
  putAddFee,
  delAddFee,
  getAllAddFee,
  gettotalpaidFee,
  getsingleFee,
  GetDeleteFee,
  getFee,
  loginInstructor,
  createScheduleClass,
  putScheduleClass,
  delScheduleClass,
  getAllScheduleClass,
  getAllResult,
  getsingleResult,
  delResult,
  putResult,
  GetResultUploadStudent,
  createResult,
  putStStatusReq,
  deleteStStatusReq,
  getSingleStStatusReq,
  getStStatusReq,
  createStStatusReq,
};

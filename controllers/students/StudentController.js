const Student_RegisterSchema = require("../../models/students/StudentModel");
const crypto = require("crypto");
const Functions = require("../../library/functions");
const upload_task = require("../../models/students/uploadTask");
const nodemailer = require("nodemailer");
const EnrollCourseSchema = require("../../models/students/EnrollCourse");
const InstructorRegisterSchema = require("../../models/admin/InstructorModel");
const CourseSchema = require("../../models/admin/Add_Course");
const VerifyModel = require("../../models/VerifyModel");
const { read } = require("fs");
const { default: mongoose } = require("mongoose");
const FeedBackModel = require("../../models/students/Feedback");
const StudentModel = require("../../models/students/StudentModel");
const createSt = async (req, resp, next) => {
  try {
    const formData = req.body;

    const usermail = await Student_RegisterSchema.findOne({
      email: formData.contact,
    });

    if (usermail) {
      resp.status(404).json({
        code: 404,
        message: "user aleready exist....  ",
        data: [],
        error: false,
        status: false,
      });
    } else {
      let data = new Student_RegisterSchema(formData);
      //  const token=await data.generatAuthToken()
      //    console.log(token)
      await data.save();
      //resp.send(result);

      resp.status(200).json({
        code: 200,
        message: "user  Register successfully",

        error: false,
        status: true,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
// const loginSt = async (req, resp, next) => {
//   try {
//     const email = req.body.email;
//     const password = req.body.password;
//     const usermail = await Student_RegisterSchema.findOne({
//       email: email,
//       password: password,
//     });
//     if (usermail) {
//       resp.status(200).json({
//         code: 200,
//         message: "user Login successfully",
//         data: {
//           _id: usermail._id,
//           name: usermail.name,
//           email: usermail.email,
//           contact: usermail.contact,
//         },
//         error: false,
//         status: true,
//       });
//       console.log(usermail._id);
//     } else {
//       resp.status(404).json({
//         code: 404,
//         message: "Invalid User details, Try Again.  ",
//         data: [],
//         error: false,
//         status: false,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }

const loginSt = async (req, res) => {
  const { contact, otp, otpid } = req.query;
  console.log(contact, otp, otpid);

  try {
    if (!contact || !otp || !otpid)
      return res
        .status(400)
        .json({ error: true, message: "invalid credentials" });

    // find the user
    const isUser = await Student_RegisterSchema.findOne({ contact: contact });
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

    res.status(200).json({ error: false, data: isUser });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ error: true, message: "An error occurred during login" });
  }
};

const getSt = async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  const skip = (page - 1) * limit;

  try {
    const totalDocuments = await Student_RegisterSchema.countDocuments({});
    const data = await Student_RegisterSchema.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      data,
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getsingleSt = async (req, res) => {
  try {
    const studentId = req.params._id; // Use the correct parameter name

    const data = await Student_RegisterSchema.findById(studentId);

    if (!data) {
      return res.status(404).json({ message: "Student not found" });
    }

    const {
      _id,
      name,
      regno,
      fname,
      address,
      email,
      contact,
      dob,
      gender,
      admdate,
      refby,
      password,
      profilePic,
      status,
      course,
      shift,
      locker_no,
    } = data;

    res.status(200).json({
      _id,
      name,
      regno,
      fname,
      address,
      email,
      contact,
      dob,
      gender,
      admdate,
      refby,
      password,
      profilePic,
      status,
      course,
      shift,
      locker_no,
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const putSt = async (req, res) => {
  try {
    // const profilePic = req.file.filename;
    // console.log(profilePic);
    const {
      regno,
      name,
      fname,
      address,
      contact,
      email,
      gender,
      dob,
      admdate,
      refby,
      password,
      profilePic,
      status,
      course,
      shift,
      locker_no,
    } = req.body;
    console.log(regno, address);
    let data = await Student_RegisterSchema.updateOne(
      { _id: req.params._id },
      {
        $set: {
          regno,
          name,
          fname,
          address,
          contact,
          email,
          gender,
          dob,
          admdate,
          refby,
          password,
          profilePic,
          status,
          course,
          shift,
          locker_no,
        },
      }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

const getUpdateStudent = async (req, res) => {
  const data = req.body;
  try {
    const isUpdated = await Student_RegisterSchema.findByIdAndUpdate(
      req.params._id,
      { ...data },
      { new: true }
    );

    if (!isUpdated)
      return res.status(400).json({ error: true, message: "failed to update" });
    res.status(200).json({ error: false, message: "success", data: isUpdated });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const delSt = async (req, res) => {
  try {
    console.log(req.params);
    let data = await Student_RegisterSchema.deleteOne({ _id: req.params._id });
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const sendforgetPass = (req, res) => {
  try {
    const email = req.body.email;
    const usermail = Student_RegisterSchema.findOne({
      email: email,
    });
    if (usermail) {
      // const email = "amitpoly2020@gmail.com";
      //const _id=req.body._id;
      const _id = "464gdgr55654645645645";

      crypto.randomBytes(64, function (err, buffer) {
        let token = buffer.toString("hex");
        let timeStamp = Functions.getTimeStamp(Date.now());

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: "amitpoly2020@gmail.com",
            pass: "tnipzxxgahbeznwp",
          },
        });

        (() => {
          const mailOptions = {
            from: "amitpoly2020@gmail.com", // sender
            to: `${email}`, // list of receivers
            subject: `SMS Education reset password link`,
            text: ``,
            ///  html: "<p> click the link below for Reset your password <a href='http://postmortemshala.co.in/reset/password/" + token + "'> click here,</a></p>"
            html: "<p> click the link   for Reset your password <a href='https://coaching-institute.netlify.app'> click here,</a></p>",
          };

          const result = transporter
            .sendMail(mailOptions)
            .then((log) => {
              Student_RegisterSchema.updateOne(
                { email: req.body.email },
                { $set: { token: token } },
                { upsert: true }
              ).then((result, err) => {
                console.log("tocken add successully");
              });
              res.status(200).json({
                code: 200,
                status: true,
                message: "Mail Sent Successully !!",
                error: false,
                data: {
                  messageInfo: log,
                  sendTimestamp: timeStamp,
                  token: token,
                },
              });
            })
            .catch((error) => {
              res.status(404).json({
                code: 404,
                status: false,
                message: "Mail Sent Error !!",
                error: error,
                data: [],
              });
            });
        })();
      });
    } else {
      res.send("Something went Wrong ! Email not found");
    }
  } catch (err) {
    console.log(err);
  }
};

const stChangepass = async (req, resp) => {
  try {
    let password = req.body.newpass;
    const usermail = await Student_RegisterSchema.updateOne(
      { token: req.params.token },
      {
        $set: {
          password: password,
        },
      }
    );
    if (usermail) {
      resp.status(200).json({
        code: 200,
        massage: "password has been changed successfully..",

        error: false,
        status: true,
      });
    } else {
      console.log("Error Ocured !");
    }
  } catch (error) {
    console.log(error);
  }
};
const createuploadtask = async (req, res) => {
  const { regno, name } = req.body;
  const img = req.file.filename;
  let data = new upload_task({ img, regno, name });
  let result = await data.save();
  res.status(200).json({
    code: 200,
    message: "  Task uploaded successfully",
    error: false,
    status: true,
  });
};
const getuploadtask = async (req, res) => {
  let data = await upload_task.find();

  res.send(data);
};

const putuploadtask = async (req, res) => {
  try {
    const img = req.file.filename;
    const { regno, name } = req.body;
    let data = await upload_task.updateOne(
      { regno: req.params.regno },
      {
        $set: {
          img,
          regno,
          name,
        },
      }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const deluploadtask = async (req, res) => {
  try {
    console.log(req.params);
    let data = await upload_task.deleteOne({ regno: req.params.regno });
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

const createEnrollCorses = async (req, res) => {
  const { student, course, create_at } = req.body;
  // let dat = await EnrollCourseSchema.find({course:course});
  //  if(dat){
  //   res.status(304).json({
  //     code: 304,
  //     message: "You have already enrolled in this course..",
  //     error: false,
  //     status: true,
  //   });

  //  }else{
  let data = new EnrollCourseSchema({ student, course, create_at });
  let result = await data.save();
  res.status(200).json({
    code: 200,
    message: "Enrolled successfully",
    error: false,
    status: true,
  });
};

//}
const getEnrollCorses = async (req, res) => {
  let data = await EnrollCourseSchema.find();

  res.send(data);
};
const getSingleEnrollCorses = async (req, res) => {
  let data = await EnrollCourseSchema.find({ student: req.params.student });

  res.send(data);
};
const putEnrollCorses = async (req, res) => {
  try {
    const { student, course, create_at } = req.body;
    let data = await EnrollCourseSchema.updateOne(
      { _id: req.params._id },
      { $set: { student, course, create_at } }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const delEnrollCorses = async (req, res) => {
  try {
    //console.log(req.params)
    let data = await EnrollCourseSchema.deleteOne({ _id: req.params._id });
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

const GetStudentCareerInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Student_RegisterSchema.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "course_admins",
          foreignField: "title",
          localField: "course",
          as: "enrolled_courses",
        },
      },
    ]);
    const courseId = data[0]?.enrolled_courses?.map((item) => item?.instructor);

    const _findInstructor = await InstructorRegisterSchema.find({
      _id: { $in: courseId },
    });

    res.status(200).json({
      error: false,
      message: "succes",
      data: { data, instructors: _findInstructor },
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Feed Back
const CreateFeedback = async (req, res) => {
  const data = req.body;
  try {
    const response = await new FeedBackModel(data).save();
    if (!response)
      return res
        .status(400)
        .json({ error: true, message: "missing required credentials" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
const UpdateFeedback = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const response = await FeedBackModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!response)
      return res
        .status(400)
        .json({ error: true, message: "missing required credentials" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
const DeleteFeedback = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await FeedBackModel.findByIdAndDelete(id);
    if (!response)
      return res
        .status(404)
        .json({ error: true, message: "no data found with this id " });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
const GetFeedback = async (req, res) => {
  const { id } = req.query;
  try {
    const _find = id ? { _id: id } : {};
    const response = await FeedBackModel.find(_find);
    if (!response)
      return res.status(404).json({ error: true, message: "no data found " });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// const GetStudentCourseAnalytics = async (req, res) => {
//   const { student } = req.params;
//   try {
//     const response = await StudentModel.aggregate([
//       { $match: { _id: new mongoose.Types.ObjectId(student) } },
//       {
//         $project: {
//           totalCourses: 1,
//           ActiveCourses : {
//             cond:{
//               if :{ $eq :["$"]}
//             }
//           }
//         },
//       },
//     ]);
//   } catch (error) {
//     res.status(500).json({ error: true, message: error.message });
//   }
// };
module.exports = {
  // feedback
  CreateFeedback,
  UpdateFeedback,
  DeleteFeedback,
  GetFeedback,
  createSt,
  createEnrollCorses,
  getEnrollCorses,
  getSingleEnrollCorses,
  putEnrollCorses,
  delEnrollCorses,
  getUpdateStudent,
  createuploadtask,
  getuploadtask,
  GetStudentCareerInfo,
  deluploadtask,
  putuploadtask,
  getsingleSt,
  sendforgetPass,
  stChangepass,
  loginSt,
  getSt,
  putSt,
  delSt,
};

const express = require("express");
const Router = express.Router();
const {
  createSt,
  getSt,
  putSt,
  stChangepass,
  sendforgetPass,
  delSt,
  loginSt,
  getsingleSt,
  createuploadtask,
  getuploadtask,
  deluploadtask,
  putuploadtask,
  getUpdateStudent,
  createEnrollCorses,
  getEnrollCorses,
  getSingleEnrollCorses,
  putEnrollCorses,
  delEnrollCorses,
  GetStudentCareerInfo,
  CreateFeedback,
  UpdateFeedback,
  DeleteFeedback,
  GetFeedback,
} = require("../../controllers/students/StudentController");
const tast_assignment_upload = require("../../multer/students/task_upload");
const studentProfile_upload = require("../../multer/students/StudentProfile");
const {
  UpdateStudentStatus,
} = require("../../controllers/teachers/TeacherController");

Router.route("/enroll").post(createEnrollCorses);
Router.route("/enroll").get(getEnrollCorses);
Router.route("/enroll/:student").get(getSingleEnrollCorses);
Router.route("/enroll/:_id").put(putEnrollCorses);
Router.route("/enroll/:_id").delete(delEnrollCorses);

Router.route("/students").post(createSt);
Router.route("/students").get(getSt);
Router.route("/students/:_id").get(getsingleSt);
// update the student status
Router.route("/students/status/:id").get(UpdateStudentStatus);
// Router.route("/students/:_id").put(putSt);
Router.route("/students/:_id").patch(getUpdateStudent);
Router.route("/students/:_id").delete(delSt);
Router.route("/studentlogin").post(loginSt);
Router.route("/mail").get(sendforgetPass);
Router.route("/api/userchangepassword/:token").put(stChangepass);

// Get the Student Course and instructor by id
Router.route("/student/career/info/:id").get(GetStudentCareerInfo);

Router.route("/uploadtask").post(
  tast_assignment_upload.single("img"),
  createuploadtask
);
Router.route("/uploadtask").get(getuploadtask);
Router.route("/uploadtask/:regno").put(
  tast_assignment_upload.single("img"),
  putuploadtask
);
Router.route("/uploadtask/:regno").delete(deluploadtask);

// FeedBack routes============================================
Router.route("/feedback/create").post(CreateFeedback);
Router.route("/feedback/update/:id").patch(UpdateFeedback);
Router.route("/feedback/delete/:id").delete(DeleteFeedback);
Router.route("/feedback/get").get(GetFeedback);

// Router.route('/student/course/analytics/:student' ).get()

module.exports = Router;

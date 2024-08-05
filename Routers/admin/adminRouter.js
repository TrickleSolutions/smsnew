const express = require("express");
const Router = express.Router();
const {
  createCategory,
  putCategory,
  getCategory,
  getSingleCategory,
  deleteCategory,
  createInstructor,
  putInstructor,
  getInstructor,
  getCourse,
  createCourse,
  putCourse,
  createAdmin,
  loginAdmin,
  putAdmin,
  getAdmin,
  deleteAdmin,
  getSingleInstructor,
  deleteCourse,
  deleteInstructor,
  createEnquiry,
  getEnquiry,
  deleteEnquiry,
  createExpense,
  handleEnquiryStatus,
  getExpense,
  deleteExpense,
  putExpense,
  putEnquiry,
  getSingleCourse,
  createStOfMonth,
  getStOfMonth,
  putStOfMonth,
  delStOfMonth,
  createincome,
  getincome,
  getSingleincome,
  deleteincome,
  putincome,
  getSingleExpense,
  createLibrary,
  getLibrary,
  getSingleLibrary,
  deleteLibrary,
  putLibrary,
  getSingleAdmin,
  getSingleinstructorofmonth,
  getinstructorOfMonth,
  putinstructorOfMonth,
  delinstructorOfMonth,
  createinstructorOfMonth,

  ///aprove St Status
  putApproveStStatus,

  createAppointment,
  putAppointment,
  getAppointment,
  getSingleAppointment,
  deleteAppointment,

  createrolepermission,
  getrolepermission,
  getSinglerolepermission,
  deleterolepermission,
  putrolepermission,
  createContact,
  getContact,
  getSingleContact,
  deleteContact,
  putContact,
  SearchCourses,
  createJoinAsInstructor,
  getJoinAsInstructor,
  getSingleJoinAsInstructor,
  putJoinAsInstructor,
  delJoinAsInstructor,
  GetAllInstructorStudent,
  UpdateInstructorData,
  GetAllInstructorWithCourse,
  // Batches
  CreateBatch,
  UpdateBatches,
  GetAllBatches,
  DeleteBatches,
  // certificates
  GenerateCertificates,
  UpdateCertificate,
  DeleteCertificate,
  GetAllCertificates,
  GenerateSerialNumber,
  CreateCourseLession,
  UpdateCourseLession,
  deleteCouseLession,
  GetAllCourseLession,
  CreateHoliday,
  Updateholiday,
  DeleteHoliday,
  CourseWiseStudent,
  GetHoliday,
  CreateDayByDayPlan,
  DeleteDayByDayPlan,
  GetDayByDay,
  UpdateDayByDay,
  NewLessionPlanCreate,
  NewLessionPlanUpdate,
  NewLessionPlanDelete,
  NewLessionPlanGet,
  GetLessionByCourse,
  NewLessionPlanGetByInstructor,
  AddInSlider,
  UpadateSliderImg,
  DeleteSliderImg,
  GetSliderImg,
  CreateDaybyDayPlan,
  UpdateDayByDayPlan,
  DeleteNewDayByDayPlan,
  GetAllDayByDay,
  AddNewDataCashbook,
  AddTheTransaction,
  UpdateTransaction,
  DeleteTransaction,
  GetAllTransaction,
  GetAllCashbook,
  ChangeTheStatusOfTransaction,
  CreateNewFinancialYear,
  GetTheYearTransactions,
  GetUnapprovedData,
  UploadNotesOnLessionPlan,
  GetCashbookReport,
  GetAlltheCashbokYears,
  GetBlanceReportOfStudents,
  GetSlderImages,
  GetAllLessionTopics,
  // ---------cetrificates end --------------
} = require("../../controllers/admin/AdminController");
const course_upload = require("../../multer/admin/course_upload");
const studentofmonth_upload = require("../../multer/admin/StudentOfMonth");
const instructorofmonth_upload = require("../../multer/admin/Instructorofmonth");
const instructorProfile = require("../../multer/admin/InsructorProfile");
const Admin_upload = require("../../multer/admin/Amin_upload");
const joininstructor_upload = require("../../multer/admin/joininstructor_upload");
const {
  handleCashbook,
  HandleCascade,
} = require("../../middlewares/cashbooks/CashbookHandle");

Router.route("/joininstructor").post(createJoinAsInstructor);
Router.route("/joininstructor").get(getJoinAsInstructor);
Router.route("/joininstructor/:_id").get(getSingleJoinAsInstructor);
Router.route("/joininstructor/:_id").delete(delJoinAsInstructor);
Router.route("/joininstructor/:_id").put(putJoinAsInstructor);

///role permission section
Router.route("/permission/:_id").put(putrolepermission);
Router.route("/permission/:_id").delete(deleterolepermission);
Router.route("/permission/:id").get(getSinglerolepermission);
Router.route("/permission").post(createrolepermission);
Router.route("/permission").get(getrolepermission);
///appointment
Router.route("/appoint/:_id").put(putAppointment);
Router.route("/appoint/:_id").delete(deleteAppointment);
Router.route("/appoint/:_id").get(getSingleAppointment);
Router.route("/appoint").post(createAppointment);
Router.route("/appoint").get(getAppointment);

//contact form
Router.route("/contact/:_id").put(putContact);
Router.route("/contact/:_id").delete(deleteContact);
Router.route("/contact/:_id").get(getSingleContact);
Router.route("/contact").post(createContact);
Router.route("/contact").get(getContact);
//Admin
Router.route("/admin").post(createAdmin);
Router.route("/adminlogin").post(loginAdmin);
Router.route("/admin").get(getAdmin);
Router.route("/admin/:_id").get(getSingleAdmin);
Router.route("/admin/:_id").delete(deleteAdmin);
Router.route("/admin/:_id").put(Admin_upload.single("profilePic"), putAdmin);

///Student Status Request api.........
Router.route("/approvestatus/:regno").put(putApproveStStatus);

//Category
Router.route("/category/:_id").put(putCategory);
Router.route("/category/:_id").delete(deleteCategory);
Router.route("/category/:_id").get(getSingleCategory);
Router.route("/category").post(createCategory);
Router.route("/category").get(getCategory);

Router.route("/library/:book_no").put(putLibrary);
Router.route("/library/:book_no").delete(deleteLibrary);
Router.route("/library/:book_no").get(getSingleLibrary);
Router.route("/library").post(createLibrary);
Router.get("/library", getLibrary);

Router.route("/income").post(createincome);
Router.route("/income").get(getincome);
Router.route("/income/:_id").delete(deleteincome);
Router.route("/income/:_id").get(getSingleincome);
Router.route("/income/:_id").put(putincome);

Router.route("/instructor").post(createInstructor);
Router.route("/instructor").get(getInstructor);
Router.route("/instructor/:_id").delete(deleteInstructor);
Router.route("/instructor/:_id").put(
  instructorProfile.single("profilePic"),
  putInstructor
);
Router.route("/instructor/:_id").patch(UpdateInstructorData);
Router.route("/instructor/:_id").get(getSingleInstructor);

Router.route("/course").post(course_upload.single("img"), createCourse);
Router.route("/course").get(getCourse);
Router.route("/course/:_id").get(getSingleCourse);
// coursewise student
Router.route("/course-students/:id").get(CourseWiseStudent);
// insturctor wise course and his students
Router.route("/course/students/:instructor").get(GetAllInstructorStudent);
Router.route("/search-course").get(SearchCourses);
Router.route("/course/:_id").delete(deleteCourse);
Router.route("/course/:_id").put(course_upload.single("img"), putCourse);
Router.route("/enquiry").post(createEnquiry);
Router.route("/enquiry").get(getEnquiry);
Router.route("/enquiry/:contact").delete(deleteEnquiry);
Router.route("/enquiry/:contact").put(putEnquiry);
// change enquiry enroll status
Router.route("/enquiry/:id").get(handleEnquiryStatus);

Router.route("/expense").post(createExpense);
Router.route("/expense/:_id").put(putExpense);
Router.route("/expense").get(getExpense);
Router.route("/expense/:_id").get(getSingleExpense);
Router.route("/expense/:_id").delete(deleteExpense);

Router.route("/studentofmonth").post(
  studentofmonth_upload.single("img"),
  createStOfMonth
);
Router.route("/studentofmonth").get(getStOfMonth);
Router.route("/studentofmonth/:regno").delete(delStOfMonth);
Router.route("/studentofmonth/:regno").put(
  studentofmonth_upload.single("img"),
  putStOfMonth
);

Router.route("/instructorofmonth").post(
  instructorofmonth_upload.single("img"),
  createinstructorOfMonth
);
Router.route("/instructorofmonth").get(getinstructorOfMonth);
Router.route("/instructorofmonth/:_id").delete(delinstructorOfMonth);
Router.route("/instructorofmonth/:_id").put(
  instructorofmonth_upload.single("img"),
  putinstructorOfMonth
);
Router.route("/instructorofmonth/:_id").get(getSingleinstructorofmonth);

// Batches
Router.route("/batch/create").post(CreateBatch);
Router.route("/batch/update/:id").patch(UpdateBatches);
Router.route("/batch/get").get(GetAllBatches);
Router.route("/batch/delete/:id").delete(DeleteBatches);

// certificates
Router.route("/certificate/generate").post(GenerateCertificates);
Router.route("/certificate/get").get(GetAllCertificates);
Router.route("/certificate/update/:id").patch(UpdateCertificate);
Router.route("/certificate/delete/:id").delete(DeleteCertificate);
Router.route("/certificate/generate/number/:courseid/:studentId").get(
  GenerateSerialNumber
);

// Course Day By Day
Router.route("/course/lessions/:courseid").post(CreateCourseLession);
Router.route("/course/lessions/update/:id").patch(UpdateCourseLession);
Router.route("/course/lessions/delete/:id").delete(deleteCouseLession);
Router.route("/course/lessions/get").get(GetAllCourseLession);
// Router.route("/course/lessions/:courseid");

Router.route("/holiday/create").post(CreateHoliday);
Router.route("/holiday/update/:id").patch(Updateholiday);
Router.route("/holiday/delete/:id").delete(DeleteHoliday);
Router.route("/holiday/get").get(GetHoliday);

Router.route("/day-by-day/create").post(CreateDayByDayPlan);
Router.route("/day-by-day/update/:id").patch(UpdateDayByDay);
Router.route("/day-by-day/get").get(GetDayByDay);
Router.route("/day-by-day/delete/:id").delete(DeleteDayByDayPlan);

// New Create Lessions
Router.route("/course/new-lession/:courseid").post(NewLessionPlanCreate);
Router.route("/course/new-lession/update/:id").patch(NewLessionPlanUpdate);
Router.route("/course/new-lession/delete/:id").delete(NewLessionPlanDelete);
Router.route("/course/new-lession/get").get(NewLessionPlanGet);
Router.route("/course/new-lession/getbycourse/:courseid").get(
  GetLessionByCourse
);
Router.route("/course/new-lession/upload/:id/:topicid").get(
  UploadNotesOnLessionPlan
);
Router.route("/course/new-lession/getbyinstructor/:instructor").get(
  NewLessionPlanGetByInstructor
);

// Home slider  ==============
Router.route("/slider/add").post(AddInSlider);
Router.route("/slider/update/:id/:img").patch(UpadateSliderImg);
Router.route("/slider/delete/:id").delete(DeleteSliderImg);
Router.route("/slider/get").get(GetSliderImg);
Router.route("/slider/getall").get(GetSlderImages);

// ====================== New DayByDay
Router.route("/new-daybyday/create").post(CreateDaybyDayPlan);
Router.route("/new-daybyday/update/:id").patch(UpdateDayByDayPlan);
Router.route("/new-daybyday/delete/:id").delete(DeleteNewDayByDayPlan);
Router.route("/new-daybyday/get").get(GetAllDayByDay);
Router.route("/lessions/getalltopic/:course").get(GetAllLessionTopics);

// Cash ledger Cashsbook Routes

Router.route("/cashbook/create-new").post(AddNewDataCashbook);
Router.route("/cashbook/get").get(GetAllCashbook);
// Router.route("/cashbook/transaction/add/:year").post(
//   handleCashbook,
//   AddTheTransaction
// );
Router.post("/cashbook/create-financial-year/new", CreateNewFinancialYear);
Router.post("/cashbook/transaction/add/:year", AddTheTransaction);
Router.route("/cashbook/transaction/delete/:year/:id").delete(
  DeleteTransaction
);
Router.route("/cashbook/transaction/get").get(GetAllTransaction);
Router.route("/cashbook/transaction/status/:id/:year").get(
  ChangeTheStatusOfTransaction
);

Router.route("/cashbook/transaction/get/:year").get(GetTheYearTransactions);
Router.route("/cashbook/transaction/get-unapproved/:year").get(
  GetUnapprovedData
);
Router.route("/cashbook/report/:year").get(GetCashbookReport);
Router.route("/cashbook/transaction/cashbook-years").get(GetAlltheCashbokYears);

// Get all the Balance Report of the batches students as per instructor
Router.route("/balance-report/:instructor").get(GetBlanceReportOfStudents);

module.exports = Router;

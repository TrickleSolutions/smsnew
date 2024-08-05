const InstructorRegisterSchema = require("../../models/admin/InstructorModel");
const moment = require("moment");
const AdminRegisterSchema = require("../../models/admin/Admin_reg");
const CourseSchema = require("../../models/admin/Add_Course");
const Enquiry_adminSchema = require("../../models/admin/Enquiry_admin");
const ExpenseSchema = require("../../models/admin/Expense_admin");
const StudentOfMonthSchema = require("../../models/admin/StudentOfMonth");
const IncomeSchema = require("../../models/admin/income");
const LibrarySchema = require("../../models/admin/Library");
const CategorySchema = require("../../models/admin/category");
const InstructorOfMonthSchema = require("../../models/admin/instructorofmonth");
const Student_RegisterSchema = require("../../models/students/StudentModel");
const AppointmentSchema = require("../../models/admin/Appointment");
const rolesPermissionSchema = require("../../models/admin/permission");
const ContactSchema = require("../../models/admin/contactform");
const JoinInstructorSchema = require("../../models/admin/joinasinstructor");
const generateEnquiryNo = require("../../funcs/enquiry");
const BatchModel = require("../../models/admin/Batches");
const { default: mongoose } = require("mongoose");
const CertificateModel = require("../../models/admin/certificates");
const GenerateCertificatesNumber = require("../../funcs/generateCertificateNumber");
const CourseLessionModel = require("../../models/admin/courseLessions");
const HolidayModel = require("../../models/admin/Holiday");
const DayByDayModel = require("../../models/admin/DayByDay");
const NewCourseLessionSchema = require("../../models/admin/NewCourseLession");
const SliderModel = require("../../models/admin/HomeSliderModel");
const NewDayByDayModel = require("../../models/admin/newDayByday");
const CashbookModel = require("../../models/admin/Cashbook");
const TransactionsModel = require("../../models/admin/transactions");
const CashBookYearModel = require("../../models/admin/CashLedgerYear");
const {
  updateTheCashbook,
} = require("../../middlewares/cashbooks/CashbookHandle");

function checkEmailOrMobile(inputString) {
  // Regular expression for matching email addresses
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Regular expression for matching mobile phone numbers (assuming US format)
  const mobilePattern = /^\d{10}$/; // Match exactly 10 digits

  if (emailPattern.test(inputString)) {
    return "email";
  } else if (mobilePattern.test(inputString)) {
    return "contact";
  } else {
    return "Neither";
  }
}

const createAdmin = async (req, resp) => {
  try {
    const {
      name,
      address,
      contact,
      email,
      gender,
      dob,
      qualification,
      degree,
      exp,
      password,
      role,
      status,
    } = req.body;

    const usermail = await AdminRegisterSchema.findOne({ email: email });
    console.log(usermail);
    if (usermail) {
      resp.status(404).json({
        code: 404,
        message: "user aleready exist....  ",
        data: [],
        error: false,
        status: false,
      });
    } else {
      let data = new AdminRegisterSchema({
        name,
        address,
        contact,
        email,
        gender,
        dob,
        qualification,
        degree,
        exp,
        password,
        role,
        status,
      });
      await data.save();
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
const loginAdmin = async (req, resp, next) => {
  try {
    const inputType = checkEmailOrMobile(req.body.email);
    const email = req.body.email;
    const password = req.body.password;
    const usermail = await AdminRegisterSchema.findOne({
      [inputType]: email,
      password: password,
    });
    if (usermail) {
      resp.status(200).json({
        code: 200,
        message: "user Login successfully",
        data: {
          _id: usermail._id,
          name: usermail.name,
          email: usermail.email,
          contact: usermail.contact,
          role: usermail.role,
        },
        error: false,
        status: true,
      });
      console.log(usermail._id);
    } else {
      resp.status(404).json({
        code: 404,
        message: "Invalid User details, Try Again.  ",
        data: [],
        error: false,
        status: false,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
const putAdmin = async (req, res) => {
  try {
    const profilePic = req.file.filename;
    const {
      name,
      address,
      contact,
      email,
      gender,
      dob,
      qualification,
      degree,
      exp,
      password,
      role,
      status,
    } = req.body;
    let data = await AdminRegisterSchema.updateOne(
      { _id: req.params._id },
      {
        $set: {
          name,
          address,
          contact,
          email,
          gender,
          dob,
          qualification,
          degree,
          exp,
          password,
          profilePic,
          role,
          status,
        },
      }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const getSingleAdmin = async (req, res, next) => {
  try {
    const usermail = await AdminRegisterSchema.find({ _id: req.params._id });
    res.send(usermail);
  } catch (err) {
    console.log(err);
  }
};

const getAdmin = async (req, res, next) => {
  try {
    const usermail = await AdminRegisterSchema.find();
    res.send(usermail);
  } catch (err) {
    console.log(err);
  }
};

const deleteAdmin = async (req, resp) => {
  try {
    // console.log(req.params.contact);
    let data = await AdminRegisterSchema.deleteOne({ _id: req.params._id });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};

const createInstructor = async (req, resp) => {
  try {
    console.log(req.body);
    const formData = req.body;

    const usermail = await InstructorRegisterSchema.findOne({
      email: formData.email,
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
      let data = new InstructorRegisterSchema(formData);

      let result = await data.save();

      resp.status(200).json({
        code: 200,
        message: "user  Register successfully",
        data: result,
        error: false,
        status: true,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
const putInstructor = async (req, res) => {
  try {
    const {
      name,
      address,
      contact,
      email,
      gender,
      dob,
      doj,
      qualification,
      degree,
      exp,
      password,
      status,
    } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }

    // Update data in the database
    const data = await InstructorRegisterSchema.updateOne(
      { _id: req.params._id },
      {
        $set: {
          name,
          address,
          contact,
          email,
          gender,
          dob,
          doj,
          qualification,
          degree,
          exp,
          password,
          profilePic: req.file ? req.file.filename : undefined, // Check if file exists
          status,
        },
      }
    );

    // Check if the document was found and updated
    if (data.nModified === 0) {
      return res.status(404).json({ error: "Instructor not found." });
    }

    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
};
const UpdateInstructorData = async (req, res) => {
  const data = req.body;
  try {
    const response = await InstructorRegisterSchema.findByIdAndUpdate(
      req.params._id,
      data,
      { new: true }
    );
    if (!response)
      return res.status(400).json({ error: true, message: "user not updated" });

    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const getInstructor = async (req, res) => {
  let data = await InstructorRegisterSchema.find();

  res.send(data);
};
const getSingleInstructor = async (req, res) => {
  let data = await InstructorRegisterSchema.find({ _id: req.params._id });

  res.send(data);
};
const deleteInstructor = async (req, resp) => {
  try {
    //console.log(req.params.contact);
    let data = await InstructorRegisterSchema.deleteOne({
      _id: req.params._id,
    });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};
const createCourse = async (req, resp) => {
  try {
    let img = req.file.filename;
    let title = req.body.title;
    let desc = req.body.desc;
    let level = req.body.level;
    let lessons = req.body.lessons;
    let duration = req.body.duration;
    let price = req.body.price;
    let rating = req.body.rating;
    let category = req.body.category;
    let instructor = req.body.instructor;
    let status = req.body.status;

    const usermail = await CourseSchema.findOne({ title: title });
    console.log(usermail);
    if (usermail) {
      resp.status(404).json({
        code: 404,
        message: "Course aleready exist....  ",
        data: [],
        error: false,
        status: false,
      });
    } else {
      let data = new CourseSchema({
        img,
        title,
        desc,
        level,
        lessons,
        duration,
        price,
        rating,
        category,
        instructor,
        status,
      });

      let result = await data.save();

      resp.status(200).json({
        code: 200,
        message: "Course  Register successfully",

        error: false,
        status: true,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const putCourse = async (req, res) => {
  try {
    let img = req.file.filename;
    let title = req.body.title;
    let desc = req.body.desc;
    let level = req.body.level;
    let lessons = req.body.lessons;
    let duration = req.body.duration;
    let price = req.body.price;
    let rating = req.body.rating;
    let category = req.body.category;
    let instructor = req.body.instructor;
    let status = req.body.status;
    let data = await CourseSchema.updateOne(
      { _id: req.params._id },
      {
        $set: {
          img,
          title,
          desc,
          level,
          lessons,
          duration,
          price,
          rating,
          category,
          instructor,
          status,
        },
      }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const getCourse = async (req, res) => {
  let data = await CourseSchema.find();

  res.send(data);
};
const getSingleCourse = async (req, res) => {
  let data = await CourseSchema.find({ _id: req.params._id });

  res.send(data);
};

const deleteCourse = async (req, resp) => {
  try {
    console.log(req.params);
    let data = await CourseSchema.deleteOne({ _id: req.params._id });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};

const createEnquiry = async (req, resp) => {
  try {
    // const {
    //   name,
    //   fname,
    //   address,
    //   dob,
    //   course,
    //   contact,
    //   email,
    //   gender,
    //   counseller,
    //   note,
    // } = req.body;
    const formData = req.body;

    const usermail = await Enquiry_adminSchema.findOne({
      contact: formData.contact,
    });
    console.log(usermail);
    if (usermail) {
      resp.status(404).json({
        code: 404,
        message: "user aleready exist....  ",
        data: [],
        error: false,
        status: false,
      });
    } else {
      // generate the enquiry id
      const EnquiryId = await generateEnquiryNo();
      let data = new Enquiry_adminSchema({
        enquiryNo: EnquiryId,
        ...formData,
      });

      await data.save();

      resp.status(200).json({
        code: 200,
        message: "Enquiry created successfully",

        error: false,
        status: true,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
const putEnquiry = async (req, res) => {
  try {
    // const {
    //   name,
    //   fname,
    //   address,
    //   dob,
    //   epx_join,
    //   course,
    //   contact,
    //   email,
    //   gender,
    //   counseller,
    //   note,
    // } = req.body;
    const formData = req.body;

    let data = await Enquiry_adminSchema.updateOne(
      { contact: req.params.contact },
      {
        $set: formData,
      }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const getEnquiry = async (req, res) => {
  let data = await Enquiry_adminSchema.find({}).sort({ createdAt: -1 });

  res.send(data);
};
const deleteEnquiry = async (req, resp) => {
  try {
    console.log(req.params);
    let data = await Enquiry_adminSchema.deleteOne({
      contact: req.params.contact,
    });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};

// Change the status of the enquiry
const handleEnquiryStatus = async (req, res) => {
  const { status } = req.query;
  const { id } = req.params;
  console.log(id, status);

  try {
    // find the enquiry
    const isEnquiry = await Enquiry_adminSchema.findByIdAndUpdate(
      id,
      {
        status: status,
      },
      { new: true }
    );
    if (!isEnquiry)
      return res.status(404).json({ error: true, message: "no enquiry found" });

    res.status(200).json({ error: false, message: "success", data: isEnquiry });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const createExpense = async (req, resp) => {
  try {
    const { time, date, amount, desc } = req.body;

    let data = new ExpenseSchema({ time, date, amount, desc });

    let result = await data.save();

    resp.send(result);
  } catch (err) {
    console.log(err);
  }
};

const getExpense = async (req, res) => {
  let data = await ExpenseSchema.find();

  res.send(data);
};
const getSingleExpense = async (req, res) => {
  let data = await ExpenseSchema.find({ _id: req.params._id });

  res.send(data);
};

const deleteExpense = async (req, resp) => {
  try {
    console.log(req.params);
    let data = await ExpenseSchema.deleteOne({ _id: req.params._id });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};
const putExpense = async (req, res) => {
  try {
    const { time, date, amount, desc } = req.body;

    let data = await ExpenseSchema.updateOne(
      { _id: req.params._id },
      { $set: { time, date, amount, desc } }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const createStOfMonth = async (req, res) => {
  const { regno, name, course } = req.body;
  const img = req.file.filename;
  let data = new StudentOfMonthSchema({ img, regno, name, course });
  let result = await data.save();
  res.status(200).json({
    code: 200,
    message: "  Student of month is Created successfully",
    error: false,
    status: true,
  });
};
const getStOfMonth = async (req, res) => {
  let data = await StudentOfMonthSchema.find();

  res.send(data);
};

const putStOfMonth = async (req, res) => {
  try {
    const img = req.file.filename;
    const { regno, name, course } = req.body;
    let data = await StudentOfMonthSchema.updateOne(
      { regno: req.params.regno },
      {
        $set: {
          img,
          regno,
          name,
          course,
        },
      }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const delStOfMonth = async (req, res) => {
  try {
    console.log(req.params);
    let data = await StudentOfMonthSchema.deleteOne({
      regno: req.params.regno,
    });
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

const createincome = async (req, resp) => {
  try {
    const { time, date, amount, desc } = req.body;
    let data = new IncomeSchema({
      time,
      date,
      amount,
      desc,
    });

    let result = await data.save();

    resp.send(result);
  } catch (err) {
    console.log(err);
  }
};

const getincome = async (req, res) => {
  let data = await IncomeSchema.find();

  res.send(data);
};
const getSingleincome = async (req, res) => {
  let data = await IncomeSchema.find({ _id: req.params._id });

  res.send(data);
};
const deleteincome = async (req, resp) => {
  try {
    console.log(req.params);
    let data = await IncomeSchema.deleteOne({ _id: req.params._id });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};
const putincome = async (req, res) => {
  try {
    const { time, date, amount, desc } = req.body;
    let data = await IncomeSchema.updateOne(
      { _id: req.params._id },
      {
        $set: {
          time,
          date,
          amount,
          desc,
        },
      }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

const createLibrary = async (req, resp) => {
  try {
    const {
      des,
      title,
      book_no,
      isbn_no,
      publisher,
      author,
      rack_no,
      qty,
      available,
      date,
    } = req.body;

    let data = new LibrarySchema({
      des,
      title,
      book_no,
      isbn_no,
      publisher,
      author,
      rack_no,
      qty,
      available,
      date,
    });

    let result = await data.save();

    resp.send(result);
  } catch (err) {
    console.log(err);
  }
};

const getLibrary = async (req, res) => {
  let data = await LibrarySchema.find();

  res.status(200).json({});
};
const getSingleLibrary = async (req, res) => {
  let data = await LibrarySchema.find({ book_no: req.params.book_no });

  res.send(data);
};
const deleteLibrary = async (req, resp) => {
  try {
    console.log(req.params);
    let data = await LibrarySchema.deleteOne({ book_no: req.params.book_no });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};
const putLibrary = async (req, res) => {
  try {
    const {
      des,
      title,
      book_no,
      isbn_no,
      publisher,
      author,
      rack_no,
      qty,
      available,
      date,
    } = req.body;
    let data = await LibrarySchema.updateOne(
      { book_no: req.params.book_no },
      {
        $set: {
          des,
          title,
          book_no,
          isbn_no,
          publisher,
          author,
          rack_no,
          qty,
          available,
          date,
        },
      }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

const createCategory = async (req, resp) => {
  try {
    let { name, desc } = req.body;
    const usermail = await CategorySchema.findOne({ name: name });
    console.log(usermail);
    if (usermail) {
      resp.status(404).json({
        code: 404,
        message: "Category aleready exist....  ",
        data: [],
        error: false,
        status: false,
      });
    } else {
      let data = new CategorySchema({ name, desc });

      await data.save();

      resp.status(200).json({
        code: 200,
        message: "category successfully",

        error: false,
        status: true,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const putCategory = async (req, res) => {
  try {
    let { name, desc } = req.body;

    let data = await CategorySchema.updateOne(
      { _id: req.params._id },
      { $set: { name, desc } }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const getCategory = async (req, res) => {
  let data = await CategorySchema.find();

  res.send(data);
};

const getSingleCategory = async (req, res) => {
  let data = await CategorySchema.find({ _id: req.params._id });

  res.send(data);
};

const deleteCategory = async (req, resp) => {
  try {
    console.log(req.params);
    let data = await CategorySchema.deleteOne({ _id: req.params._id });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};

const createinstructorOfMonth = async (req, res) => {
  const { name, course, desc } = req.body;
  const img = req.file?.filename || "image.jpg";
  let data = new InstructorOfMonthSchema({ img, name, course, desc });
  let result = await data.save();
  res.status(200).json({
    code: 200,
    message: "  Instructor of month is Created successfully",
    error: false,
    status: true,
  });
};
const getinstructorOfMonth = async (req, res) => {
  let data = await InstructorOfMonthSchema.find();
  res.send(data);
};
const getSingleinstructorofmonth = async (req, res) => {
  let data = await InstructorOfMonthSchema.find({ _id: req.params._id });
  res.send(data);
};

const putinstructorOfMonth = async (req, res) => {
  try {
    const img = req.file.filename;
    const { name, course, desc } = req.body;
    let data = await InstructorOfMonthSchema.updateOne(
      { _id: req.params._id },
      {
        $set: {
          img,
          name,
          course,
          desc,
        },
      }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const delinstructorOfMonth = async (req, res) => {
  try {
    console.log(req.params);
    let data = await InstructorOfMonthSchema.deleteOne({ _id: req.params._id });
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

const putApproveStStatus = async (req, res) => {
  try {
    const status = req.query.status;
    // console.log(status,req.params.regno)
    let data = await Student_RegisterSchema.updateOne(
      { regno: req.params.regno },
      {
        $set: {
          status: req.query.status,
        },
      }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

const createAppointment = async (req, resp) => {
  try {
    let { name, mobile, msg } = req.body;
    const usermail = await AppointmentSchema.findOne({ mobile: mobile });
    if (usermail) {
      resp.status(404).json({
        code: 404,
        message: "Mobile aleready exist....  ",
        data: [],
        error: false,
        status: false,
      });
    } else {
      let data = new AppointmentSchema({ name, mobile, msg });

      await data.save();

      resp.status(200).json({
        code: 200,
        message: "Appointment applied  successfully",

        error: false,
        status: true,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const putAppointment = async (req, res) => {
  try {
    let { name, mobile, msg } = req.body;

    let data = await AppointmentSchema.updateOne(
      { _id: req.params._id },
      { $set: { name, mobile, msg } }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const getAppointment = async (req, res) => {
  let data = await AppointmentSchema.find();

  res.send(data);
};

const getSingleAppointment = async (req, res) => {
  let data = await AppointmentSchema.find({ _id: req.params._id });

  res.send(data);
};

const deleteAppointment = async (req, resp) => {
  try {
    console.log(req.params);
    let data = await AppointmentSchema.deleteOne({ _id: req.params._id });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};
const createrolepermission = async (req, resp) => {
  try {
    const {
      id,
      enquiries,
      courseList,
      categories,
      studentList,
      instructorList,
      cashLedger,
      fees,
      scheduleClasses,
      events,
      manageStudent,
      scheduleBatches,
      monthlyAchievers,
      rolesPermission,
      joinInstructor,
      contact,
    } = req.body;
    //  let data = new rolesPermissionSchema({ id,enquiries,courseList,categories,studentList,instructorList,cashLedger,fees,scheduleClasses,events,manageStudent,scheduleBatches,monthlyAchievers,rolesPermission });
    //   let result=  await data.save();
    //   resp.send(result)
    const usermail = await rolesPermissionSchema.findOne({ id: id });
    console.log(usermail);
    if (usermail) {
      resp.status(404).json({
        code: 404,
        message: "Permission  aleready exist....  ",
        data: [],
        error: false,
        status: false,
      });
    } else {
      let data = new rolesPermissionSchema({
        id,
        enquiries,
        courseList,
        categories,
        studentList,
        instructorList,
        cashLedger,
        fees,
        scheduleClasses,
        events,
        manageStudent,
        scheduleBatches,
        monthlyAchievers,
        rolesPermission,
        joinInstructor,
        contact,
      });
      await data.save();
      resp.status(200).json({
        code: 200,
        message: "Permission allotted successfully",
        error: false,
        status: true,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const getrolepermission = async (req, res) => {
  let data = await rolesPermissionSchema.find();

  res.send(data);
};
const getSinglerolepermission = async (req, res) => {
  let data = await rolesPermissionSchema.find({ id: req.params.id });

  res.send(data);
};
const deleterolepermission = async (req, resp) => {
  try {
    console.log(req.params);
    let data = await rolesPermissionSchema.deleteOne({ _id: req.params._id });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};
const putrolepermission = async (req, res) => {
  try {
    const {
      id,
      enquiries,
      courseList,
      categories,
      studentList,
      instructorList,
      cashLedger,
      fees,
      scheduleClasses,
      events,
      manageStudent,
      scheduleBatches,
      monthlyAchievers,
      rolesPermission,
      joinInstructor,
      contact,
    } = req.body;
    let data = await rolesPermissionSchema.updateOne(
      { _id: req.params._id },
      {
        $set: {
          id,
          enquiries,
          courseList,
          categories,
          studentList,
          instructorList,
          cashLedger,
          fees,
          scheduleClasses,
          events,
          manageStudent,
          scheduleBatches,
          monthlyAchievers,
          rolesPermission,
          joinInstructor,
          contact,
        },
      }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const createContact = async (req, resp) => {
  try {
    const { name, email, contact, subject, desc } = req.body;
    let data = new ContactSchema({ name, email, contact, subject, desc });
    await data.save();
    resp.status(200).json({
      code: 200,
      message: "Register Contact form successfully",
      error: false,
      status: true,
    });
  } catch (err) {
    console.log(err);
  }
};

const getContact = async (req, res) => {
  let data = await ContactSchema.find();

  res.send(data);
};
const getSingleContact = async (req, res) => {
  let data = await ContactSchema.find({ id: req.params.id });

  res.send(data);
};
const deleteContact = async (req, resp) => {
  try {
    console.log(req.params);
    let data = await ContactSchema.deleteOne({ _id: req.params._id });
    resp.send(data);
  } catch (err) {
    console.log(err);
  }
};
const putContact = async (req, res) => {
  try {
    const { name, email, contact, subject, desc } = req.body;
    let data = await ContactSchema.updateOne(
      { _id: req.params._id },
      { $set: { name, email, contact, subject, desc } }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const createJoinAsInstructor = async (req, res) => {
  try {
    const { name, email, contact, qualification, exp, cv } = req.body;

    if (!name || !email || !contact || !qualification || !exp || !cv) {
      return res.status(400).json({
        code: 400,
        message: "Please provide all required fields.",
        error: true,
        status: false,
      });
    }

    const data = new JoinInstructorSchema({
      name,
      email,
      contact,
      qualification,
      exp,
      cv,
    });

    const result = await data.save();

    res.status(200).json({
      code: 200,
      message: "Request generated successfully",
      error: false,
      status: true,
      data: result, // You can include the saved data in the response if needed.
    });
  } catch (error) {
    console.error("Error creating instructor:", error);
    res.status(500).json({
      code: 500,
      message: error.message,
      error: true,
      status: false,
    });
  }
};

// const createJoinAsInstructor = async (req, res) => {
//   const { name, email, contact, qualification, exp } = req.body;
//   const cv = req.file.filename;
//   let data = new JoinInstructorSchema({
//     name,
//     email,
//     contact,
//     qualification,
//     exp,
//     cv,
//   });
//   let result = await data.save();
//   res.status(200).json({
//     code: 200,
//     message: " Request Generated successfully",
//     error: false,
//     status: true,
//   });
// };
const getJoinAsInstructor = async (req, res) => {
  let data = await JoinInstructorSchema.find();
  res.send(data);
};
const getSingleJoinAsInstructor = async (req, res) => {
  let data = await JoinInstructorSchema.find({ _id: req.params._id });
  res.send(data);
};

const putJoinAsInstructor = async (req, res) => {
  try {
    const { name, email, contact, qualification, exp, cv } = req.body;
    let data = await JoinInstructorSchema.updateOne(
      { _id: req.params._id },
      { $set: { name, email, contact, qualification, exp, cv } }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const delJoinAsInstructor = async (req, res) => {
  try {
    console.log(req.params);
    let data = await JoinInstructorSchema.deleteOne({ _id: req.params._id });
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

const SearchCourses = async (req, res) => {
  const { title } = req.query;
  try {
    let query = {};

    // Check if the 'type' parameter is provided
    if (title) {
      // If 'type' is provided, perform a case-insensitive search for titles starting with the specified alphabet
      query = { title: { $regex: new RegExp(`^${title}`, "i") } };
    }

    // Fetch data based on the query
    const response = await CourseSchema.find(query);

    res.status(200).json({ error: false, data: response, message: "success" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
const GetAllInstructorStudent = async (req, res) => {
  const { instructor } = req.params;
  try {
    const response = await CourseSchema.aggregate([
      { $match: { instructor: instructor } },
    ]);
    const allCourseArray = response?.map((item) => item.title);

    const GetAllStudents = await Student_RegisterSchema.aggregate([
      { $match: { course: { $in: allCourseArray } } },
    ]);

    res
      .status(200)
      .json({ error: false, message: "success", data: GetAllStudents });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Batches
const CreateBatch = async (req, res) => {
  const data = req.body;
  try {
    const response = await new BatchModel(data).save();
    if (!response)
      return res
        .status(400)
        .json({ error: true, message: "missing requried credentials" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const UpdateBatches = async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  try {
    const response = await BatchModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!response)
      return res
        .status(400)
        .json({ error: true, message: "missing Requried fields" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetAllBatches = async (req, res) => {
  const { instructor, id } = req.query;
  let _find;
  if (instructor) {
    _find = { instructor: new mongoose.Types.ObjectId(instructor) };
  } else if (id) {
    _find = { _id: new mongoose.Types.ObjectId(id) };
  } else {
    _find = {};
  }

  try {
    const response = await BatchModel.aggregate([
      { $match: _find },
      {
        $lookup: {
          from: "instructorregisters",
          foreignField: "_id",
          localField: "instructor",
          as: "instructor",
        },
      },
      { $unwind: "$instructor" },
      {
        $lookup: {
          from: "course_admins",
          foreignField: "_id",
          localField: "course",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $lookup: {
          from: "student_registers",
          foreignField: "_id",
          localField: "students",
          as: "students",
        },
      },
    ]);

    if (!response || response.length === 0) {
      return res.status(404).json({ error: true, message: "No data found" });
    }

    res.status(200).json({ error: false, message: "Success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const DeleteBatches = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await BatchModel.findByIdAndDelete(id);
    res.status(200).json({ error: false, message: "success", response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Certificates
const GenerateCertificates = async (req, res) => {
  const data = req.body;
  try {
    const response = await new CertificateModel(data).save();
    if (!response)
      return res
        .status(400)
        .json({ error: true, message: "missing requried fields " });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const UpdateCertificate = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const response = await CertificateModel.findByIdAndUpdate(id, data, {
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

const DeleteCertificate = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await CertificateModel.findByIdAndDelete(id);
    if (!response)
      return res.status(404).json({
        error: true,
        message: "no data found with this id to delete ",
      });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetAllCertificates = async (req, res) => {
  // certificate as per instructor or student
  const { instructor, student, course, srno } = req.query;
  let _find;
  if (instructor) {
    _find = { instructor: instructor };
  } else if (student) {
    _find = { student: student };
  } else if (course) {
    _find = { course: course };
  } else if (srno) {
    _find = { sr_no: srno };
  } else {
    _find = {};
  }

  try {
    const response = await CertificateModel.find(_find);
    if (!response)
      return res.status(404).json({ error: true, message: "no data found" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GenerateSerialNumber = async (req, res) => {
  const { courseid, studentId } = req.params;
  try {
    const [_find, _findStudent] = await Promise.all([
      CourseSchema.findOne({ _id: courseid }),
      Student_RegisterSchema.findOne({ _id: studentId }),
    ]);

    if (!_findStudent || _findStudent.course !== _find.title) {
      return res.status(400).json({
        error: true,
        message: "There is no record of this student completing this course",
      });
    }

    const createCertificateNumber = await GenerateCertificatesNumber(
      [_find.duration],
      _findStudent.admdate
    );

    res.status(200).json({ error: false, createCertificateNumber });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// ================ COurse Lession
const CreateCourseLession = async (req, res) => {
  const data = req.body;
  const { courseid } = req.params;

  const _findCourse = await CourseSchema.findById(courseid);
  try {
    const _createdData = await new CourseLessionModel({
      ...data,
      course: _findCourse._id,
    }).save();
    if (!_createdData)
      return res
        .status(400)
        .json({ error: true, message: "Missing required credentials" });
    res
      .status(200)
      .json({ error: false, message: "success", data: _createdData });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const UpdateCourseLession = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const response = await CourseLessionModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!response)
      return res
        .status(400)
        .json({ error: true, message: "missing required credentials " });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const deleteCouseLession = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await CourseLessionModel.findByIdAndDelete({ _id: id });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetAllCourseLession = async (req, res) => {
  const { course, search, subtitle } = req.query;

  let searchData = {};

  if (course) {
    searchData = { course: course };
  }
  if (search) {
    searchData = { title: { $regex: search, $options: "i" } };
  }
  if (subtitle) {
    searchData = { subtitle: { $regex: subtitle, $options: "i" } };
  }

  try {
    const _find = await CourseLessionModel.find(searchData);
    res.status(200).json({ error: true, message: "success", data: _find });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Holiday Controllers
const CreateHoliday = async (req, res) => {
  const data = req.body;
  try {
    const response = await new HolidayModel(data).save();
    if (!response)
      return res
        .status(400)
        .json({ error: true, message: "missing required  credentials" });
    res.status(200).json({ error: true, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// update
const Updateholiday = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await HolidayModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!response)
      return res
        .status(400)
        .json({ error: true, message: "missing required credentials " });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const DeleteHoliday = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await HolidayModel.findByIdAndDelete(id);
    res.status(200).json({ error: true, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetHoliday = async (req, res) => {
  const { from, to, search } = req.query;

  let searchData = {};

  if (from && to) {
    searchData = {
      from: { $gte: from },
      to: { $lte: to },
    };
  }

  if (search) {
    searchData = { name: { $regex: search, $options: "i" } };
  }
  try {
    const response = await HolidayModel.find(searchData);
    if (!response)
      return res.status(404).json({ error: true, message: "no data found" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// course wise student
const CourseWiseStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await CourseSchema.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "student_registers",
          localField: "title",
          foreignField: "course",
          as: "student",
        },
      },
    ]);
    if (!response)
      return res.status(404).json({ error: true, message: "no data found" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Day By Day Api

const CreateDayByDayPlan = async (req, res) => {
  const data = req.body;
  try {
    const response = await new DayByDayModel(data).save();
    if (!response)
      return res
        .status(400)
        .json({ error: true, message: "missing required credentials" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const DeleteDayByDayPlan = async (req, res) => {
  const { id } = req.params;
  const _delete = id.toLowerCase() !== "all" ? { _id: id } : {};
  try {
    const response = await DayByDayModel.deleteMany(_delete);
    if (response.deletedCount === 0)
      return res
        .status(404)
        .json({ error: true, message: "no data found to delete" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetDayByDay = async (req, res) => {
  const { search, course } = req.query;
  try {
    let searchData = {};

    if (search) {
      searchData["$or"] = [
        { "plan.theory": { $regex: search, $options: "i" } },
        { "plan.practical": { $regex: search, $options: "i" } },
      ];
    }

    if (course) {
      searchData.course = new mongoose.Types.ObjectId(course);
    }

    const response = await DayByDayModel.find(searchData);
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const UpdateDayByDay = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const response = await DayByDayModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!response)
      return res
        .status(400)
        .json({ error: true, message: "missing Required Credentials" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// ============ New Lession Plans  = ===========================

const NewLessionPlanCreate = async (req, res) => {
  const { courseid } = req.params;
  const formData = req.body;

  try {
    const response = await new NewCourseLessionSchema({
      ...formData,
      course: courseid,
    }).save();
    if (!response)
      return res
        .status(400)
        .json({ error: true, message: "missing required credentials " });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

async function NewLessionPlanUpdate(req, res) {
  try {
    const data = req.body;
    const { id } = req.params;
    const _update = await NewCourseLessionSchema.findByIdAndUpdate(
      id,
      { ...data },
      { new: true }
    );
    if (!_update)
      return res
        .status(400)
        .json({ error: true, message: "updation failed try again " });
    res.status(200).json({ error: false, message: "success", data: _update });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
}

async function NewLessionPlanDelete(req, res) {
  const { id } = req.params;
  try {
    const _delete = id.toLowerCase() === "all" ? {} : { _id: id };
    const response = await NewCourseLessionSchema.deleteMany(_delete);
    if (response.deletedCount === 0)
      return res
        .status(404)
        .json({ error: true, message: "No data found to delete" });
    res.status(200).json({ error: false, message: "deleted successfully " });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
}

async function NewLessionPlanGet(req, res) {
  const { id, course } = req.query;

  let _find = {};
  if (id) {
    _find._id = new mongoose.Types.ObjectId(id);
  }
  if (course) {
    _find.course = new mongoose.Types.ObjectId(course);
  }

  try {
    // const response = await NewCourseLessionSchema.find(_find).populate(
    //   "instructorList"
    // );
    const response = await NewCourseLessionSchema.aggregate([
      { $match: _find },
      {
        $lookup: {
          from: "instructorregisters",
          localField: "instructorList",
          foreignField: "_id",
          as: "instructorList",
        },
      },
    ]);
    if (!response)
      return res.status(404).json({ error: true, message: "No data found" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
}

async function GetLessionByCourse(req, res) {
  const { courseid } = req.params;

  try {
    // const response = await NewCourseLessionSchema.find({
    //   course: courseid,
    // });
    const response = await NewCourseLessionSchema.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseid) } },
      {
        $lookup: {
          from: "instructorregisters",
          localField: "instructorList",
          foreignField: "_id",
          as: "instructorList",
        },
      },
    ]);
    if (!response)
      return res
        .status(400)
        .json({ error: true, message: "No data found with this id " });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
}

async function NewLessionPlanGetByInstructor(req, res) {
  const { instructor } = req.params;
  try {
    const response = await NewCourseLessionSchema.aggregate([
      {
        $match: {
          instructorList: { $in: new mongoose.Types.ObjectId(instructor) },
        },
      },
      {
        $lookup: {
          from: "instructorregisters",
          localField: "instructorList",
          foreignField: "_id",
          as: "instructorList",
        },
      },
    ]);
    if (!response)
      return res
        .status(404)
        .json({ error: true, message: "No Data found with this id " });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
}

const UploadNotesOnLessionPlan = async (req, res) => {
  const { id, topicid } = req.params;
  const { notesLink } = req.query;
  try {
    const response = await NewCourseLessionSchema.findOneAndUpdate(
      {
        _id: id,
        "topic._id": topicid,
      },
      { $set: { "topic.$.notes": notesLink } },
      {
        new: true,
      }
    );
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

//Slider  =================

async function AddInSlider(req, res) {
  try {
    const _create = await new SliderModel(req.body).save();
    if (!_create)
      return res
        .status(400)
        .json({ error: true, message: "Image url Not found" });
    res.status(200).json({ error: false, message: "success", data: _create });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
}

const UpadateSliderImg = async (req, res) => {
  const { id, img } = req.params;
  try {
    const _updated = await SliderModel.findByIdAndUpdate(
      id,
      { img: img },
      { new: true }
    );
    if (!_updated)
      return res.status(400).json({
        error: true,
        message: "please check the image url and try again",
      });
    res.status(200).json({ error: false, message: "success", data: _updated });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const DeleteSliderImg = async (req, res) => {
  const { id } = req.params;
  const _delete = id.toLowerCase() === "all" ? {} : { _id: id };
  try {
    const response = await SliderModel.deleteMany(_delete);
    res
      .status(200)
      .json({ error: false, message: "success deleted", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetSliderImg = async (req, res) => {
  const { id } = req.query;

  try {
    const _find = id ? { _id: id } : {};
    // const response = await SliderModel.find(_find).distinct(select);
    const response = await SliderModel.aggregate([
      { $match: _find },
      {
        $group: {
          _id: "images",
          images: { $push: "$img" },
        },
      },
    ]);
    res
      .status(200)
      .json({ error: false, message: "success", data: response[0] });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetSlderImages = async (req, res) => {
  try {
    const response = await SliderModel.find({});
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// New Day by day ==========================================
const CreateDaybyDayPlan = async (req, res) => {
  try {
    const response = await new NewDayByDayModel(req.body).save();
    if (!response)
      return res
        .status(400)
        .json({ error: true, message: "missing required credentials " });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const UpdateDayByDayPlan = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const response = await NewDayByDayModel.findByIdAndUpdate(
      id,
      { ...data },
      { new: true }
    );

    if (!response)
      return res.status(400).json({
        error: true,
        message: "missing credentials ! error in updating",
      });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const DeleteNewDayByDayPlan = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await NewDayByDayModel.findByIdAndDelete(id);
    if (!response)
      return res
        .status(404)
        .json({ error: true, message: "no data found with this id to delete" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetAllDayByDay = async (req, res) => {
  const { course } = req.query;
  try {
    // const response = await NewDayByDayModel.aggregate([
    //   {
    //     $lookup: {
    //       from: "new_course_lessions",
    //       localField: "plan.theory",
    //       foreignField: "topic._id",
    //       as: "plansdata",
    //     },
    //   },
    //   {
    //     $project: {
    //       course: 1,
    //       plan: 1,
    //       plansData: { $arrayElemAt: ["$plansdata.topic", 0] },
    //     },
    //   },
    // ]);
    let _find = {};
    if (course) {
      _find = { course: course };
    }

    const response = await NewDayByDayModel.find(_find)
      .populate("course")
      .exec();
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetAllLessionTopics = async (req, res) => {
  const { course } = req.params;
  try {
    const response = await NewCourseLessionSchema.find({ course: course });

    // Extract topics from each document and flatten the array
    const allTopics = [].concat(...response.map((lesson) => lesson.topic));

    // Use a Set to ensure uniqueness
    const uniqueTopics = [...new Set(allTopics)];

    res
      .status(200)
      .json({ error: false, message: "success", data: uniqueTopics });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

//  ==========================Create new Setup ======================
const AddNewDataCashbook = async (req, res) => {
  const body = req.body;

  try {
    const response = await new CashbookModel(body).save();

    if (!response)
      return res
        .stutus(400)
        .json({ error: true, message: "missing some required credentials" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetAllCashbook = async (req, res) => {
  try {
    const response = await CashbookModel.find({});

    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const AddTheTransaction = async (req, res) => {
  const { year } = req.params;
  const formdata = req.body;
  try {
    const _add = await new TransactionsModel(formdata).save();
    if (!_add)
      return res
        .status(400)
        .json({ error: true, message: "Missing required Credentials" });

    await updateTheCashbook(year);
    res.status(200).json({ error: false, message: "success", data: _add });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const DeleteTransaction = async (req, res) => {
  const { id, year } = req.params;
  try {
    const response = await TransactionsModel.findByIdAndDelete(id);
    await updateTheCashbook(year);
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const UpdateTransaction = async (req, res) => {
  const { id, year } = req.params;
  const data = req.body;

  try {
    const response = await TransactionsModel.findByIdAndUpdate(id, data, {
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

const GetAllTransaction = async (req, res) => {
  const { type } = req.query;

  try {
    const _find = type ? { incomeType: type } : {};
    const _getAll = await TransactionsModel.find(_find);
    res.status(200).json({ error: true, message: "success", data: _getAll });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const ChangeTheStatusOfTransaction = async (req, res) => {
  const { id, year } = req.params;
  const { status } = req.query;
  try {
    const response = await TransactionsModel.findByIdAndUpdate(
      id,
      {
        approved: status,
      },
      {
        new: true,
      }
    );
    await updateTheCashbook(year);
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const CreateNewFinancialYear = async (req, res) => {
  try {
    const formdata = req.body;
    const _find = await CashBookYearModel.findOne({ year: formdata?.year });
    if (_find)
      return res.status(409).json({
        error: true,
        message: "already this financial year is created",
      });

    const Create_ = await new CashBookYearModel(req.body).save();
    if (!Create_)
      return res
        .status(404)
        .json({ error: true, message: "please fill the required credentials" });
    res.status(200).json({ error: false, message: "success", data: Create_ });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetTheYearTransactions = async (req, res) => {
  const { year } = req.params;
  try {
    const response = await TransactionsModel.aggregate([
      {
        $match: {
          approved: true,
          createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00Z`),
            $lte: new Date(`${year}-12-31T23:59:59Z`),
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    if (!response)
      return res
        .status(400)
        .json({ error: true, message: "No data found this year" });
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetUnapprovedData = async (req, res) => {
  const { year } = req.params;

  try {
    const response = await TransactionsModel.aggregate([
      {
        $match: {
          incomeType: "debit",
          createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00Z`),
            $lte: new Date(`${year}-12-31T23:59:59Z`),
          },
        },
      },
      { $sort: { approved: 1, createdAt: -1 } },
    ]);

    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetCashbookReport = async (req, res) => {
  const { year } = req.params;
  try {
    const Response = await CashBookYearModel.findOne({ year: year });

    res.status(200).json({ error: false, message: "success", data: Response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const GetAlltheCashbokYears = async (req, res) => {
  try {
    const response = await CashBookYearModel.find({}).distinct("year");
    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// get all the balance report as per instructor
const GetBlanceReportOfStudents = async (req, res) => {
  const { instructor } = req.params;
  const today = new Date();
  const todayYear = parseInt(moment(today).year());
  const todayMonth = moment(today).format("MM");
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);
  const month = parseInt(moment(lastMonth).format("MM"));
  const year = parseInt(moment(lastMonth).year());
  const dates = {
    startDate: new Date(year, month - 1, 1, 0, 0, 0),
    endDate: new Date(year, month, 0, 23, 59, 59),
  };

  // Format the date and time
  const lastMonthFormatted = lastMonth.toISOString();
  const firstDayOfCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );
  const firstDayOfCurrentMonthFormatted = firstDayOfCurrentMonth.toISOString();

  try {
    const response = await BatchModel.aggregate([
      {
        $facet: {
          data: [
            { $match: { instructor: new mongoose.Types.ObjectId(instructor) } },
            {
              $lookup: {
                from: "course_admins",
                localField: "course",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      title: 1,
                      price: 1,
                    },
                  },
                ],
                as: "course",
              },
            },
            { $unwind: "$course" },
            {
              $lookup: {
                from: "student_registers",
                foreignField: "_id",
                localField: "students",
                pipeline: [
                  {
                    $lookup: {
                      from: "addfee_tbls",
                      foreignField: "student",
                      localField: "_id",
                      pipeline: [
                        { $sort: { createdAt: -1 } },
                        {
                          $group: {
                            _id: "$course",
                            AmountPaid: { $sum: "$paid" },
                            AmountDue: { $first: "$pending" },
                            feeEntries: { $push: "$$ROOT" },
                          },
                        },
                        {
                          $project: {
                            _id: 1,
                            AmountDue: 1,
                            AmountPaid: 1,
                            lastMonthPaid: {
                              $arrayElemAt: [
                                {
                                  $map: {
                                    input: {
                                      $filter: {
                                        input: "$feeEntries",
                                        as: "entry",
                                        cond: {
                                          $eq: [
                                            {
                                              $dateToString: {
                                                date: "$$entry.date",
                                                format: "%Y-%m",
                                              },
                                            },
                                            {
                                              $dateToString: {
                                                date: new Date(
                                                  lastMonthFormatted
                                                ),
                                                format: "%Y-%m",
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    },
                                    as: "filteredEntry",
                                    in: { $sum: "$$filteredEntry.paid" },
                                  },
                                },
                                0,
                              ],
                            },
                            feeDate: `${todayYear}-${todayMonth}-01T00:20:28Z`,
                          },
                        },
                      ],
                      as: "payments",
                    },
                  },
                  {
                    $lookup: {
                      from: "course_admins",
                      localField: "course",
                      foreignField: "title",
                      pipeline: [
                        {
                          $project: {
                            price: 1,
                          },
                        },
                      ],
                      as: "courseFee",
                    },
                  },
                  {
                    $project: {
                      regno: 1,
                      name: 1,
                      amountDue: {
                        $ifNull: [
                          { $arrayElemAt: ["$payments.AmountDue", 0] },
                          { $arrayElemAt: ["$courseFee.price", 0] },
                        ],
                      },
                      amountPaid: {
                        $ifNull: [
                          { $arrayElemAt: ["$payments.AmountPaid", 0] },
                          0,
                        ],
                      },
                      lastMonthPaid: {
                        $ifNull: [
                          { $arrayElemAt: ["$payments.lastMonthPaid", 0] },
                          0,
                        ],
                      },
                      feeDate: {
                        $ifNull: [
                          { $arrayElemAt: ["$payments.feeDate", 0] },
                          `${todayYear}-${todayMonth}-01T00:20:28Z`,
                        ],
                      },

                      admdate: 1,
                      shift: 1,
                      course: 1,
                      contact: 1,
                      status: 1,
                      courseFee: { $arrayElemAt: ["$courseFee.price", 0] },
                    },
                  },
                ],
                as: "students",
              },
            },
            {
              $lookup: {
                from: "instructorregisters",
                foreignField: "_id",
                localField: "instructor",
                pipeline: [
                  {
                    $project: {
                      name: 1,
                    },
                  },
                ],
                as: "instructor",
              },
            },
            { $unwind: "$instructor" },
            {
              $project: {
                _id: 1,
                instructor: 1,
                batchTime: 1,
                course: 1,
                students: 1,
                createdAt: 1,
                updatedAt: 1,
                totalAmountPaid: {
                  $sum: "$students.amountPaid",
                },
                totalAmountDue: {
                  $sum: "$students.amountDue",
                },
                totalLastMonthPaid: {
                  $sum: "$students.lastMonthPaid",
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          finalMonthPaid: { $sum: "$data.totalLastMonthPaid" },
          finalAmountPaid: { $sum: "$data.totalAmountPaid" },
          finalAmoutDue: { $sum: "$data.totalAmountDue" },
        },
      },
    ]);

    res.status(200).json({ error: false, message: "success", data: response });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

module.exports = {
  // Balance Reports
  GetBlanceReportOfStudents,
  // ================Financial years ===========
  CreateNewFinancialYear,
  ChangeTheStatusOfTransaction,
  GetTheYearTransactions,
  GetUnapprovedData,
  // Casbookin and transaction route ===========
  AddNewDataCashbook,
  GetAlltheCashbokYears,
  GetAllCashbook,
  AddTheTransaction,
  DeleteTransaction,
  UpdateTransaction,
  GetAllTransaction,
  GetCashbookReport,

  // New Day By Day ===================
  CreateDaybyDayPlan,
  UpdateDayByDayPlan,
  GetAllLessionTopics,
  DeleteNewDayByDayPlan,
  GetAllDayByDay,
  // Slider ====================================
  GetSlderImages,
  AddInSlider,
  UpadateSliderImg,
  DeleteSliderImg,
  GetSliderImg,
  // New Create lessions APi ====================================
  NewLessionPlanCreate,
  NewLessionPlanUpdate,
  NewLessionPlanDelete,
  UploadNotesOnLessionPlan,
  NewLessionPlanGet,
  GetLessionByCourse,
  NewLessionPlanGetByInstructor,
  // Day By day Plan ===========================
  CreateDayByDayPlan,
  DeleteDayByDayPlan,
  GetDayByDay,
  UpdateDayByDay,
  // create lession and sub lesssion ===================================
  CreateCourseLession,
  UpdateCourseLession,
  deleteCouseLession,
  GetAllCourseLession,
  // Holidays ==================================
  CreateHoliday,
  Updateholiday,
  DeleteHoliday,
  GetHoliday,
  // certificates
  GenerateCertificates,
  UpdateCertificate,
  DeleteCertificate,
  GetAllCertificates,
  GenerateSerialNumber,
  // ---------cetrificates end --------------
  createJoinAsInstructor,
  getJoinAsInstructor,
  GetAllInstructorStudent,
  getSingleJoinAsInstructor,
  putJoinAsInstructor,
  delJoinAsInstructor,
  createContact,
  getContact,
  getSingleContact,
  deleteContact,
  putContact,
  UpdateInstructorData,
  createrolepermission,
  getrolepermission,
  getSinglerolepermission,
  deleterolepermission,
  putrolepermission,

  createAppointment,
  putAppointment,
  getAppointment,
  getSingleAppointment,
  deleteAppointment,
  SearchCourses,
  putApproveStStatus,

  getSingleinstructorofmonth, //all the instructor Off Months
  createinstructorOfMonth,
  getinstructorOfMonth,
  putinstructorOfMonth,
  delinstructorOfMonth,

  createCategory,
  putCategory,
  getCategory,
  deleteCategory,
  getSingleCourse,
  getSingleCategory,
  createLibrary,
  getLibrary,
  getSingleLibrary,
  deleteLibrary,
  putLibrary,
  createincome,
  getincome,
  getSingleincome,
  deleteincome,
  putincome,
  createInstructor,
  putInstructor,
  getInstructor,
  createCourse,
  getCourse,
  putCourse,
  putExpense,
  createStOfMonth,
  getStOfMonth,
  putStOfMonth,
  delStOfMonth,
  deleteCourse,
  deleteInstructor,
  createEnquiry,
  getEnquiry,
  deleteEnquiry,
  handleEnquiryStatus,
  createAdmin,
  loginAdmin,
  putAdmin,
  getAdmin,
  deleteAdmin,
  createExpense,
  getExpense,
  deleteExpense,
  putEnquiry,
  getSingleInstructor,
  getSingleExpense,
  getSingleAdmin,
  // Batches
  CreateBatch,
  UpdateBatches,
  GetAllBatches,
  DeleteBatches,
  CourseWiseStudent,
};

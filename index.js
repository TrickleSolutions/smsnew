const express = require("express");
const app = express();
const path = require("path");
require("./funcs/FinancialYear");
const SendOtpRoute = require("./Routers/sendotproutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const UtilsRouters = require("./Routers/utils");

const PORT = process.env.PORT || 8000;
const adminRouter = require("./Routers/admin/adminRouter");
const StudentRoute = require("./Routers/students/StudentRoute");
const TeacherRoute = require("./Routers/teachers/TeacherRoute");

// app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());
app.use(cors());

app.use("/public", express.static("public"));
app.use(express.static(path.join(__dirname, "build")));

require("./config/config");
const oneYearInSeconds = 365 * 24 * 60 * 60;
const maxAge = oneYearInSeconds * 1000;

app.use("/api", adminRouter);
app.use("/api", StudentRoute);
app.use("/api", TeacherRoute);
app.use("/api", SendOtpRoute);
app.use("/api", UtilsRouters);

app.use(
  "/api/coursepic",
  express.static("./assets/admin/course_upload", { maxAge })
);
app.use(
  "/api/assignmentpic",
  express.static("./assets/teachers/assignment_upload", { maxAge })
);
app.use(
  "/api/eventpic",
  express.static("./assets/teachers/events_upload", { maxAge })
);
app.use(
  "/api/incomepic",
  express.static("./assets/teachers/incomr_upload", { maxAge })
);
app.use(
  "/api/stprofilepic",
  express.static("./assets/students/stprofilepic", { maxAge })
);
app.use(
  "/api/videocontent",
  express.static("./assets/teachers/CourseContent", { maxAge })
);
app.use(
  "/api/docxcontent",
  express.static("./assets/teachers/CourseContent", { maxAge })
);
app.use(
  "/api/teacherpic",
  express.static("./assets/admin/instructorProfile", { maxAge })
);
app.use(
  "/api/adminpic",
  express.static("./assets/admin/anminprofile", { maxAge })
);
app.use(
  "/api/studentofmonth",
  express.static("./assets/admin/studentofmonth", { maxAge })
);
app.use(
  "/api/instructorofmonths",
  express.static("./assets/admin/instructorofmonth", { maxAge })
);
app.use(
  "/api/showcontactcv",
  express.static("./assets/admin/joinasinstructor", { maxAge })
);
app.use(express.static("./assets/uploads"));

app.listen(PORT, () => {
  console.log("Hi Amit your server is running at  this :" + PORT);
});

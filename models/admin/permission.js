// const [enquiries, setEnquiries] = useState("");

//  id,enquiries,courseList,categories,studentList,instructorList,cashLedger,fees,scheduleClasses,events,manageStudent,scheduleBatches,monthlyAchievers,rolesPermission

//   const [courseList, setCourseList] = useState("");
//   const [categories, setCategories] = useState("");
//   const [studentList, setStudentList] = useState("");
//   const [instructorList, setInstructorList] = useState("");
//   const [cashLedger, setCashLedger] = useState("");
//   const [fees, setFees] = useState("");
//   const [scheduleClasses, setScheduleClasses] = useState("");
//   const [events, setEvents] = useState("");
//   const [manageStudent, setManageStudent] = useState("");
//   const [scheduleBatches, setScheduleBatches] = useState("");
//   const [monthlyAchievers, setMonthlyAchievers] = useState("");
//   const [rolesPermission, setRolesPermission] = useState("")
const mongoose = require("mongoose");
const rolesPermissionSchema = new mongoose.Schema({

   id: {
      type: String,
      default: false
   },

   enquiries: {
      type: Boolean,
      default: false
   },

   courseList: {
      type: Boolean,
      default: false
   },
   categories: {
      type: Boolean,
      default: false
   },
   studentList: {
      type: Boolean,
      default: false
   },
   instructorList: {
      type: Boolean,
      default: false
   },
   cashLedger: {
      type: Boolean,
      default: false
   },
   fees: {
      type: Boolean,
      default: false
   },
   scheduleClasses: {
      type: Boolean,
      default: false
   },
   events: {
      type: Boolean,
      default: false
   },
   manageStudent: {
      type: Boolean,
      default: false
   },
   scheduleBatches: {
      type: Boolean,
      default: false
   },
   monthlyAchievers: {
      type: Boolean,
      default: false
   },
   rolesPermission: {
      type: Boolean,
      default: false
   },
   joinInstructor: {
      type: Boolean,
      default: false
   },
   contact: {
      type: Boolean,
      default: false
   },
});


module.exports = mongoose.model('rolesPermission_tbl', rolesPermissionSchema);

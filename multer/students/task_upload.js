const multer=require("multer")
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./assets/students/task_upload')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
});

var fileFilter=(req,file,cb)=>{
    if(file.mimetype=='application/pdf' || file.mimetype=='application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype=='application/msword'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
var tast_assignment_upload=multer({
    storage:storage,
    limits:{
        filesize:1024*1024*5
    },
   fileFilter:fileFilter

})
module.exports=tast_assignment_upload;
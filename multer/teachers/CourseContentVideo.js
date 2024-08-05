 
const multer=require("multer")
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./assets/teachers/CourseContent')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
});

var fileFilter=(req,file,cb)=>{
    if(file.mimetype=='video/webm' || file.mimetype=='video/ogg' || file.mimetype=='video/mp4'  || file.mimetype=='video/mpeg'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
var  coursecontentvideo_upload=multer({
    storage:storage,
    limits:{
        filesize:1024*1024*50
    },
  fileFilter:fileFilter

})
module.exports=coursecontentvideo_upload;
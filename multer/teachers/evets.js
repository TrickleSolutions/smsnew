const multer=require("multer")
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./assets/teachers/events_upload')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
});
 
var events_upload=multer({
    storage:storage 
})
module.exports=events_upload;
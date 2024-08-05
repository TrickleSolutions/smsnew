const multer=require("multer")
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./assets/students/stprofilepic')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
});

var fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/jpg' || file.mimetype==='image/png'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
var studentProfile_upload=multer({
    storage:storage,
   limits:{
       filesize:1024*1024*5
   },
   fileFilter:fileFilter

})
module.exports=studentProfile_upload;
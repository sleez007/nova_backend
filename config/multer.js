const multer = require('multer');
const mkdirp = require('mkdirp');
const path = require('path');
const uuid = require('uuid');

const storage = multer.diskStorage({
    destination: function(req,file, cb){
        //This means the user is trying to upload their profile avatar
        let filePath = ""
        try{
            if(req.params.sub_folder != null){
                filePath = path.join('.', 'public','images',req.params.folder,req.params.sub_folder);
                mkdirp.sync(filePath);
                //console.log(dir);
                return cb(null, filePath);
            }else{
                filePath = path.join('.', 'public','images',req.params.folder);
                const dir = mkdirp.sync(filePath);
                return cb(null, filePath);
            }
        }catch(ex){
            return cb(new Error('Error while creating folder', filePath));
        }
        
    },
    filename:function(req, file, cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
          } else {
            let newFileName = uuid.v4();
            return cb(null, newFileName + path.extname(file.originalname));
          }
    }
});

exports.upload =  multer({ storage: storage });
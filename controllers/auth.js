const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const twiloClient = require('twilio')(process.env.TWILO_SECRET_ID, process.env.TWILO_TOKEN);
var mongoose = require('mongoose');

const UserModel = require('../models/user');

const appConfig = require('../config/appConfig');
exports.phoneVerification = async(req, res, next) =>{
    const errors = validationResult(req);
    console.log(req.body);
    try{
        if(!errors.isEmpty()){
            res.json({msg :errors.array()[0].msg, isSuccessful: false});
            return;
        }
        const OTP_CODE = Math.floor(1000 + Math. random() * 9000);
        console.log(OTP_CODE);
        const  {telNo, country} = req.body;
        const token = generateToken(telNo);
        const user = await UserModel.findOne({telNo}).lean();
        if(user){
            var data = {
                country,
                verify_code: OTP_CODE,
                auth_token: token,
                activated: false
            };
            const uu = await UserModel.findOneAndUpdate({telNo},data,{new:true});
            if(uu){
                await sendOtp(telNo,OTP_CODE);
                res.json({isSuccessful: true, msg:`Sent verification code`});
            }else{
                res.json({msg :'An error occured, Please retry!', isSuccessful: false});
            }
            
        }else{
            var data = {telNo,country,verify_code: OTP_CODE,auth_token: token,activated: false};
            const status = appConfig.SETTING.STATUS;
            const User = new UserModel(data);
            User.status = status.map((item,i)=>{
                return {
                    _id: new mongoose.Types.ObjectId(),
                    userId: User._id,
                    body: item,
                    current: (i == (status.length-1)) ? true :false
                }
            });
            const uu = await User.save();
            if(uu){
                await sendOtp(telNo,OTP_CODE);
                res.json({isSuccessful: true, msg:`Sent verification code`});
            }else{
                res.json({msg :'An error occured, Please retry!', isSuccessful: false});
            }
        }
        

    }catch(ex){
        console.log(ex)
        next(ex);
    }
}

//OTP VERIFICATION
exports.optVerification = async(req, res, next) =>{
    const errors = validationResult(req);
    console.log(req.body);
    try{
        if(!errors.isEmpty()){
            res.json({msg :errors.array()[0].msg, isSuccessful: false});
            return;
        }
        const {telNo, otp_code} = req.body;
        const otp = otp_code;
        const user = await UserModel.findOneAndUpdate({telNo,verify_code: otp},{activated: true},{new:true}).lean();
        if(user){
            res.json({
                msg:'Verification complete!',
                id:user._id,
                token: user.auth_token,
                hasProfile: false,
                isSuccessful: true
            });
        }else{
            res.json({
                msg:'Incorrect Otp Code!',
                id:null,
                token: null,
                hasProfile: false,
                isSuccessful: false
            });
        }
        
    }catch(ex){
        console.log(ex)
        next(ex);
    }
}

exports.createProfile = async(req, res, next)=>{
    console.log(req.file, req.params);
    
   // const errors = validationResult(req);
    try{
        const user = await UserModel.findByIdAndUpdate(req.params.sub_folder,{username:req.params.name, image:req.file.path});
        if(user){
            res.status(201).json({
                isSuccessful: true,
                msg: "Profile updated!",
                filename: req.file.filename
            })
        }else{
            res.json({
                isSuccessful: false,
                filename:'',
                msg:'Update failed. Try again!'
            })
        }
    }catch(ex){
        throw ex;
        next(ex);
    }
}

/**
 * @param {*} telNo this parameter is the tel no of the person to be authenticated.
 */
const generateToken = (telNo)=>{
    return jwt.sign({phone:telNo},appConfig.JWT_SECRET,{expiresIn:appConfig.JWT_EXPIRATION})
}


/**
 * @param {*} telNo this parameter is the tel no of the person receiving the OTP
 * @param {*} OTP    THIS is the OTP Verification code
 */
const sendOtp = async(telNo, OTP)=>{
    const message = `Hello, Welcome to ${process.env.APP_NAME}. Your OTP Verification code is : ${OTP}     ${process.env.APP_HASH}`
    return await twiloClient.messages.create({
        body: message,
        from:process.env.FROM_PHONE,
        to: telNo
    })
}


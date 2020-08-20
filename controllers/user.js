
const UserModel = require('../models/user');

/**
 * 
 * @param {*} req req obj
 * @param {*} res  res obj
 * @param {*} next  next middleware
 * @description This method retrieves all my contacts and matches the ones already on the app
 */
exports.allMyContacts = async(req, res, next)=>{
    try{
        const { userList } = req.body
        console.log(userList)
        const finalList = [];
        //await userList.forEach(async(user, index)
        for(let i = 0 ; i < userList.length; ++i){
            let user = userList[i];
            let userObj = {
                _id:user.contactID,
                contactId:user.contactID ,
                username:user.contactName || user.phoneNumber ,
                linked: false,
                activated : false,
                exist: true,
                phone: user.phoneNumber,
                phoneQuery:user.phoneQuery,
                image:"",
                status :null
            };
        const result =  await UserModel.findOne({telNo:{$regex : '.*'+user.phoneQuery+'.*'}}).select('-auth_token').lean()
        if(result){
            userObj._id=result._id;
            userObj.username =user.contactName.trim()==''? result.username: user.contactName.trim();
            userObj.linked= true;
            userObj.activated = result.activated
            userObj.phone = user.phoneNumber
            userObj.image = result.image;
            userObj.phoneQuery = result.telNo;
            userObj.status = result.status.find((val)=>val.current== true);
        }

        finalList.push(userObj)
        
        }

        console.log(finalList);
        res.json({
            isSuccessful: true,
            msg:'Synced contacts',
            contacts: finalList
        })
    }catch(ex){
        console.log(ex)
        next(ex);
    }

}

//UsersEntity(_id=0, contactID=2828, contactName=Sme Babe, phoneNumber=+09062943115, phoneQuery=9062943115, linked=false, active=false, exists=false, image=null), UsersEntity(_id=0, contactID=1283, contactName=Mama Emerie, phoneNumber=+09066171997, phoneQuery=9066171997, linked=false, active=false, exists=false, image=null
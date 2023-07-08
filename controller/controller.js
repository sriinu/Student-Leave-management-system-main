const Warden = require("../models/warden"),
Hod = require("../models/hod"),
Student = require("../models/student"),
jwt=require('jsonwebtoken');
require('dotenv').config();


//auth Middlerware
const protect=async(req,res)=>{
    let token
    try{
            if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
            //get token from headers
            token=req.headers.authorization.split(' ')[1]
            //verify token
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            //get user from the token
            req.std=await Student.findById(decoded.id).select('password');
            req.hod=await Hod.findById(decoded.id).select('password');
            req.warden=await Warden.findById(decoded.id).select('password');
            res.status(200).send(true);   
        }
        else if(!token){
          res.status(401).send(false);
        }
        }catch (error){
            console.log(error)
            res.status(402).send('not authorised!');
        }
  };
module.exports={
    protect
}
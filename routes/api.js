const express=require('express');
const Warden = require("../models/warden"),
mongoose=require('mongoose'),  
Hod = require("../models/hod"),
Leave = require("../models/leave"),
Student = require("../models/student"),
bcrypt=require('bcryptjs'),
jwt=require('jsonwebtoken');
const router=express.Router();
const {
    protect
}=require('../controller/controller');
const leave = require('../models/leave');
 
//view routes
router.get('/',(req,res)=>{
  res.render('home');
});
router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/std/login", (req, res) => {
  res.render("login");
});
router.get("/h.o.d/login", (req, res) => {
  res.render("hodlogin");
});
router.get("/wrdn/login", (req, res) => {
  res.render("wardenlogin");
});



//post
router.post('/student/register',async(req,res)=>{
  try {
  const type = req.body.type;
  //std register
  if(type=='student'){
     try {
      const {name,username,password,type,password2,hostel,department,image,leaves}=req.body;
      if(!name||!username||!type||!password||!password2||!hostel||!image||!department){
          res.send('Please add fields')
        }
        //check if user exist
        const userExist=await Student.findOne({name});
        if(userExist){
          res.send('Student already Exists!!')
        }
        if(password!==password2){
          res.send('Password doesnot match!')
        }
        //Hashing password 
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt);
        //create user
        const StdReg=await Student.create({
          leaves,
          name,
          username,
          password,
          type,
          hostel,
          image,
          department,
          password:hashedPassword
          
        })
        if(StdReg){
          res.redirect("/std/login");
        }else{
          res.status(400).send('Invalid User Data')
        }
     } catch (error) {
      res.send(error.message)
     }
  }
  //hod register
  else if(type=='hod'){
      try {
          const {name,username,password,type,password2,hostel,department,image,leaves}=req.body;
          if(!name||!username||!type||!password||!password2||!hostel||!image||!department){
              res.status(400).send('Please add fields')
            }
            //check if user exist
            const userExist=await Hod.findOne({name});
            if(userExist){
              res.send('HOD already Exists!!')
            }
            if(password!==password2){
              res.send('Password does not match!')
            }
            //Hashing password 
            const salt=await bcrypt.genSalt(10)
            const hashedPassword=await bcrypt.hash(password,salt);
            //create user
            const HodReg=await Hod.create({
              leaves,
              name,
              username,
              password,
              type,
              hostel,
              image,
              department,
              password:hashedPassword
              
            })
            if(HodReg){
              res.redirect('/h.o.d/login')
            }else{
              res.send('Invalid User Data')
            }
      } catch (error) {
          res.send(error.message)
      }
  }
  //warden register
  else if(type=='warden'){
      try {
          const {name,username,password,type,password2,hostel,department,image}=req.body;
          if(!name||!username||!type||!password||!password2||!hostel||!image||!department){
              res.send('Please add fields')
            }
            //check if user exist
            const userExist=await Warden.findOne({name});
            if(userExist){
              res.send('Warden already Exists!!')
            }
            if(password!==password2){
              res.send('Password doesnot match!')
            }
            //Hashing password 
            const salt=await bcrypt.genSalt(10)
            const hashedPassword=await bcrypt.hash(password,salt);
            //create user
            const WrdReg=await Warden.create({
              name,
              username,
              password,
              type,
              hostel,
              image,
              department,
              password:hashedPassword
              
            })
            if(WrdReg){
                res.redirect("/wrdn/login");
            }else{
              res.send('Invalid User Data')
            }
      } catch (error) {
          res.send(error.message)
      }
  }
  } catch (error) {
      res.send(error.message)
  }
});



router.post('/student/login',async(req,res)=>{
  //login
    const {username,password}=req.body;
    const std=await Student.findOne({username})
    if(std&&(await bcrypt.compare(password,std.password))){
    res.redirect('/student/home/'+std.id);
    }else{
    res.send('Invalid Credentials')
    }
});

router.post('/hod/login',async(req,res)=>{
  const {username,password}=req.body;
  const hod=await Hod.findOne({username})
  if(hod&&(await bcrypt.compare(password,hod.password))){
  res.redirect('/hod/home/'+hod.id);
  }else{
  res.send('Invalid Credentials')
  }
});

router.post('/warden/login',async(req,res)=>{
  const {username,password}=req.body;
  const wrd=await Warden.findOne({username})
  if(wrd&&(await bcrypt.compare(password,wrd.password))){
  res.redirect("/warden/home/"+wrd.id);
  }else{
  res.send('Invalid Credentials')
  }
});

router.get('/student/home/:id',async(req,res)=>{
  try{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).send({error:'No such User'})
    } 
    const stdReal= await Student.findById({_id:id})
    if(stdReal){
      try{
        const findStdLeaves=await Leave.find({std_id:id}).sort({createdAt:-1})
        const findStdDetails=await Student.findById({_id:id})
        res.render("homestud", { student: findStdDetails, Leav:findStdLeaves });
      }catch(err){
        res.redirect("/student/home/" +req.params.id);
        res.send(err.message)
      }
    }
  }catch(err){
    res.redirect("/student/home/" +req.params.id);
    console.log(err.message)
  }
})
//get std profile
router.get("/student/:id",async(req, res) => {
  try {
    const {id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).send({error:'No such User'})
    } 
  const profile= await Student.findById({_id:id})
  res.render("profilestud", { student: profile });
  } catch (error) {
    res.send('Error:',error.message)
  }
});
//edit std profile
router.get("/student/:id/edit", async(req, res) => {
  try {
    const {id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).send({error:'No such User'})
    } 
  const profileEdit= await Student.findById({_id:id})
  res.render("editS", { student: profileEdit });
  } catch (error) {
    res.send('Error:',error.message)
  }
});
//submit std edit profile
router.patch("/student/:id",async(req, res) => {
  try {
    const {id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.send({error:'No such User'})
    } 
  const profileEditSubmit= await Student.findOneAndUpdate({_id:id},{
    ...req.body
  })
  if(!profileEditSubmit){
    return res.send({error:'No such User'})
  }
  res.redirect("/student/" + req.params.id);
} catch (error) {
    res.redirect('back');
    res.send(error.message)
  }
});

//apply for leave std
router.get("/student/:id/apply", async(req, res) => {
  try {
    const {id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).send({error:'No such User'})
    } 
  const leave= await Student.findById({_id:id})
  res.render("leaveApply", { student: leave });
  } catch (error) {
    res.send('Error:',error.message)
    res.redirect("back")
  }
});
//submit std leave
router.post("/student/apply/:id",async(req,res)=>{
  try{
 const {id}=req.params;
 if(!mongoose.Types.ObjectId.isValid(id)){
  return res.send({error:'No such User'})
} 
const stdReal= await Student.findById({_id:id})
if(stdReal){
  try{
    // const date = new Date(req.body.from);
    // const year = date.getFullYear();
    // const month = date.getMonth() + 1;
    // const dt = date.getDate();

    // const today = new Date(req.body.to);
    // const todt = today.getDate();
    // const year1 = date.getFullYear();
    // const month1 = date.getMonth() + 1;
    //     if (dt < 10) {
    //       dt = "0" + dt;
    //     }
    //     if (month < 10) {
    //       month = "0" + month;
    //     }
    //     req.body.days = todt - dt; 
    const {name,hostel,subject,status,to,from,days,department}=req.body;
     await Leave.create({
      std_id:id,
      name:stdReal.name,
      subject:subject,
      from:from,
      to:to,
      hostel:stdReal.hostel,
      days:days,
      status:status,
      department:stdReal.department,
    })
    res.redirect("/student/home/" +req.params.id);
  }catch(err){
    res.redirect("/student/home/" +req.params.id);
    res.send(err.message)
  }
}
  }catch(err){
    res.send(err.message)
  }
});


//track leave
router.get("/student/:id/track", async(req, res) => {
  try {
    const {id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.send({error:'No such User'})
    } 
  const std= await Student.findById({_id:id})
  //const wrden=await Warden.findById({});
  if(std){
    try{
      const leavestd=await Leave.find({std_id:id}).sort({createdAt:-1})
      res.render("trackLeave", {student:std, leav: leavestd });
    }catch(err){
      res.redirect("/student/home/" +req.params.id);
      res.send(err.message)
    }
  }
  } catch (error) {
    res.send(error.message)
  }
});

//hod home
router.get("/hod/home/:id",async(req, res) => {
  try {
    const {id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).send({error:'No such User'})
    } 
  const hod= await Hod.findById({_id:id})
  res.render("homehod", { hod: hod });
  } catch (error) {
    res.send('Error:',error.message)
  }
});
//get hod profile
router.get("/hod/:id",async(req, res) => {
  try {
    const {id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.send({error:'No such User'})
    } 
  const Hodprofile= await Hod.findById({_id:id})
  res.render("profilehod", { hod: Hodprofile });
  } catch (error) {
    res.send('Error:',error.message)
  }
});
//edit hod profile
router.get("/hod/:id/edit", async(req, res) => {
  try {
    const {id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.send({error:'No such User'})
    } 
  const HodprofileEdit= await Hod.findById({_id:id})
  res.render("editH", { hod: HodprofileEdit });
  } catch (error) {
    res.send('Error:',error.message)
  }
});
//submit hod edit profile
router.put("/hod/:id",async(req, res) => {
  try {
    const {id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.send({error:'No such User'})
    } 
  const profileEditSubmit= await Hod.findOneAndUpdate({_id:id},{
    ...req.body
  })
  if(!profileEditSubmit){
    return res.send({error:'No such User'})
  }
  res.redirect("/hod/" + req.params.id);
} catch (error) {
    res.redirect('back');
    res.send(error.message)
  }
});
//get leaves for hod
router.get("/hod/:id/leave", async(req, res) => {
  try {
    const {id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.send({error:'No such User'})
    } 
  const hod= await Hod.findById({_id:id})
  if(hod){
    try{
      const leaves=await Leave.find({ department: hod.department }).sort({createdAt:-1});
      console.log(leaves)
      res.render("hodLeaveSign", {
                      hod: hod,
                      students: leaves
                    });
    }catch (err){
      res.send(err.message);
      res.redirect("back");
    }
  }
  } catch (error) {
    res.status(503).send(error.message)
    res.redirect("back")
  }
});

//get warden home
router.get("/warden/home/:id",async(req, res) => {
  try {
    const {id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.send({error:'No such User'})
    } 
  const homeWrd= await Warden.findById({_id:id})
  res.render("homewarden", { warden: homeWrd });
  } catch (error) {
    res.send('Error:',error.message)
  }
});
//get warden profile
router.get("/warden/:id",async(req, res) => {
  try {
    const {id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.send({error:'No such User'})
    } 
  const Wrdnprofile= await Warden.findById({_id:id})
  res.render("profilewarden", { warden: Wrdnprofile });
  } catch (error) {
    res.send('Error:',error.message)
  }
});
//edit warden profile
router.get("/warden/:id/edit", async(req, res) => {
  try {
    const {id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.send({error:'No such User'})
    } 
  const WrdnprofileEdit= await Warden.findById({_id:id})
  res.render("editW", { warden: WrdnprofileEdit });
  } catch (error) {
    res.redirect('back')
    res.send(error.message)
  }
});
//submit warden edit profile
router.put("/warden/:id",async(req, res) => {
  try {
    const {id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.send({error:'No such User'})
    } 
  const profileEditSubmit= await Hod.findOneAndUpdate({_id:id},{
    ...req.body
  })
  if(!profileEditSubmit){
    return res.send({error:'No such User'})
  }
  res.redirect("/warden/" + req.params.id);
} catch (error) {
    res.redirect('back');
    res.send(error.message)
  }
});
//view student leave warden
router.get("/warden/:id/leave", async(req, res) => {
  try {
    const {id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.send({error:'No such User'})
    } 
  const Wrdn= await Warden.findById({_id:id})
  if(Wrdn){
   try{
    const std=await Leave.find({ hostel: Wrdn.hostel }).sort({createdAt:-1})
    res.render("wardenLeaveSign", {
      warden: Wrdn,
      students: std,
    });
   }catch(err){
    res.redirect("back");
    res.send(err.message)
   }
  }
  } catch (error) {
    res.redirect('back')
    res.send(error.message)
  }
});
//approve leave status 
router.get('/api/:id/leave/:leave/approve',async(req,res)=>{
  try{
    const {id,leave}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.send({error:'No such User'})
    } 
    if(!mongoose.Types.ObjectId.isValid(leave)){
      return res.send({error:'No such leave'})
    } 
    const wrdn=await Warden.findById({_id:id});
    const hod=await Hod.findById({_id:id});
    if(wrdn||hod){
      try {
        await Leave.findOneAndUpdate({_id:leave},{
          status:'approved'
        })
        if(wrdn){
          res.redirect(`/warden/${req.params.id}/leave`) 
        }else if(hod){
          res.redirect(`/hod/${req.params.id}/leave`);
        }
      } catch (error) {
        res.send(error.message);
      }
    }
  }catch(err){
    res.send(err.message)
    res.redirect('back')
  }
});
//deny leave status
router.get('/api/:id/leave/:leave/deny',async(req,res)=>{
  try{
    const {id,leave}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.send({error:'No such User'})
    } 
    if(!mongoose.Types.ObjectId.isValid(leave)){
      return res.send({error:'No such leave'})
    } 
    const wrdn=await Warden.findById({_id:id});
    const hod=await Hod.findById({_id:id});
    if(wrdn||hod){
      try {
        await Leave.findOneAndUpdate({_id:leave},{
          status:'denied'
        })
        if(wrdn){
          res.redirect(`/warden/${req.params.id}/leave`) 
        }else if(hod){
          res.redirect(`/hod/${req.params.id}/leave`);
        }
      } catch (error) {
        res.send(error.message);
      }
    }
  }catch(err){
    res.send(err.message)
    res.redirect('back')
  }
});

router.get('/verify',protect);
//logout
router.get('/logout',(req,res)=>{
  //req.logout();
  res.redirect('/')
});
 //generate token
 const generateToken=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{
      expiresIn:'30d'
  })
};

module.exports=router;
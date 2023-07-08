const mongoose = require("mongoose");
const wardenSchema = new mongoose.Schema({
  name: {
    type:String,
    require:true
  },
  type:{
    type:String,
    require:true
  },
  username: {
    type:String,
    require:true
  },
  password: {
    type:String,
    require:true
  },
  hostel: {
    type:String,
    require:true
  },
  image: {
    type:String,
    require:true
  }
});

const Warden = (module.exports = mongoose.model("Warden", wardenSchema));
module.exports=Warden;

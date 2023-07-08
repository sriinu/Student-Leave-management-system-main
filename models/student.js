const mongoose = require("mongoose");
const Schema =mongoose.Schema;

const studentSchema = new Schema({
  leaves: [ 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave"
    }
  ],
  name: {
    type:String,
    unique:true,
    require:true
  },
  type: {
    type:String,
    require:true
  },
  username:{
    type: String
  },
  password: {
    type:String,
    require:true
  },
  department: {
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
},{
  timestamps:true
});

const student = mongoose.model("Student", studentSchema);
module.exports=student;


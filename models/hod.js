const mongoose = require("mongoose");
const hodSchema = new mongoose.Schema({
  name: {
    type:String,
    require:true
  },
  type: {
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
  department: {
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

 module.exports = mongoose.model("Hod", hodSchema);


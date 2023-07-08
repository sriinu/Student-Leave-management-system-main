const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const leaveSchema = new Schema({
  name:String,
    subject: { 
      type: String, 
      required: true 
    },
    hostel:String,
    from: Date, 
    to: Date,
    department:String,
    days: Number,
    status: {
      type:String,
      default: "pending"
    },
  std_id: String,
    },
  { timestamps: true}
);

module.exports = mongoose.model("Leave", leaveSchema);

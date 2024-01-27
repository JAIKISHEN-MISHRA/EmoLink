import mongoose from "mongoose";

const notificationModel=mongoose.Schema({
    sender: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      userId:{
        type:mongoose.Schema.Types,
        ref:"RegisteredUser",
        required:true
      }
})

const Notification=mongoose.Model('Notification',notificationModel);
export default Notification;
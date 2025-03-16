import mongoose from "mongoose";

const otpSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required : true
        },
        otp: {
            type : Number,
            required : true
        },
        date : {
            type : Date,
            default: Date.now
        }
    }
)
const otp = mongoose.model("otp", otpSchema)
export default otp;
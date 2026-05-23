import mongoose from "mongoose"

const tempSchema = new mongoose.Schema({
    email : String,
    purpose: {
    type: String,
    enum: ["signup", "reset-password", "email-verification"],
    required: true,
    },
    fullName : String,
    newEmail:String,
    password : String,
    token : String,
    expiresAt : {
        type :Date,
        required:true,
    }
})

tempSchema.index({ email: 1, purpose: 1 }, { unique: true });
tempSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const Temp =  mongoose.model("Temp",tempSchema);
export default Temp
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
export const protectedRoute = async (req, res, next) => {
try{
    const token = req.cookies.jwt
    if (!token || typeof token !== "string") {
      return res.status(401).json({ message: "Unauthorized Token" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    if(!decode){
        return res.status(401).json({message:"Unauthorized - Invalid token"})

    }

    const user = await User.findById(decode.userId)
    if(!user){
        return res.status(404).json({message:"User not found"})

    }
    req.user = user;
    next()



        
   


}catch(error){
    console.log("error in protectedroute",error.message)
    res.status(500).json({message:"internal server error "})

}

}

import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
});
import express from "express"
import dotenv from "dotenv"//env import
import http from "http";
import {connectDB} from './lib/DB.js'
import { initSocket } from "./socket.js";
import cookieParser from "cookie-parser";
import helmet from "helmet"
import cors from "cors"


import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import verificationRoutes from "./routes/verification.routes.js"
import messageRoutes from "./routes/message.route.js"

dotenv.config();


const app = express();


const PORT=process.env.PORT;

app.use(helmet())
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true

}))
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)
app.use("/api/verification",verificationRoutes)
app.use("/api/message/",messageRoutes)

const server = http.createServer(app);
initSocket(server);


connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`app is listening : ${PORT}`);
  });
});




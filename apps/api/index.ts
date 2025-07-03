import express from "express";
import { prisma } from "@repo/store";
import userRouter from "./routes/user.routes";
import websiteRouter from "./routes/website.routes";
const app = express();

app.use(express.json());

app.use('/user', userRouter);
app.use('/website', websiteRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on PORT 3000");
})


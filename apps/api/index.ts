import express from "express";
import userRouter from "./routes/user.routes";
import websiteRouter from "./routes/website.routes";
import regionRouter from "./routes/region.routes";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use('/user', userRouter);
app.use('/website', websiteRouter);
app.use('/region', regionRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on PORT 3000");
})


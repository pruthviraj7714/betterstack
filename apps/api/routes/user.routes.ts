import { Router, type Request, type Response } from "express";

const userRouter : Router = Router();

userRouter.post('/signup', async (req : Request, res : Response) => {
    try {
        //signup 
    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
})


userRouter.post('/signin', async (req : Request, res : Response) => {
    try {
        //signin
    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
})
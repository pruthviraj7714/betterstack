import { prisma } from "@repo/store";
import { Router, type Request, type Response } from "express";
import { authScheam } from "../types/zodTypes";
import { sign } from "jsonwebtoken";

const userRouter: Router = Router();

userRouter.post(
  "/signup",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const parsedBody = authScheam.safeParse(req.body);

      if (!parsedBody.success) {
        res.status(400).json({
          message: "Invalid Body",
        });
        return;
      }

      const { username, password } = parsedBody.data;

      const existingUsername = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (existingUsername) {
        res.status(400).json({
          message: "Username already exists",
        });
        return;
      }

      const user = await prisma.user.create({
        data: {
          username,
          password,
        },
      });

      res.status(201).json({
        message: "User created successfully",
        id: user.id,
      });
      return;
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

userRouter.post(
  "/signin",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const parsedBody = authScheam.safeParse(req.body);

      if (!parsedBody.success) {
        res.status(400).json({
          message: "Invalid Body",
        });
        return;
      }

      const { username, password } = parsedBody.data;

      const user = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (!user) {
        res.status(400).json({
          message: "User not found with this username",
        });
        return;
      }

      if (user.password !== password) {
        res.status(403).json({
          message: "Password is incorrect",
        });
        return;
      }

      const token = sign(
        {
          sub: user.id,
        },
        process.env.JWT_SECRET!
      );

      res.status(200).json({
        message: "User successfully logged in!",
        jwt: token,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

export default userRouter;

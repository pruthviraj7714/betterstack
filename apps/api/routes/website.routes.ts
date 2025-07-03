import { prisma } from "@repo/store";
import { Router, type Request, type Response } from "express";
import { userMiddleware } from "../middleware";

const websiteRouter: Router = Router();

websiteRouter.post(
  "/website",
  userMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const url = req.body.url;

    if (!url) {
      res.status(400).json({
        message: "url is missing",
      });
      return;
    }

    try {
      const newWebsite = await prisma.website.create({
        data: {
          url: req.body.url,
          userId: req.userId!,
        },
      });

      res.status(201).json({
        message: "Website successfully added to db",
        website: newWebsite,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
        error: error,
      });
    }
  }
);

websiteRouter.get("/status/:websiteId", (req, res) => {
  try {
    //TODO
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
});

export default websiteRouter;

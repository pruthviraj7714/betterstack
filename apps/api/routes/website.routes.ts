import { prisma } from "@repo/store";
import { Router, type Request, type Response } from "express";
import { userMiddleware } from "../middleware";

const websiteRouter: Router = Router();

websiteRouter.post(
  "/",
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

websiteRouter.delete(
  "/:websiteId",
  userMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const websiteId = req.params.websiteId;

    if (!websiteId) {
      res.status(400).json({
        message: "website Id is missing",
      });
      return;
    }

    try {
      const website = await prisma.website.findFirst({
        where: {
          id: websiteId,
        },
      });

      if (!website) {
        res.status(400).json({
          message: "Website with given Id not foudn",
        });
        return;
      }

      if (req.userId !== website.userId) {
        res.status(403).json({
          message: "You are not authorized to delete this website",
        });
        return;
      }

      await prisma.website.delete({
        where: {
          id: websiteId,
        },
      });

      res.status(200).json({
        message: "Website successfully deleted",
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

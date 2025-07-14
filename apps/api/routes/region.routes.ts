import { Router, type Request, type Response } from "express";
import { userMiddleware } from "../middleware";
import { prisma } from "@repo/store";

const regionRouter: Router = Router();

regionRouter.get(
  "/regions-with-name",
  userMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const regions = await prisma.region.findMany();

      res.status(200).json({
        regions: regions.map((r) => ({
          name: r.name,
          id: r.id,
        })),
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Internal Server Error!",
        error: error.message,
      });
    }
  }
);

export default regionRouter;

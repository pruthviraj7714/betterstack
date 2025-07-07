import axios from "axios";
import type { IPushWebsite } from "../../../packages/types";
import client, { xAckBulk } from "../../../packages/redisstream";
import { prisma } from "@repo/store";

async function fetchWebsites(
  consumerGroup: string,
  websites: IPushWebsite[]
): Promise<void> {
  const res = websites.map(async (web) => {
    let startTime = Date.now();
    try {
      const res = await axios.get(web.url);

      if (res.status === 200) {
        let endTime = Date.now();
        await prisma.websiteTick.create({
          data: {
            reponseTimeMs: endTime - startTime,
            status: "UP",
            regionId: consumerGroup,
            websiteId: web.websiteId,
          },
        });
      } else {
        let endTime = Date.now();
        await prisma.websiteTick.create({
          data: {
            reponseTimeMs: endTime - startTime,
            status: "DOWN",
            regionId: consumerGroup,
            websiteId: web.websiteId,
          },
        });
      }
    } catch (error: any) {
      let endTime = Date.now();
      await prisma.websiteTick.create({
        data: {
          reponseTimeMs: endTime - startTime,
          status: "DOWN",
          regionId: consumerGroup,
          websiteId: web.websiteId,
        },
      });
    }
  });

  await Promise.all(res);
}

export async function startWorker(consumerGroup: string, workerId: string) {
  while (true) {
    const res = await client.xReadGroup(
      consumerGroup,
      workerId,
      {
        key: "betteruptime:website",
        id: ">",
      },
      {
        COUNT: 5,
      }
    );
    if (!res) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }

    await fetchWebsites(
      consumerGroup,
      //@ts-ignore
      res?.[0]?.messages.map((m: IEvent) => ({
        url: m.message.url,
        websiteId: m.message.id,
      }))
    );

    await xAckBulk(
      //@ts-ignore
      res?.[0]?.messages.map((events: IEvent) => ({
        eventId: events.id,
        groupName: consumerGroup,
      }))
    );

    process.on("SIGINT", () => {
      console.log("Shutting down gracefully...");
      process.exit(0);
    });
  }
}

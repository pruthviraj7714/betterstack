import client, { xAckBulk } from "../../packages/redisstream";
import { prisma } from "@repo/store";
import axios from "axios";
import { type IPushWebsite, type IEvent } from "../../packages/types";

const CONSUMER_GROUP = process.env.CONSUMER_GROUP!;
const WORKER_ID = process.env.WORKER_ID!;

async function fetchWebsites(websites: IPushWebsite[]): Promise<void> {
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
            regionId: CONSUMER_GROUP,
            websiteId: web.websiteId,
          },
        });
      } else {
        let endTime = Date.now();
        await prisma.websiteTick.create({
          data: {
            reponseTimeMs: endTime - startTime,
            status: "DOWN",
            regionId: CONSUMER_GROUP,
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
          regionId: CONSUMER_GROUP,
          websiteId: web.websiteId,
        },
      });
    }
  });

  await Promise.all(res);
}

async function main() {
  while (1) {
    const res = await client.xReadGroup(
      CONSUMER_GROUP,
      WORKER_ID,
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
        groupName: CONSUMER_GROUP,
      }))
    );
  }
}

main();

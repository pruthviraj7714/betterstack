import { createClient } from "redis";

interface WebsiteAddSchema {
  websiteId: string;
  url: string;
}

const client = createClient()
  .on("error", (err) => console.log("Error: ", err));

await client.connect();

const STREAM_NAME = "betteruptime:website"

export async function xAddBulk(websites: WebsiteAddSchema[]) {
  const multi = client.multi();

  websites.forEach((website) => {
    multi.xAdd(STREAM_NAME, "*", {
      id: website.websiteId,
      url: website.url,
    });
  });

  await multi.exec();
}

export async function xReadGroup(consumerGroup : string, workerId : string) {
  await client.xReadGroup(consumerGroup, workerId, {
    key : STREAM_NAME,
    id : ">",
  })
}


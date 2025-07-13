import { createClient } from "redis";
import { type IRegion, type IPushWebsite } from "../types";

const client = createClient().on("error", (err) => console.log("Error: ", err));

await client.connect();

const STREAM_NAME = "betteruptime:website";

export async function xAddBulk(websites: IPushWebsite[]) {
  const multi = client.multi();

  websites.forEach((website) => {
    multi.xAdd(STREAM_NAME, "*", {
      id: website.websiteId,
      url: website.url,
    });
    console.log("pushed: " + website.url);
  });

  await multi.exec();
}

export async function xAckBulk(
  events: { groupName: string; eventId: string }[]
) {
  await Promise.all(
    events.map((event) =>
      client.xAck(STREAM_NAME, event.groupName, event.eventId)
    )
  );
}

export async function xCreateGroupBulk(regions: IRegion[]) {
  const results = await Promise.all(
    regions.map((r: IRegion) =>
      client.xGroupCreate(STREAM_NAME, r.id, "$", {
        MKSTREAM : true
      }).catch((err) => {
        if (err?.message?.includes("BUSYGROUP")) {
          console.log(`Group "${r.id}" already exists.`);
        } else {
          console.error(`Failed to create group "${r.id}"`);
        }
      })
    )
  );

  return results;
}

export async function xGroupInfo() {
  try {
    const response = await client.xInfoGroups(STREAM_NAME);
    return response;
  } catch (error) {
    console.log("error while fetching group info ", error);
  }
}

export default client;

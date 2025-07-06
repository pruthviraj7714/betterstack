import { prisma } from "@repo/store";
import { xAddBulk, xCreateGroupBulk } from "../../packages/redisstream";

async function createGroups() {
  try {
    const regions = await prisma.region.findMany({});
    await xCreateGroupBulk(regions);
  } catch (error: any) {
    console.log("internal server error: ", error);
  }
}

async function pushWebsites() {
  let websites;
  try {
    websites = await prisma.website.findMany({
      select: {
        url: true,
        id: true,
      },
    });
    console.log("found ", websites.length, " websites");
  } catch (error: any) {
    console.log("Error while fetching websites", error);
    return;
  }

  try {
    await xAddBulk(
      websites.map((web) => ({
        websiteId: web.id,
        url: web.url,
      }))
    );
  } catch (error: any) {
    throw new Error(
      `error while pushing websites into queue: ${error.message}`
    );
  }
}

async function main() {
  await createGroups();
  await pushWebsites();

  setInterval(
    async () => {
      await pushWebsites();
    },
    3 * 60 * 1000
  );
}

main();

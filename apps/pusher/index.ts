import { prisma } from "@repo/store";
import {
  xAddBulk,
  xCreateGroupBulk,
  xGroupInfo,
} from "../../packages/redisstream";

async function createGroups() {
  try {
    const [regions, redisGroups] = await Promise.all([
      prisma.region.findMany(),
      xGroupInfo(),
    ]);

      const existingGroupNames = new Set<string>(
        (redisGroups || []).map((g) => g.name)
      );;
  
      const newRegions = regions.filter((r) => !existingGroupNames.has(r.id));
  
      if (newRegions.length > 0) {
        await xCreateGroupBulk(newRegions);
        newRegions.forEach((r) => {
          console.log(`Created Redis group for region: ${r.name}`);
        });
    } else {
      console.log("No new regions found to create groups for.");
    }
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
    console.log(`Found ${websites.length} websites to push to queue`);
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
  setInterval(createGroups, 60 * 1000);
  setInterval(pushWebsites, 3 * 60 * 1000);
}

main();

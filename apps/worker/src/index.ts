import { startWorker } from "./worker";
import { xGroupInfo } from "../../../packages/redisstream";

const startedGroups = new Set<string>();

async function pollRegions() {
  try {
    const groups = await xGroupInfo();

    if(groups) {
      for (const group of groups) {
        if (!startedGroups.has(group.name)) {
          const consumerGroup = group.name;
          const totalWorkers = Number(process.env.WORKER_NUMBER) || 2;
  
          console.log(
            `[+] Starting ${totalWorkers} workers for new region: ${group.name}`
          );
  
          for (let i = 0; i < totalWorkers; i++) {
            const workerId = `${group.name}-worker:${i}`;
            startWorker(consumerGroup, workerId);
          }
  
          startedGroups.add(group.name);
        }
      }
    }
  } catch (error: any) {
    console.error(`[pollRegions error] ${error.message}`);
  }
}

pollRegions();
setInterval(pollRegions, 60 * 1000);

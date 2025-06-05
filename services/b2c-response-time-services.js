import { B2CResponseTime } from "../db/models/B2CResponseTime.js";

async function createResponseTimeService(data) {
  const times = await B2CResponseTime.create(data)
  return times;
}

export { createResponseTimeService };

import { getDashboardData } from "../utils/database";

export default defineEventHandler(async () => {
  return await getDashboardData();
});

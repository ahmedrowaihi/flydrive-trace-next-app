import { initRouteHandler } from "@/lib/disk-handlers";
import { s3Disk } from "@/lib/flydrive";

export const { GET, POST } = initRouteHandler(s3Disk);

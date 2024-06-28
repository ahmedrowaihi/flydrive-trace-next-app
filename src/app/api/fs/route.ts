import { initRouteHandler } from "@/lib/disk-handlers";
import { fsDisk } from "@/lib/flydrive";

export const { GET, POST } = initRouteHandler(fsDisk);

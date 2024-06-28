import { randomUUID } from "crypto";
import path from "path";
import { NextRequest } from "next/server";
import type { Disk } from "flydrive";
import { getImageSize } from "./get-image-size";

export function initRouteHandler(disk: Disk): {
  POST: (req: NextRequest) => Promise<Response>;
  GET: (req: NextRequest) => Promise<Response>;
} {
  const POST: (req: NextRequest) => Promise<Response> = async (req) => {
    const image = (await req.formData()).get("image") as File | null;
    if (!image) throw new Error("Upload an Image");
    const toBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(toBuffer);

    const size = await getImageSize(buffer);

    const key = `${randomUUID()}.${path.extname(image.name).slice(1)}`;

    await disk.put(key, buffer);

    const url = await disk.getUrl(key);
    const response = {
      key: key,
      alt: key,
      size: image.size,
      url,
      width: size.width,
      height: size.height,
    };

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  };

  const GET: (req: NextRequest) => Promise<Response> = async () => {
    return new Response("GET request handled", { status: 200 });
  };

  return { POST, GET };
}

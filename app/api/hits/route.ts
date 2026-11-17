import { incr, getNumber } from "@/lib/store";

export const dynamic = "force-dynamic";

/** GET: current visitor count. POST: count this visit (the client calls it once per browser session). */
export async function GET() {
  return Response.json({ count: await getNumber("hits") });
}

export async function POST() {
  return Response.json({ count: await incr("hits") });
}

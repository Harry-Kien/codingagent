import { NextResponse } from "next/server";
import { generateProjectKitServer } from "@/lib/server-generator";
import { generateKitRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = generateKitRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid generation request." }, { status: 400 });
  }

  const project = await generateProjectKitServer(parsed.data.input, parsed.data.provider);
  return NextResponse.json({ project });
}

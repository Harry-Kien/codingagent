import { NextResponse } from "next/server";
import { regenerateSectionServer } from "@/lib/server-generator";
import { regenerateSectionRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = regenerateSectionRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid section regeneration request." }, { status: 400 });
  }

  const project = await regenerateSectionServer(
    parsed.data.project,
    parsed.data.sectionKey,
    parsed.data.provider,
  );
  return NextResponse.json({ project });
}

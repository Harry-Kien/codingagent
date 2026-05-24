import { NextResponse } from "next/server";
import { improveSectionServer } from "@/lib/server-generator";
import { improveSectionRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = improveSectionRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid section improvement request." }, { status: 400 });
  }

  const project = await improveSectionServer(
    parsed.data.project,
    parsed.data.sectionKey,
    parsed.data.instruction,
    parsed.data.provider,
  );
  return NextResponse.json({ project });
}

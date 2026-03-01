import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/scholarships/[id]/apply-click
// Records an outbound apply-click for analytics purposes.
// Increments the `views` counter (re-used as an engagement proxy).
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Scholarship id required" }, { status: 400 });
    }

    await prisma.scholarship.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // If the scholarship no longer exists, ignore silently
    if (error?.code === "P2025") {
      return NextResponse.json({ success: true });
    }
    console.error("apply-click error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

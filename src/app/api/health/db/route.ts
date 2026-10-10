import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/permissions/auth";

export async function GET() {
  const actor = await getCurrentUser();
  if (!actor || actor.role !== "SUPER_ADMIN") {
    return NextResponse.json({ success: false }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      success: true,
      database: "connected",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Database health check failed:", error);

    return NextResponse.json(
      {
        success: false,
        database: "disconnected",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

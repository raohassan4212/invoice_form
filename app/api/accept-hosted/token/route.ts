import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  // This file is no longer needed - removing payment integration
  return new Response("Payment integration removed", { status: 404 })
}

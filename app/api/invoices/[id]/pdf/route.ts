import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../../../lib/supabase"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { pdf_url } = await request.json()

    if (!pdf_url) {
      return NextResponse.json({ error: "PDF URL is required" }, { status: 400 })
    }

    const { data, error } = await supabase.from("invoices").update({ pdf_url }).eq("id", params.id).select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update PDF URL" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    console.log("🔔 Payment webhook received")

    // Parse the form data from Authorize.Net
    const formData = await request.formData()
    const webhookData: any = {}

    // Extract all form fields
    for (const [key, value] of formData.entries()) {
      webhookData[key] = value.toString()
    }

    console.log("📝 Webhook data:", webhookData)

    // Extract important fields
    const {
      x_trans_id: transactionId,
      x_invoice_num: invoiceNumber,
      x_amount: amount,
      x_response_code: responseCode,
      x_response_reason_text: responseText,
      x_auth_code: authCode,
      x_test_request: testRequest,
    } = webhookData

    // Log payment attempt to database
    const { error: logError } = await supabase.from("payment_logs").insert({
      transaction_id: transactionId,
      invoice_number: invoiceNumber,
      amount: Number.parseFloat(amount) || 0,
      response_code: responseCode,
      response_text: responseText,
      auth_code: authCode,
      test_request: testRequest === "TRUE",
      webhook_data: webhookData,
      created_at: new Date().toISOString(),
    })

    if (logError) {
      console.error("❌ Failed to log payment:", logError)
    }

    // Update invoice status based on response code
    if (responseCode === "1") {
      // Payment approved
      const { error: updateError } = await supabase
        .from("invoices")
        .update({
          payment_status: "paid",
          payment_transaction_id: transactionId,
          payment_auth_code: authCode,
          payment_amount: Number.parseFloat(amount) || 0,
          updated_at: new Date().toISOString(),
        })
        .eq("id", invoiceNumber)

      if (updateError) {
        console.error("❌ Failed to update invoice:", updateError)
      } else {
        console.log("✅ Invoice updated successfully")
      }
    } else {
      // Payment declined or error
      const { error: updateError } = await supabase
        .from("invoices")
        .update({
          payment_status: "failed",
          payment_transaction_id: transactionId,
          payment_error: responseText,
          updated_at: new Date().toISOString(),
        })
        .eq("id", invoiceNumber)

      if (updateError) {
        console.error("❌ Failed to update invoice:", updateError)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("❌ Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

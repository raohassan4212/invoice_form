import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Starting email sending process...")

    const { pdfUrl, orderNumber } = await request.json()

    if (!pdfUrl) {
      console.error("❌ Missing PDF URL")
      return NextResponse.json({ error: "PDF URL is required" }, { status: 400 })
    }

    console.log("📄 PDF URL received:", pdfUrl)
    console.log("📋 Order Number received:", orderNumber)

    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD
    if (!gmailAppPassword) {
      console.error("❌ Missing Gmail app password")
      return NextResponse.json({ error: "Email configuration error" }, { status: 500 })
    }

    // Enhanced transporter configuration for large orders
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "info@wazabilabs.com",
        pass: gmailAppPassword,
      },
      pool: true, // Use connection pooling for better performance
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 14, // Limit to 14 messages per second
      tls: {
        rejectUnauthorized: false,
      },
    })

    console.log("📧 Email transporter created with enhanced configuration")

    const recipients = ["sales@bigbrandsdistro.com", "okashaamjadali360@gmail.com"]
    const sentEmails: string[] = []
    const failedEmails: { email: string; error: string }[] = []

    // Process emails sequentially to avoid rate limiting
    for (const recipient of recipients) {
      const formattedOrderNumber = orderNumber ? String(orderNumber).padStart(3, "0") : "000"
      const mailOptions = {
        from: `"BBD Orders" <info@wazabilabs.com>`,
        to: recipient,
        subject: `New BBD Order Received #${formattedOrderNumber}`,
        html: `
          <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; padding: 20px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #21265E;">🔔 New Order Notification</h2>
            <p style="font-size: 15px;">A new order has been placed on the <strong>Big Brands Distro</strong> website.</p>
            <p style="font-size: 15px;">Please find the invoice PDF attached for your reference.</p>
            <a href="${pdfUrl}" style="display: inline-block; padding: 10px 20px; background-color: #21265E; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Invoice PDF</a>
            <hr style="margin: 30px 0;">
            <p style="font-size: 12px; color: #999;">This is an automated message from the BBD order system. Do not reply.</p>
          </div>
        `,
        attachments: [
          {
            filename: "BBD-order.pdf",
            path: pdfUrl,
            contentType: "application/pdf",
          },
        ],
      }

      try {
        console.log(`📧 Sending email to ${recipient}...`)
        const info = await transporter.sendMail(mailOptions)
        console.log(`✅ Email sent to ${recipient}:`, info.messageId)
        sentEmails.push(recipient)

        // Add small delay between emails to prevent rate limiting
        if (recipients.indexOf(recipient) < recipients.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      } catch (err: any) {
        console.error(`❌ Failed to send to ${recipient}:`, err.message)
        failedEmails.push({ email: recipient, error: err.message })

        // Retry once for failed emails
        try {
          console.log(`🔄 Retrying email to ${recipient}...`)
          await new Promise((resolve) => setTimeout(resolve, 2000))
          const retryInfo = await transporter.sendMail(mailOptions)
          console.log(`✅ Retry successful for ${recipient}:`, retryInfo.messageId)
          sentEmails.push(recipient)
          failedEmails.pop() // Remove the failed entry since retry succeeded
        } catch (retryErr: any) {
          console.error(`❌ Retry also failed for ${recipient}:`, retryErr.message)
        }
      }
    }

    // Close the transporter
    transporter.close()

    return NextResponse.json({
      success: true,
      sent: sentEmails,
      failed: failedEmails,
    })
  } catch (error: any) {
    console.error("❌ General error:", error)
    return NextResponse.json(
      {
        error: "Failed to send emails",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}

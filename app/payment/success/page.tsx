"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Home } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [transactionDetails, setTransactionDetails] = useState<any>(null)

  useEffect(() => {
    // Extract transaction details from URL parameters
    const details = {
      transactionId: searchParams.get("x_trans_id"),
      invoiceNumber: searchParams.get("x_invoice_num"),
      amount: searchParams.get("x_amount"),
      authCode: searchParams.get("x_auth_code"),
      responseCode: searchParams.get("x_response_code"),
    }

    setTransactionDetails(details)
    console.log("💳 Payment success details:", details)
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">Payment Successful!</CardTitle>
          <p className="text-gray-600">Your order has been processed successfully.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {transactionDetails && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-gray-800">Transaction Details</h3>
              {transactionDetails.transactionId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono">{transactionDetails.transactionId}</span>
                </div>
              )}
              {transactionDetails.invoiceNumber && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Invoice Number:</span>
                  <span className="font-mono">{transactionDetails.invoiceNumber}</span>
                </div>
              )}
              {transactionDetails.amount && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">${transactionDetails.amount}</span>
                </div>
              )}
              {transactionDetails.authCode && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Authorization Code:</span>
                  <span className="font-mono">{transactionDetails.authCode}</span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center">
              A confirmation email has been sent to your email address with the transaction details.
            </p>

            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/invoices">
                  <Download className="w-4 h-4 mr-2" />
                  View Invoice
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Return Home
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

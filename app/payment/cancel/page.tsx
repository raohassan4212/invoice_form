"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, RotateCcw, Home } from "lucide-react"
import Link from "next/link"

export default function PaymentCancelPage() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    // Extract order details from URL parameters
    const details = {
      invoiceNumber: searchParams.get("x_invoice_num"),
      amount: searchParams.get("x_amount"),
      responseCode: searchParams.get("x_response_code"),
      responseText: searchParams.get("x_response_reason_text"),
    }

    setOrderDetails(details)
    console.log("❌ Payment cancelled details:", details)
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">Payment Cancelled</CardTitle>
          <p className="text-gray-600">Your payment was cancelled or could not be processed.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderDetails && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-gray-800">Order Details</h3>
              {orderDetails.invoiceNumber && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Invoice Number:</span>
                  <span className="font-mono">{orderDetails.invoiceNumber}</span>
                </div>
              )}
              {orderDetails.amount && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">${orderDetails.amount}</span>
                </div>
              )}
              {orderDetails.responseText && (
                <div className="text-sm">
                  <span className="text-gray-600">Reason:</span>
                  <p className="text-red-600 mt-1">{orderDetails.responseText}</p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center">
              Don't worry! Your order is still saved and you can try again or contact support if you need help.
            </p>

            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
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

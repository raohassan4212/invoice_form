"use client"

import { useEffect } from "react"

export default function PaymentCommunicatorPage() {
  useEffect(() => {
    // This page handles communication between the parent window and the Authorize.Net iframe
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from Authorize.Net domains
      const allowedOrigins = [
        "https://accept.authorize.net",
        "https://test.authorize.net",
        "https://api.authorize.net",
        "https://apitest.authorize.net",
      ]

      if (!allowedOrigins.some((origin) => event.origin.startsWith(origin))) {
        return
      }

      console.log("💬 Received message from Authorize.Net:", event.data)

      // Forward the message to the parent window
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(event.data, "*")
      }
    }

    // Listen for messages from the iframe
    window.addEventListener("message", handleMessage)

    // Send a ready message to indicate the communicator is loaded
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ action: "communicatorReady" }, "*")
    }

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-700">Payment Communicator</h1>
        <p className="text-gray-500 mt-2">This page handles payment communication.</p>
      </div>
    </div>
  )
}

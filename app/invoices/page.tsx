"use client"

import { useState, useEffect } from "react"

interface Invoice {
  id: string
  order_number: number
  created_at: string
  customer_name: string
  customer_email: string
  customer_cell_phone: string
  business_name: string
  account_manager: string
  customer_status: string
  customer_type: string
  is_7oh_legal: string
  selected_products: any
  pdf_url?: string
}

interface DashboardStats {
  totalOrders: number
  totalAmount: number
  newCustomers: number
  existingCustomers: number
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [emailSending, setEmailSending] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalAmount: 0,
    newCustomers: 0,
    existingCustomers: 0,
  })
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/invoices")
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }
      const data = await response.json()
      setInvoices(data)
      calculateStats(data)
    } catch (err) {
      console.error("Error fetching invoices:", err)
      setError("Failed to load invoices. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (invoiceData: Invoice[]) => {
    const totalAmount = invoiceData.reduce((sum, inv) => sum + (calculateTotal(inv.selected_products) || 0), 0)
    const newCustomers = invoiceData.filter((inv) => inv.customer_status === "New Customer").length
    const existingCustomers = invoiceData.filter((inv) => inv.customer_status === "Existing Customer").length

    setStats({
      totalOrders: invoiceData.length,
      totalAmount,
      newCustomers,
      existingCustomers,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const calculateTotal = (selectedProducts: any) => {
    if (!selectedProducts || typeof selectedProducts !== "object") return 0
    let total = 0
    Object.values(selectedProducts).forEach((product: any) => {
      if (product && product.variantsSelected) {
        let price = 0
        if (product.price) {
          if (typeof product.price === "string") {
            const rawPrice = product.price.toString().replace(/[^0-9.]/g, "")
            price = Number.parseFloat(rawPrice) || 0
          } else {
            price = Number(product.price) || 0
          }
        }

        Object.values(product.variantsSelected).forEach((qty: any) => {
          total += price * (Number(qty) || 0)
        })
      }
    })
    return total
  }

  const renderProductSummary = (selectedProducts: any) => {
    if (!selectedProducts || typeof selectedProducts !== "object") {
      return "No products"
    }
    let productCount = 0
    Object.values(selectedProducts).forEach((product: any) => {
      if (product && product.variantsSelected) {
        Object.values(product.variantsSelected).forEach((qty: any) => {
          productCount += qty || 0
        })
      }
    })
    const productTypes = Object.keys(selectedProducts).length
    return `${productCount} items (${productTypes} products)`
  }

  const renderProductDetails = (selectedProducts: any) => {
    console.log("[v0] Selected products data:", selectedProducts)
    console.log("[v0] Type of selectedProducts:", typeof selectedProducts)
    console.log("[v0] Is array:", Array.isArray(selectedProducts))

    if (!selectedProducts || typeof selectedProducts !== "object") {
      return <p className="text-gray-500">No products selected</p>
    }

    const productsArray = Array.isArray(selectedProducts) ? selectedProducts : Object.values(selectedProducts)
    console.log("[v0] Products array:", productsArray)

    if (productsArray.length === 0) {
      return <p className="text-gray-500">No products found</p>
    }

    let grandTotal = 0

    return (
      <div className="space-y-4">
        {productsArray.map((product: any, index) => {
          console.log("[v0] Processing product:", product)
          console.log("[v0] Product keys:", Object.keys(product))
          console.log("[v0] Product price field:", product.price)
          console.log("[v0] Product price type:", typeof product.price)

          if (!product) return null

          const productName = product.name || product.productName || `Product ${index + 1}`
          const productImage = product.image || product.productImage || "/placeholder.svg"
          const variants = product.variantsSelected || product.variants || {}

          console.log("[v0] Variants data:", variants)
          console.log("[v0] Variants keys:", Object.keys(variants))

          let price = 0
          if (product.price) {
            if (typeof product.price === "string") {
              const rawPrice = product.price.toString().replace(/[^0-9.]/g, "")
              price = Number.parseFloat(rawPrice) || 0
            } else {
              price = Number(product.price) || 0
            }
          }

          console.log("[v0] Calculated price:", price, "Original price:", product.price)

          const hasVariants = Object.values(variants).some((qty: any) => qty > 0)
          if (!hasVariants && Object.keys(variants).length === 0) {
            return (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <img
                    src={productImage || "/placeholder.svg"}
                    alt={productName}
                    className="w-16 h-16 rounded object-cover border"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2 leading-tight">{productName}</h4>
                    <p className="text-sm text-gray-500">Product selected (quantity data not available)</p>
                  </div>
                </div>
              </div>
            )
          }

          let productSubtotal = 0

          return (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start gap-3">
                <img
                  src={productImage || "/placeholder.svg"}
                  alt={productName}
                  className="w-16 h-16 rounded object-cover border"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-2 leading-tight">{productName}</h4>
                  <p className="text-xs text-gray-600 mb-2">Unit Price: ${price.toFixed(2)}</p>
                  <div className="space-y-2">
                    {Object.entries(variants).map(([variant, qty]: [string, any]) => {
                      console.log("[v0] Processing variant:", variant, "qty:", qty, "type:", typeof qty)

                      if (qty > 0) {
                        const lineTotal = price * qty
                        productSubtotal += lineTotal
                        grandTotal += lineTotal

                        console.log("[v0] Line calculation - price:", price, "qty:", qty, "lineTotal:", lineTotal)

                        return (
                          <div
                            key={variant}
                            className="flex justify-between items-center text-sm bg-white p-2 rounded border"
                          >
                            <div>
                              <div className="font-medium text-gray-800">{variant}</div>
                              <div className="text-xs text-gray-500">Quantity: {qty}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                ${price.toFixed(2)} × {qty}
                              </div>
                              <div className="font-semibold text-green-600">${lineTotal.toFixed(2)}</div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    })}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                      <span className="font-medium text-gray-700">Product Total:</span>
                      <span className="font-bold text-blue-600">${productSubtotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <div className="border-t-2 border-gray-400 pt-4 mt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Grand Total:</span>
              <span className="text-2xl font-bold text-green-600">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const downloadStoredPDF = async (invoice: Invoice) => {
    try {
      if (invoice.pdf_url) {
        const link = document.createElement("a")
        link.href = invoice.pdf_url
        link.download = `BBD_Order_${String(invoice.order_number).padStart(3, "0")}_${new Date(invoice.created_at).toISOString().split("T")[0]}.pdf`
        link.target = "_blank"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        alert("PDF not available. This order may have been placed before PDF storage was implemented.")
      }
    } catch (error) {
      console.error("Error downloading PDF:", error)
      alert("Failed to download PDF. Please try again.")
    }
  }

  const resendInvoiceEmail = async (invoice: Invoice) => {
    if (!invoice.pdf_url) {
      alert("PDF not available. Cannot send email without PDF.")
      return
    }

    setEmailSending(true)
    try {
      const response = await fetch("/api/send-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfUrl: invoice.pdf_url,
          orderNumber: invoice.order_number,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        alert(`Email sent successfully to the team! Message ID: ${result.messageId}`)
      } else {
        throw new Error(result.error || "Failed to send email")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      alert(`Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setEmailSending(false)
    }
  }

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedInvoice(null)
    setShowModal(false)
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCustomerStatus = (status: string) => {
    if (!status || status.trim() === "") {
      return "New Customer"
    }
    return status
  }

  const getCustomerStatusColor = (status: string) => {
    const normalizedStatus = getCustomerStatus(status).toLowerCase()
    switch (normalizedStatus) {
      case "new customer":
        return "bg-blue-100 text-blue-800"
      case "existing customer":
        return "bg-green-100 text-green-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <img
                src="/images/design-mode/BBD_Logo_Blue-01_1%281%29%281%29%281%29%281%29%281%29%281%29(1).png"
                alt="BBD Logo"
                className="h-12 w-auto"
              />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Orders Dashboard</h1>
            </div>
            <button
              onClick={fetchInvoices}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              Refresh Orders
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-cyan-500">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalAmount)}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">New Customers</p>
                <p className="text-3xl font-bold text-blue-600">{stats.newCustomers}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">Existing Customers</p>
                <p className="text-3xl font-bold text-purple-600">{stats.existingCustomers}</p>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

        {!loading && !error && invoices.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg">No orders found.</p>
          </div>
        )}

        {!loading && !error && invoices.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Account Manager
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">
                            #{String(invoice.order_number).padStart(3, "0")}
                          </div>
                          <div className="text-xs text-gray-500">{formatDate(invoice.created_at)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{invoice.customer_name}</div>
                          <div className="text-xs text-gray-500">{invoice.customer_email}</div>
                          <div className="flex gap-1 mt-1">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCustomerStatusColor(invoice.customer_status)}`}
                            >
                              {getCustomerStatus(invoice.customer_status)}
                            </span>
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              {invoice.customer_type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{invoice.account_manager}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{renderProductSummary(invoice.selected_products)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-lg font-bold text-green-600">
                            ${calculateTotal(invoice.selected_products).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewDetails(invoice)}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="md:hidden">
              <div className="space-y-4 p-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          Order #{String(invoice.order_number).padStart(3, "0")}
                        </div>
                        <div className="text-sm text-gray-500">{formatDate(invoice.created_at)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ${calculateTotal(invoice.selected_products).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div>
                        <span className="font-medium text-gray-700">{invoice.customer_name}</span>
                        <div className="text-sm text-gray-500">{invoice.customer_email}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCustomerStatusColor(invoice.customer_status)}`}
                        >
                          {getCustomerStatus(invoice.customer_status)}
                        </span>
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {invoice.customer_type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{renderProductSummary(invoice.selected_products)}</div>
                    </div>
                    <button
                      onClick={() => handleViewDetails(invoice)}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedInvoice && showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/design-mode/BBD_Logo_Blue-01_1%281%29%281%29%281%29%281%29%281%29%281%29(1).png"
                    alt="BBD Logo"
                    className="h-8 w-auto"
                  />
                  <h2 className="text-xl font-bold text-gray-800">
                    Order #{String(selectedInvoice.order_number).padStart(3, "0")}
                  </h2>
                </div>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Information Table */}
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Customer Information</h3>
                  </div>
                  <div className="p-4">
                    <table className="w-full">
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="py-2 text-sm font-medium text-gray-600 w-1/3">Account Manager</td>
                          <td className="py-2 text-sm text-gray-900">
                            {selectedInvoice.account_manager || "Not specified"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 text-sm font-medium text-gray-600">Customer Name</td>
                          <td className="py-2 text-sm text-gray-900">
                            {selectedInvoice.customer_name || "Not provided"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 text-sm font-medium text-gray-600">Business Name</td>
                          <td className="py-2 text-sm text-gray-900">
                            {selectedInvoice.business_name || "Not provided"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 text-sm font-medium text-gray-600">Email</td>
                          <td className="py-2 text-sm text-gray-900">
                            {selectedInvoice.customer_email || "Not provided"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 text-sm font-medium text-gray-600">Phone</td>
                          <td className="py-2 text-sm text-gray-900">
                            {selectedInvoice.customer_cell_phone || "Not provided"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 text-sm font-medium text-gray-600">Customer Status</td>
                          <td className="py-2">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCustomerStatusColor(selectedInvoice.customer_status)}`}
                            >
                              {getCustomerStatus(selectedInvoice.customer_status)}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 text-sm font-medium text-gray-600">Customer Type</td>
                          <td className="py-2">
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              {selectedInvoice.customer_type || "Not specified"}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Products */}
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Products Ordered</h3>
                  </div>
                  <div className="p-4">{renderProductDetails(selectedInvoice.selected_products)}</div>
                </div>

                {/* Actions */}
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Actions</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => downloadStoredPDF(selectedInvoice)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        disabled={!selectedInvoice.pdf_url}
                      >
                        📄 Download Invoice PDF
                      </button>
                      <button
                        onClick={() => resendInvoiceEmail(selectedInvoice)}
                        className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        disabled={!selectedInvoice.pdf_url || emailSending}
                      >
                        📧 {emailSending ? "Sending..." : "Email Invoice"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

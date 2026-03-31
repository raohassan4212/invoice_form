"use client"

import { useState, useEffect } from "react"
import { RotateCcw } from "lucide-react"
// import { supabase } from "../lib/supabase-client"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
 "https://kcgpssztbdeonjnyqzqw.supabase.co"!,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZ3Bzc3p0YmRlb25qbnlxenF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDgxOSwiZXhwIjoyMDg3ODcwODE5fQ.BkMTggW_XdRzrYeCeEcwVzoU3Vm_s4fG9pMaJ2R3Jpo"! // 🔑 bypass RLS
)

interface Product {
  id: number
  name: string
  image: string
  variants: Array<{ name: string; image: string }>
  soldOut?: boolean
  packagingSpecs?: string
  price?: number // Added price field
}

interface SelectedProduct extends Product {
  variantsSelected: Record<string, number>
}

const products: Product[] = [
  {
    id: 5,
    name: "DOZO PERKS 7 OH LIQUID SHOT 40MG (30ML)",
    image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/STRAWBERRY_LEMONADE_02_copy.png?v=1756940811",
    packagingSpecs: ["40MG (30ML)", "12 BOTTLES/BOX", "24 BOXES/CASE = 288 BOTTLES"],
    price: 96,
    variants: [
      {
        name: "BLUEBERRY SLUSHIE",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/BLUEBERRYSLUSHIE02_110x110@2x.png?v=1743019004",
      },
      {
        name: "STRAWBERRY LEMONADE",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/STRAWBERRYLEMONADE02_110x110@2x.png?v=1743019004",
      },
      {
        name: "WILD MANGO",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/WILD-MANGO_110x110@2x.webp?v=1743019004",
      },
    ],
  },
  {
    id: 1,
    name: "DOZO PERKS 7-OH 20MG PACK / 2 COUNT",
    image: "https://bigbrandsdistro.com/cdn/shop/files/DOZO-5G-LIQUID-DIAMONDS-THC-DISPOSABLE-VAPE-1.png?v=1740429214",
    packagingSpecs: ["20 MG TABS x 2 TABS", "40 MG PACK", "10 PACKS/BOX", "20 BOXES/CASE = 200 PACKS"],
    price: 70,
    variants: [
      {
        name: "CHILL BERRY (MELLOW BLEND)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/DOZO-5G-LIQUID-DIAMONDS-THC-DISPOSABLE-VAPE-1.png?v=1740429214",
      },
      {
        name: "RAW GOLD (MELLOW BLEND)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/GRAND-TRAPPER-OG-INDICA-1_10x110@2x.png?v=1740429215",
      },
      {
        name: "SPEARMINT (PARTY BLEND)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/LEMON-CHERRY-GELATO-SATIVA-1_110x110@2x.png?v=1740429215",
      },
      {
        name: "WILD MANGO (PARTY BLEND)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/ELGATO-GELATO-SATIVA-1_110x110@2x.png?v=1740429214",
      },
      {
        name: "NATURAL (PARTY BLEND)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/imgi_1_Dozo-Perks-7-hydroxymitragynine-Tablets-Cherry-2ct__96841.1741371051.png?v=1754356120",
      },
      {
        name: "CHERRY (PARTY BLEND)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/imgi_1_Dozo-Perks-7-hydroxymitragynine-Tablets-Cherry-6ct__52312.1741371051.jpg?v=1754355831",
      },
    ],
  },
  {
    id: 10,
    name: "DOZO PERKS 7-OH 20MG PACK / 6 COUNT",
    image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/Untitled-1_1.png?v=1756940810",
    packagingSpecs: ["20 MG TABS x 6 TABS", "120 MG PACK", "10 PACKS/BOX", "20 BOXES/CASE = 200 PACKS"],
    price: 165,
    variants: [
      {
        name: "CHILL BERRY (MELLOW BLEND)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/Chill-Berry_110x110@2x.webp?v=1740429215",
      },
      {
        name: "RAW GOLD (MELLOW BLEND)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/Raw-Gold_110x110@2x.webp?v=1740429215",
      },
      {
        name: "SPEARMINT (PARTY BLEND)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/SPEAR-MINT_110x110@2x.webp?v=1740429214",
      },
      {
        name: "WILD MANGO (PARTY BLEND)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/PARTY-BLEND_110x110@2x.webp?v=1740429215",
      },
      {
        name: "NATURAL (PARTY BLEND)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/imgi_1_Dozo-Perks-7-hydroxymitragynine-20mg-Party-Blend-Natural-6ct__53028.1748371942_1.jpg?v=1754355832",
      },
      {
        name: "CHERRY (PARTY BLEND)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/imgi_1_Dozo-Perks-7-hydroxymitragynine-Tablets-Cherry-2ct__96841.1741371051.jpg?v=1754355831",
      },
    ],
  },
  {
    id: 2,
    name: "DOZO PERKS 7-OH 50MG PACK / 4 COUNT",
    image: "https://bigbrandsdistro.com/cdn/shop/files/DOZOPERKS7-HYDROXYMITRAGYNINE200MG10_PK.png?v=1742935161",
    packagingSpecs: ["50 MG TABS x 4 TABS", "200 MG PACK", "10 PACKS/BOX", "20 BOXES/CASE = 200 PACKS"],
    price: 220,
    variants: [
      {
        name: "CHILL BERRY | MELLOW BLEND",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/CHILLBERRY_MELLOWBLEND-4CTPACK_110x110@2x.png?v=1742935161",
      },
      {
        name: "GRAPE | EUPHORIA BLEND",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/GRAPE_EUPHORIABLEND-4CTPACK_110x110@2x.png?v=1742935161",
      },
      {
        name: "WILD MANGO | PARTY BLEND",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/WILDMANGO_PARTYBLEND-4CTPACK_110x110@2x.png?v=1742935161",
      },
      {
        name: "STRAWBERRY BANANA | EUPHORIA BLEND",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/Strawberry_Banana_110x110@2x.png?v=1746555698",
      },
      {
        name: "PINK LEMONADE | MELLOW BLEND",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/Pink_Lemonade_110x110@2x.png?v=1746555710",
      },
      {
        name: "SOUR APPLE | PARTY BLEND",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/Apple_110x110@2x.png?v=1746555724",
      },
    ],
  },
  {
    id: 11,
    name: "DOZO PERKS 7-OH 100MG PACK / 4 COUNT",
    image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/Untitled_design_67.png?v=1759791616",
    packagingSpecs: ["100 MG TABS x 4 TABS", "400 MG PACK", "10 PACKS/BOX", "20 BOXES/CASE = 200 PACKS"],
    price: 135,
    variants: [
      {
        name: "WATERMELON",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/2.png?v=1759791615",
      },
      {
        name: "BLUE RAZZ",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/3.png?v=1759791616",
      },
      {
        name: "PEACH KIWI",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/5_e0d0ec5b-a809-4c62-9374-d1f795efc29c.png?v=1759791615",
      },
      {
        name: "GRAPE",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/4.png?v=1759791615",
      },
    ],
  },
  {
    id: 3,
    name: "DOZO PERKS PSEUDO 20MG PACK / 3 COUNT",
    image:
      "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/DOZO-PERKS-PSEUDOINDOXYL-60MG-10_PK.webp?v=1756940810",
    packagingSpecs: ["20 MG TABS x 3 TABS", "60 MG PACK", "10 PACKS/BOX", "20 BOXES/CASE = 200 PACKS"],
    price: 100,
    variants: [
      {
        name: "BLUE RAZZ (FOCUS)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/WILDMANGO_PARTYBLEND-4CTPACK_eb30b199-b7b8-4082-b897-2a93252b9d88_110x110@2x.png?v=1743020464",
      },
      {
        name: "MANGO (ENERGY)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/MANGO-_-ENERGY-SINGLE_110x110@2x.png?v=1743020464",
      },
      {
        name: "STRAWBERRY (FOCUS)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/STRAWBERRY-_-FOCUS-SINGLE_110x110@2x.png?v=1743020464",
      },
      {
        name: "TROPICAL FRUIT (ENERGY)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/GRAPE_EUPHORIABLEND-4CTPACK_3dc7702b-e1ad-41d6-8915-1a975208ae67_110x110@2x.png?v=1743020464",
      },
    ],
  },
    {
    id: 21,
    name: "DOUBLE DRAGON 7-OH 100MG TAB | 500MG POWER PACK",
    image:
      "https://kcgpssztbdeonjnyqzqw.supabase.co/storage/v1/object/public/invoices/Perks%20Kratom%20extract%205ct%201250mgpack%20(1).png",
    packagingSpecs: ["100 MG TABS x 5 TABS", "500 MG PACK", "5 PACKS/BOX", "30 BOXES/CASE"],
    price: 92.50,
    variants: [
      {
        name: "BLUE RAZZ (RISE BLEND)",
        image:
          "https://kcgpssztbdeonjnyqzqw.supabase.co/storage/v1/object/public/invoices/WhatsApp%20Image%202026-04-01%20at%203.03.47%20AM.jpeg",
      },
      {
        name: "LUCKY CHERRY (FADE BLEND)",
        image:
          "https://kcgpssztbdeonjnyqzqw.supabase.co/storage/v1/object/public/invoices/WhatsApp%20Image%202026-04-01%20at%203.03.47%20AM%20(1).jpeg",
      },
      {
        name: "STRAW MELON (FLOW BLEND)",
        image:
          "https://kcgpssztbdeonjnyqzqw.supabase.co/storage/v1/object/public/invoices/WhatsApp%20Image%202026-04-01%20at%203.03.47%20AM%20(2).jpeg",
      }
    ],
  },
      {
    id: 22,
    name: "DOUBLE DRAGON 7-OH 80MG TAB | 3 IN 1 FLIGHT BOX",
    image:
      "https://kcgpssztbdeonjnyqzqw.supabase.co/storage/v1/object/public/invoices/WhatsApp%20Image%202026-03-31%20at%2011.54.20%20PM.jpeg",
    packagingSpecs: ["80 MG TABS x 30 TABS", "30 TAB/BOX", "30 BOXES/CASE"],
    price: 105,
    variants: [
      {
        name: "WATERMELON RISE BLEND | MANGO FLOW BLEND | GRAPE FADE BLEND",
        image:
          "https://kcgpssztbdeonjnyqzqw.supabase.co/storage/v1/object/public/invoices/WhatsApp%20Image%202026-03-31%20at%2011.54.20%20PM.jpeg",
      }
    ],
  },

        {
    id: 23,
    name: "DOZO PERKS MG-X 125MG TAB / 500MG PACK",
    image:
      "https://kcgpssztbdeonjnyqzqw.supabase.co/storage/v1/object/public/invoices/DOZO%20PERKS%20MG-X%20125MG%20TAB%20_%20500MG%20PACK.png",
    packagingSpecs: ["125 MG TABS x 4 TABS", "500 MG PACK", " 5 PACKS/BOX", "40 BOXES/CASE = 200 PACKS"],
    price: 75,
    variants: [
      {
        name: "BLUE RAZZ",
        image:
          "https://kcgpssztbdeonjnyqzqw.supabase.co/storage/v1/object/public/invoices/blue-razz.jpeg",
      },
      {
        name: "GRAPE",
        image:
          "https://kcgpssztbdeonjnyqzqw.supabase.co/storage/v1/object/public/invoices/grape.jpeg",
      },
      {
        name: "STRAWBERRY",
        image:
          "https://kcgpssztbdeonjnyqzqw.supabase.co/storage/v1/object/public/invoices/starwbery.jpeg",
      },
            {
        name: "WILD MANGO",
        image:
          "https://kcgpssztbdeonjnyqzqw.supabase.co/storage/v1/object/public/invoices/wild-mongo.jpeg",
      }
    ],
  },
]

export default function ProductSurvey() {
  const [currentStep, setCurrentStep] = useState(0)
  const [thcALegal, setThcALegal] = useState<boolean | null>(null)
  const [customerStatus, setCustomerStatus] = useState<string>("")
  const [customerType, setCustomerType] = useState<string>("")
  const [locationCount, setLocationCount] = useState<number>(0)
  const [selectedProducts, setSelectedProducts] = useState<Record<number, SelectedProduct>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [invoiceId, setInvoiceId] = useState<string | null>(null)
  const [showDetailsScreen, setShowDetailsScreen] = useState(false)
  const [accountManager, setAccountManager] = useState<string>("")
  const [customerName, setCustomerName] = useState<string>("")
  const [businessName, setBusinessName] = useState<string>("")
  const [customerCellPhone, setCustomerCellPhone] = useState<string>("")
  const [customerEmail, setCustomerEmail] = useState<string>("")

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successOrderNumber, setSuccessOrderNumber] = useState<number | null>(null)

  const [isNavigating, setIsNavigating] = useState(false)

  // Form data for the initial form (if needed later)
  const [formData, setFormData] = useState({
    salesRepName: "",
    customerName: "",
    customerCellPhone: "",
    businessName: "",
    address: "",
    suite: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    pickupOrShip: "",
    taxPermitFile: null as File | null,
    idFile: null as File | null,
  })

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("wazabi-survey-state")
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        setCurrentStep(parsed.currentStep || 0)
        setThcALegal(parsed.thcALegal)
        setCustomerStatus(parsed.customerStatus || "")
        setCustomerType(parsed.customerType || "")
        setLocationCount(parsed.locationCount || 0)
        setSelectedProducts(parsed.selectedProducts || {})
        setFormData(
          parsed.formData || {
            salesRepName: "",
            customerName: "",
            customerCellPhone: "",
            businessName: "",
            address: "",
            suite: "",
            city: "",
            state: "",
            zip: "",
            email: "",
            pickupOrShip: "",
            taxPermitFile: null,
            idFile: null,
          },
        )
      } catch (error) {
        console.error("Error loading saved state:", error)
        localStorage.removeItem("wazabi-survey-state")
        setCurrentStep(0)
      }
    }
  }, [])

  // Save state to localStorage whenever state changes
  useEffect(() => {
    const stateToSave = {
      currentStep,
      thcALegal,
      customerStatus,
      customerType,
      locationCount,
      selectedProducts,
      formData: {
        ...formData,
        taxPermitFile: null,
        idFile: null,
      },
    }
    localStorage.setItem("wazabi-survey-state", JSON.stringify(stateToSave))
  }, [currentStep, thcALegal, customerStatus, customerType, locationCount, selectedProducts, formData])

  useEffect(() => {
    // Remove the splash screen timer - start directly at step 1
    if (currentStep === 0) {
      setCurrentStep(1)
    }
  }, [currentStep])

  useEffect(() => {
    // Push initial state to history
    if (typeof window !== "undefined") {
      const initialState = {
        step: currentStep,
        showDetailsScreen,
        timestamp: Date.now(),
      }
      window.history.replaceState(initialState, "", window.location.href)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && currentStep > 0) {
      const state = {
        step: currentStep,
        showDetailsScreen,
        timestamp: Date.now(),
      }

      // Only push new state if it's different from current
      const currentState = window.history.state
      if (!currentState || currentState.step !== currentStep || currentState.showDetailsScreen !== showDetailsScreen) {
        window.history.pushState(state, "", window.location.href)
      }
    }
  }, [currentStep, showDetailsScreen])

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log("[v0] Browser back button pressed, event state:", event.state)

      // </CHANGE> Fixed browser back button to properly restore state instead of calling handleBack
      if (event.state && event.state.step !== undefined) {
        // Restore state from browser history
        setCurrentStep(event.state.step)
        setShowDetailsScreen(event.state.showDetailsScreen || false)
        console.log("[v0] Restored state from browser history:", event.state)
      } else {
        // If no state available, go to step 1
        console.log("[v0] No browser state available, going to step 1")
        setCurrentStep(1)
        setShowDetailsScreen(false)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("popstate", handlePopState)

      return () => {
        window.removeEventListener("popstate", handlePopState)
      }
    }
  }, [])

  const updateProgressBar = () => {
    if (currentStep === 1) return 0 // Changed from currentStep === 1
    if (currentStep >= 2 && currentStep < products.length + 5) return 50 // Updated to account for new product grid step
    if (currentStep === products.length + 5) return 100 // Updated to account for new product grid step
    return 0
  }

  const toast = (message: string, bgColor = "#02a8e4") => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 4000)
  }

  const handleRestart = () => {
    localStorage.removeItem("wazabi-survey-state")
    setCurrentStep(0)
    setThcALegal(null)
    setCustomerStatus("")
    setCustomerType("")
    setShowDetailsScreen(false)
    setLocationCount(0)
    setSelectedProducts({})
    setInvoiceId(null)
    setAccountManager("")
    setCustomerName("")
    setBusinessName("")
    setCustomerCellPhone("")
    setCustomerEmail("")
    setShowDetailsScreen(false)
    setFormData({
      salesRepName: "",
      customerName: "",
      customerCellPhone: "",
      businessName: "",
      address: "",
      suite: "",
      city: "",
      state: "",
      zip: "",
      email: "",
      pickupOrShip: "",
      taxPermitFile: null,
      idFile: null,
    })
  }

  const convertImageToBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0)
        const dataURL = canvas.toDataURL("image/jpeg", 0.4) // 40% quality
        resolve(dataURL)
      }
      img.onerror = () => resolve("")
      img.src = url
    })
  }

  // Optimized function to create a compact product summary for PDF
  const createCompactProductSummary = (selectedProducts: Record<number, SelectedProduct>) => {
    const summary: any = {}

    Object.values(selectedProducts).forEach((product) => {
      const compactVariants: Record<string, number> = {}
      Object.entries(product.variantsSelected).forEach(([variant, qty]) => {
        if (qty > 0) {
          compactVariants[variant] = qty
        }
      })

      if (Object.keys(compactVariants).length > 0) {
        summary[product.id] = {
          name: product.name,
          price: product.price, // Added price field to compact summary
          variantsSelected: compactVariants, // Changed from 'variants' to 'variantsSelected' to match invoice expectations
          image: product.image,
        }
      }
    })

    return summary
  }

  const generatePDF = async (orderNumber: number, invoiceId: string) => {
    const jsPDF = (await import("jspdf")).default
    const html2canvas = (await import("html2canvas")).default

    const formattedOrderNumber = String(orderNumber).padStart(3, "0")

    const invoiceContainer = document.createElement("div")
    invoiceContainer.id = "invoice-template"
    invoiceContainer.style.width = "210mm" // A4 width
    invoiceContainer.style.padding = "10mm"
    invoiceContainer.style.fontFamily = "sans-serif"
    invoiceContainer.style.fontSize = "10px"
    invoiceContainer.style.color = "#000"
    invoiceContainer.style.background = "#fff"
    invoiceContainer.style.position = "absolute"
    invoiceContainer.style.left = "-9999px"
    invoiceContainer.style.top = "-9999px"

    const orderDate = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })

    let itemsHtml = ""
    let totalAmount = 0 // Added total amount calculation

    for (const product of Object.values(selectedProducts)) {
      for (const [variant, qty] of Object.entries(product.variantsSelected)) {
        if (qty > 0) {
          const variantImageUrl = (product.variants.find((v) => v.name === variant) || {}).image || product.image
          const base64Image = await convertImageToBase64(variantImageUrl)

          const unitPrice = product.price || 0
          const lineTotal = unitPrice * qty
          totalAmount += lineTotal

          itemsHtml += `
      <div class="break-inside-avoid" style="display: flex; align-items: center; margin-bottom: 10px;">
        <img src="${base64Image}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 10px; border-radius: 4px;">
        <div style="flex-grow: 1;">
          <div style="font-weight: bold;">${product.name}</div>
          <div style="color: #555;">${variant}</div>
        </div>
        <div style="text-align: right; min-width: 80px;">
          <div style="font-weight: bold;">${qty}</div>
          <div style="font-size: 9px; color: #666;">$${unitPrice} × ${qty}</div>
          <div style="font-weight: bold; color: #000;">$${lineTotal}</div>
        </div>
      </div>
    `
        }
      }
    }

    invoiceContainer.innerHTML = `
<div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
<div style="font-size: 24px; font-weight: bold;">Invoice #${formattedOrderNumber}</div>
<div style="text-align: right;">
  <div>Order ID: ${invoiceId}</div>
  <div>Date: ${orderDate}</div>
</div>
</div>

<div style="display: flex; justify-content: space-between; margin-bottom: 20px; gap: 20px;">
<div style="flex: 1;">
  <div style="font-weight: bold; margin-bottom: 5px; color: #333;">CUSTOMER DETAILS</div>
  <div>Account Manager: ${accountManager || "N/A"}</div>
  <div>Your Name: ${customerName || "N/A"}</div>
  <div>Your Business Name: ${businessName || "N/A"}</div>
  <div>Your Cell Number: ${customerCellPhone || "N/A"}</div>
  <div>Customer Type: ${customerType || "N/A"}</div>
  <div>Customer Status: ${customerStatus || "N/A"}</div>
  <div>Is 7-Hydroxymitragynine (7-OH) legal in your state?: ${thcALegal || "N/A"}</div>
</div>
</div>

<hr style="border-top: 1px solid #ccc; margin: 40px 0;">

<div id="invoice-items" style="margin-top:0px;">
${itemsHtml}
</div>

<hr style="border-top: 1px solid #000; margin: 20px 0;">
<div style="text-align: right; margin-bottom: 20px;">
  <div style="font-size: 16px; font-weight: bold;">Total Amount: $${totalAmount}</div>
</div>
<div style="text-align: center; margin-top: 40px;">
  <div>Thank you for shopping with us!</div>
</div>
`

    document.body.appendChild(invoiceContainer)

    const canvas = await html2canvas(invoiceContainer, {
      scale: 1, // Adjust scale for better resolution if needed
      scrollY: -window.scrollY, // Ensure correct scroll position
      backgroundColor: "#ffffff",
      windowWidth: invoiceContainer.scrollWidth,
      height: invoiceContainer.scrollHeight,
      useCORS: true,
    })
    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF("p", "mm", "a4")
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width // Scaled image height

    let heightLeft = imgHeight
    let position = 0
    let pageNumber = 0

    while (heightLeft > 0) {
      if (pageNumber > 0) {
        pdf.addPage()
      }
      // Calculate the Y position for the current slice of the image
      // This effectively moves the image up to show the next part on the new page
      position = -(pageNumber * pageHeight)
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      pageNumber++
    }

    document.body.removeChild(invoiceContainer)

    return pdf
  }

  const sendEmailWithPdfUrl = async (pdfUrl: string, orderNumber: number) => {
    console.log("🔄 Sending PDF URL to API endpoint...")
    try {
      const res = await fetch("/api/send-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfUrl, orderNumber }),
      })

      const responseData = await res.json()
      console.log(`🔄 API response status: ${res.status}`, responseData)

      if (res.ok) {
        toast("Order notification sent to admin successfully!")
      } else {
        console.error(`🔄 API error: Status ${res.status}`, responseData)
        toast(`Failed to send order notification: ${responseData.error || res.statusText}`, "#ef4444")
      }
    } catch (err) {
      console.error("🔄 Fetch error:", err)
      toast(`Error sending notification: ${err instanceof Error ? err.message : "Unknown error"}`, "#ef4444")
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(selectedProducts).length === 0) {
      toast("Please select at least one product before placing the order.", "#ef4444")
      return
    }

    setIsLoading(true)

    try {
      // Step 1: Save invoice data
      const form = new FormData()

      // Create a compact product summary to reduce payload size
      const compactProducts = createCompactProductSummary(selectedProducts)

      const structuredData = {
        thcALegal,
        customerStatus,
        customerType,
        locationCount,
        accountManager,
        customerName,
        businessName,
        customerCellPhone,
        customerEmail,
        selectedProducts: compactProducts,
      }

      form.append("data", JSON.stringify(structuredData))

      console.log("🔄 Submitting order...")
      const response = await fetch("api/invoices", {
        method: "POST",
        body: form,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save invoice data.")
      }

      const { id: newInvoiceId, order_number: orderNumber } = await response.json()
      setInvoiceId(newInvoiceId)

      setSuccessOrderNumber(orderNumber)
      setShowSuccessModal(true)
      setIsLoading(false)

      // Step 3: Generate PDF and upload in background
      setTimeout(async () => {
        try {
          console.log("🔄 Starting PDF generation...")
          const pdf = await generatePDF(orderNumber, newInvoiceId)
          const pdfBlob = pdf.output("blob")
          const pdfFileName = `Wazabi_Order_${String(orderNumber).padStart(3, "0")}_${new Date().toISOString().split("T")[0]}.pdf`

          console.log("🔄 Uploading PDF to storage...",pdfBlob)
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("invoices")
            .upload(`public/${pdfFileName}`, pdfBlob, {
              contentType: "application/pdf",
              cacheControl: "3600",
              upsert: true,
            })

          if (uploadError) {
            console.error("❌ PDF upload error:", uploadError)
            throw new Error(uploadError.message)
          }

          const { data: urlData } = supabase.storage.from("invoices").getPublicUrl(uploadData.path)
          const publicURL = urlData.publicUrl

          console.log("🔄 Updating invoice with PDF URL...")
          // Update the invoice record with the PDF URL
          const updateResponse = await fetch(`/api/invoices/${newInvoiceId}/pdf`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pdf_url: publicURL }),
          })

          if (!updateResponse.ok) {
            console.error("❌ Failed to update PDF URL")
          }

          console.log("🔄 Sending email with PDF...")
          await sendEmailWithPdfUrl(publicURL, orderNumber)
          console.log("✅ Process completed successfully")
        } catch (error) {
          console.error("⚠️ Background PDF/Email process failed:", error)
          // Don't show error to user since order was already saved successfully
        }
      }, 100)
    } catch (error) {
      console.error("❌ Submission Error:", error)
      toast(`Error: ${(error as Error).message || "Something went wrong"}`, "#ef4444")
      setIsLoading(false)
    }
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    setSuccessOrderNumber(null)
    handleRestart()
  }

  const selectCustomerType = (type: string) => {
    setCustomerType(type)
  }

  const insertLineBreaks = (text: string, wordsPerLine = 5) => {
    return text.split(" ").reduce((acc, word, index) => {
      return acc + word + ((index + 1) % wordsPerLine === 0 ? "\n" : " ")
    }, "")
  }

  const getSelectedProductsWithQuantities = () => {
    return products.filter((product) => {
      const productData = selectedProducts[product.id]
      if (!productData) return false

      // Check if any variant has a quantity greater than 0
      return Object.values(productData.variantsSelected).some((quantity) => quantity > 0)
    })
  }

  const [currentSelectedProductIndex, setCurrentSelectedProductIndex] = useState(0)

  const handleNext = () => {
    console.log("[v0] handleNext called, currentStep:", currentStep, "showDetailsScreen:", showDetailsScreen)

    if (currentStep === 3 && customerType && !showDetailsScreen) {
      setShowDetailsScreen(true)
      return
    }

    if (showDetailsScreen && currentStep === 3) {
      console.log("[v0] Details screen validation - Account Manager:", `"${accountManager}"`)
      console.log("[v0] Details screen validation - Customer Name:", `"${customerName}"`)
      console.log("[v0] Details screen validation - Business Name:", `"${businessName}"`)
      console.log("[v0] Details screen validation - Cell Phone:", `"${customerCellPhone}"`)
      console.log("[v0] Details screen validation - Email:", `"${customerEmail}"`)

      const isAccountManagerValid = accountManager.trim() !== ""
      const isCustomerNameValid = customerName.trim() !== ""
      const isBusinessNameValid = businessName.trim() !== ""
      const isCellPhoneValid = customerCellPhone.trim() !== ""
      const isEmailValid = customerEmail.trim() !== ""

      console.log("[v0] Validation results:", {
        accountManager: isAccountManagerValid,
        customerName: isCustomerNameValid,
        businessName: isBusinessNameValid,
        cellPhone: isCellPhoneValid,
        email: isEmailValid,
      })

      if (
        !isAccountManagerValid ||
        !isCustomerNameValid ||
        !isBusinessNameValid ||
        !isCellPhoneValid ||
        !isEmailValid
      ) {
        alert("Please fill in all required fields before proceeding.")
        return
      }

      console.log("[v0] Validation passed, moving to product grid step 4") // Updated to go to product grid
      setShowDetailsScreen(false)
      setCurrentStep(4) // Go to product grid instead of step 5
      return
    }

    if (currentStep >= 5 && currentStep < products.length + 5) {
      const productIndex = currentStep - 5
      const product = products[productIndex]

      if (product && selectedProducts[product.id]) {
        const hasQuantity = Object.values(selectedProducts[product.id].variantsSelected).some((qty) => qty > 0)
        if (!hasQuantity) {
          alert("Please add quantity for at least one variant before proceeding to the next product.")
          return
        }
      }
    }

    setCurrentStep(currentStep + 1)
  }

  const shouldShowNextButton = () => {
    if (currentStep === 1) return thcALegal !== null
    if (currentStep === 2) return customerStatus !== ""
    if (currentStep === 3) return customerType !== ""
    if (showDetailsScreen) {
      const isValid =
        accountManager !== "" &&
        customerName.trim() !== "" &&
        businessName.trim() !== "" &&
        customerCellPhone.trim() !== ""
      console.log("[v0] Details screen button visibility:", isValid, {
        accountManager,
        customerName: customerName.trim(),
        businessName: businessName.trim(),
        customerCellPhone: customerCellPhone.trim(),
      })
      return isValid
    }
    if (currentStep === 4) return false // Product grid doesn't need Next button
    if (currentStep >= 5 && currentStep < products.length + 5) {
      // Updated step numbers
      return false // Individual product pages don't show Next button anymore
    }
    if (currentStep === products.length + 5) return false // Updated step number for order summary
    return true
  }

  const renderStep = () => {
    if (showDetailsScreen) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="mb-8"></div>

          <h2 className="text-xl text-gray-700 mb-8">Please provide your details</h2>

          <div className="w-full max-w-md space-y-6">
            <div>
              <select
                value={accountManager}
                onChange={(e) => setAccountManager(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bcd4] text-gray-700 bg-white"
              >
                <option value="">Select Account Manager&nbsp;*</option>
                <option value="Assign me one">Assign me one</option>
                <option value="Denisse - 0811">Denisse - 0811</option>
                <option value="Khan - 0782">Khan - 0782</option>
                <option value="Lucky - 6786">Lucky - 6786</option>
                <option value="Nizar Habibi - 0505">Nizar Habibi - 0505</option>
                <option value="Zaki - 0789">Zaki - 0789</option>
              </select>
            </div>

            <div>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    ;(e.target as HTMLInputElement).blur()
                    // Move focus to next field or trigger next action
                    const nextField = document.querySelector(
                      'input[placeholder="Your Business Name *"]',
                    ) as HTMLInputElement
                    if (nextField) nextField.focus()
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bcd4] placeholder-gray-400"
                placeholder="Your Name *"
              />
            </div>

            <div>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    ;(e.target as HTMLInputElement).blur()
                    // Move focus to next field
                    const nextField = document.querySelector(
                      'input[placeholder="Your Cell Number *"]',
                    ) as HTMLInputElement
                    if (nextField) nextField.focus()
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bcd4] placeholder-gray-400"
                placeholder="Your Business Name *"
              />
            </div>

            <div>
              <input
                type="tel"
                value={customerCellPhone}
                onChange={(e) => setCustomerCellPhone(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    ;(e.target as HTMLInputElement).blur()
                    // Move focus to next field
                    const nextField = document.querySelector('input[placeholder="Your Email *"]') as HTMLInputElement
                    if (nextField) nextField.focus()
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bcd4] placeholder-gray-400"
                placeholder="Your Cell Number *"
              />
            </div>

            <div>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    ;(e.target as HTMLInputElement).blur()
                    // Check if all fields are filled and proceed to next step
                    if (
                      accountManager.trim() !== "" &&
                      customerName.trim() !== "" &&
                      businessName.trim() !== "" &&
                      customerCellPhone.trim() !== "" &&
                      customerEmail.trim() !== ""
                    ) {
                      handleNext()
                    }
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bcd4] placeholder-gray-400"
                placeholder="Your Email *"
              />
            </div>
          </div>
        </div>
      )
    }

    // THC-A Legal Question - now starts at step 1
    if (currentStep === 1) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-0">
          <div className="flex justify-center mb-4">
            <img
              src="/images/design-mode/BBD_Logo_Blue-01_1%281%29%281%29%281%29%281%29%281%29%281%29(1).png"
              alt="BBD Logo"
              className="h-12 object-contain"
            />
          </div>
          <h2 className="text-xl text-gray-700 mb-6">Is 7-Hydroxymitragynine (7-OH) legal in your state?</h2>
          <div className="flex justify-center gap-6">
            <div className="grid grid-cols-2 gap-4 mt-4">
              <button
                className="w-full bg-transparent border border-[#02a8e4] text-[#02a8e4] font-medium py-3 px-16 rounded-md text-base"
                onClick={() => {
                  setThcALegal(false)
                  setCurrentStep(2)
                }}
              >
                No
              </button>
              <button
                className="w-full bg-[#02a8e4] hover:bg-[#0296d1] text-white font-medium py-3 px-16 rounded-md text-base"
                onClick={() => {
                  setThcALegal(true)
                  setCurrentStep(2)
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )
    }

    // New Customer Status Question
    if (currentStep === 2) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-0">
          <div className="flex justify-center mb-4"></div>
          <h2 className="text-xl text-gray-700 mb-6">Are you a new or existing customer?</h2>
          <div className="flex justify-center gap-6">
            <div className="grid grid-cols-2 gap-4 mt-4">
              <button
                className="w-full bg-transparent border border-[#02a8e4] text-[#02a8e4] font-medium py-3 px-12 rounded-md text-base"
                onClick={() => {
                  setCustomerStatus("New Customer")
                  setCurrentStep(3)
                }}
              >
                New
              </button>
              <button
                className="w-full bg-[#02a8e4] hover:bg-[#0296d1] text-white font-medium py-3 px-12 rounded-md text-base"
                onClick={() => {
                  setCustomerStatus("Existing Customer")
                  setCurrentStep(3)
                }}
              >
                Existing
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Customer Type Selection
    if (currentStep === 3) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-0">
          <h2 className="text-xl text-gray-700 mb-6">Select Customer Type</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <div
              onClick={() => selectCustomerType("Store")}
              id="type-store"
              className={`cursor-pointer border-2 rounded-xl p-6 hover:border-[#02a8e4] w-[calc(50%-0.5rem)] md:w-40 text-center flex flex-col items-center justify-center ${
                customerType === "Store" ? "border-[#02a8e4]" : "border-gray-300"
              }`}
            >
              <div className="mb-2 flex justify-center">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400"
                  id="Layer_1"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 122.88 102.36"
                >
                  <defs>
                    <style>{`.cls-1{fillRule:evenodd;}`}</style>
                  </defs>
                  <title>store</title>
                  <path
                    className="cls-1 opacity-50"
                    d="M69.19,77.45a1.75,1.75,0,1,1-1.75,1.75,1.75,1.75,0,0,1,1.75-1.75ZM22.11,22.84H3.44v3a8.48,8.48,0,0,0,8.43,8.46c2.32,0,6.24-.95,7.77-2.49a8.45,8.45,0,0,0,2.47-6v-3Zm-17.81-3H22.64l3-16.93h-14L4.3,19.82ZM74.43,2.89,75.7,19.82H96.21L92.75,2.89ZM71.69,19.82,70.43,2.89h-18L51.18,19.82Zm-24.52,0L48.41,2.89H29.66l-3,16.93ZM96.74,2.89l3.45,16.93h18.29L110.57,2.89Zm4,20v3a8.45,8.45,0,0,0,2.47,6c1.53,1.54,5.45,2.49,7.77,2.49a8.48,8.48,0,0,0,8.43-8.46v-3ZM76,22.84v3a8.42,8.42,0,0,0,2.48,6c1.53,1.54,5.44,2.49,7.76,2.49s6.23-.95,7.76-2.49a8.42,8.42,0,0,0,2.48-6v-3Zm-24.82,0v3a8.42,8.42,0,0,0,2.48,6c1.53,1.54,5.44,2.49,7.76,2.49s6.23-.95,7.76-2.49a8.42,8.42,0,0,0,2.48-6v-3Zm-24.82,0v3a8.42,8.42,0,0,0,2.48,6c1.53,1.54,5.44,2.49,7.76,2.49s6.23-.95,7.76-2.49a8.42,8.42,0,0,0,2.48-6v-3Zm79.71,13.79c-1.25-.58-4.33-1.38-5.3-2.35a12,12,0,0,1-2.12-2.88,12,12,0,0,1-2.12,2.88c-2.14,2.14-7,3.46-10.29,3.46S78.11,36.42,76,34.28a12,12,0,0,1-2.12-2.88,12,12,0,0,1-2.12,2.88c-2.14,2.14-7,3.46-10.29,3.46s-8.15-1.32-10.29-3.46a12,12,0,0,1-2.12-2.88,12,12,0,0,1-2.12,2.88c-1.41,1.41-5.12,2.46-7.08,3q-.64.08-1.32.12V95.86a1.12,1.12,0,0,0,.33.79,1.15,1.15,0,0,0,.81.34h45V56.62a9.76,9.76,0,0,1,9.74-9.74H85.64a9.76,9.76,0,0,1,9.73,9.74V97h12.68a1.13,1.13,0,0,0,.8-.34h0a1.13,1.13,0,0,0,.32-.79V37.48c0-.11,0-.22,0-.32a24.62,24.62,0,0,1-3.11-.53ZM64.33,97H90.85V56.62a5.24,5.24,0,0,0-5.22-5.22H69.55a5.24,5.24,0,0,0-5.22,5.22V97ZM30,54.32h16.1a2.27,2.27,0,0,1,2.27,2.26V80.51a2.27,2.27,0,0,1-2.27-2.27H30a2.27,2.27,0,0,1-2.27-2.27V56.58A2.27,2.27,0,0,1,30,54.32Zm13.84,4.53H32.25v19.4H43.84V58.85ZM8.37,37a10.49,10.49,0,0,1-4.9-2.67A11.77,11.77,0,0,1,0,25.94V21.3H0a1.45,1.45,0,0,1,.17-.67L9.45.69A1.33,1.33,0,0,1,10.62,0h100.9a1.35,1.35,0,0,1,1.21.76l10,19.83a1.35,1.35,0,0,1,.19.63h0a.57.57,0,0,1,0,.13v4.58a11.77,11.77,0,0,1-3.47,8.34,10,10,0,0,1-4.91,2.64,2.6,2.6,0,0,1,.06.56V95.86a6.49,6.49,0,0,1-1.92,4.58h0a6.49,6.49,0,0,1-4.6,1.91H14.83a6.49,6.49,0,0,1-4.59-1.91h0a6.46,6.46,0,0,1-1.91-4.58V37.48a3.07,3.07,0,0,1,0-.53Z"
                  />
                </svg>
              </div>
              <div className="font-medium text-center">Store</div>
            </div>
            <div
              onClick={() => selectCustomerType("Wholesale")}
              id="type-wholesale"
              className={`cursor-pointer border-2 rounded-xl p-6 hover:border-[#02a8e4] w-[calc(50%-0.5rem)] md:w-40 text-center flex flex-col items-center justify-center ${
                customerType === "Wholesale" ? "border-[#02a8e4]" : "border-gray-300"
              }`}
            >
              <div className="mb-2 flex justify-center">
                <svg
                  fill="#000000"
                  width="256px"
                  height="256px"
                  viewBox="0 0 50 50"
                  className="text-gray-400 opacity-50 w-9 h-12"
                >
                  <path d="M9 0C7.355469 0 6 1.355469 6 3L6 50L44 50L44 3C44 1.355469 42.644531 0 41 0 Z M 9 2L41 2C41.554688 2 42 2.445313 42 3L42 48L38 48L38 36L27 36L27 48L8 48L8 3C8 2.445313 8.445313 2 9 2 Z M 12 6L12 14L23 14L23 6 Z M 27 6L27 14L38 14L38 6 Z M 14 8L21 8L21 12L14 12 Z M 29 8L36 8L36 12L29 12 Z M 12 16L12 24L23 24L23 16 Z M 27 16L27 24L38 24L38 16 Z M 14 18L21 18L21 22L14 22 Z M 29 18L36 18L36 22L29 22 Z M 12 26L12 34L23 34L23 26 Z M 27 26L27 34L38 34L38 26 Z M 14 28L21 28L21 32L14 32 Z M 29 28L36 28L36 32L29 32 Z M 12 36L12 44L23 44L23 36 Z M 14 38L21 38L21 42L14 42 Z M 29 38L36 38L36 48L29 48Z" />
                </svg>
              </div>
              <div className="font-medium text-center">Wholesale</div>
            </div>
          </div>

          {customerType === "Store" && (
            <div id="location-input" className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">How many locations do you have?</label>
              <input
                type="number"
                id="location-count"
                min="1"
                value={locationCount || ""}
                onChange={(e) => setLocationCount(Number.parseInt(e.target.value) || 0)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    ;(e.target as HTMLInputElement).blur()
                    handleNext()
                  }
                }}
                className="w-48 mx-auto p-3 border rounded-xl shadow-sm"
              />
            </div>
          )}
        </div>
      )
    }

    if (currentStep === 4) {
      const hasProductsWithQuantities = Object.values(selectedProducts).some((product) =>
        Object.values(product.variantsSelected).some((qty) => qty > 0),
      )

      return (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-2 md:px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 max-w-6xl mx-auto">
              {products.map((product, index) => {
                const hasQuantity =
                  selectedProducts[product.id] &&
                  Object.values(selectedProducts[product.id].variantsSelected).some((qty) => qty > 0)

                return (
                  <div
                    key={product.id}
                    className={`product-card p-2 md:p-4 border rounded-xl bg-white shadow text-center transition-all cursor-pointer relative ${
                      product.soldOut
                        ? "opacity-50 cursor-not-allowed"
                        : hasQuantity
                          ? "bg-blue-50 border-[#02a8e4] border-2"
                          : "hover:bg-blue-50 hover:border-[#02a8e4]"
                    }`}
                    onClick={() => {
                      if (!product.soldOut) {
                        console.log(
                          `[v0] Clicking product at index ${index}, ID ${product.id}, navigating to step ${5 + index}`,
                        )

                        handleProductSelect(product.id, true)

                        setCurrentStep(5 + index) // Navigate to individual product page using array index
                      }
                    }}
                  >
                    {hasQuantity && (
                      <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-[#02a8e4] text-white text-xs px-1 md:px-2 py-1 rounded-full font-medium">
                        Selected
                      </div>
                    )}
                    <img
                      src={product.image || "/placeholder.svg"}
                      className="mx-auto mb-2 md:mb-3 rounded max-w-full h-auto"
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = "/product-placeholder.png"
                      }}
                    />
                    <h4 className="text-xs md:text-md font-semibold mb-2 leading-tight">{product.name}</h4>
                    {product.soldOut && (
                      <div className="mt-2 px-2 md:px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full inline-block">
                        SOLD OUT
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* All Products Page Navigation */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mb-4">
            <div className="flex gap-2 md:gap-4">
              <button
                onClick={handleBack}
                className="hover:bg-gray-300 flex-1 py-3 font-semibold bg-gray-200 text-black rounded-lg shadow"
              >
                BACK
              </button>

              {hasProductsWithQuantities && (
                <button
                  onClick={() => {
                    setCurrentStep(products.length + 5)
                  }}
                  className="bg-[#02a8e4] hover:bg-[#0296d1] text-white flex-1 py-3 font-semibold shadow rounded-lg"
                >
                  CHECKOUT
                </button>
              )}
            </div>
          </div>
        </div>
      )
    }

    // This block is for individual product pages
    if (currentStep >= 5 && currentStep < products.length + 5) {
      const productIndex = currentStep - 5
      const product = products[productIndex]

      // Add debug logging
      console.log(`Current step: ${currentStep}, Product index: ${productIndex}, Total products: ${products.length}`)

      if (!product) {
        console.error(`Product not found at index ${productIndex}`)
        return <div>Product not found</div>
      }

      const isSelected = selectedProducts[product.id]
      const isSoldOut = product.soldOut

      const hasQuantity =
        isSelected && Object.values(selectedProducts[product.id].variantsSelected).some((qty) => qty > 0)

      return (
        <div className="relative h-full flex flex-col">
          <div className="flex-1 overflow-auto">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start h-full">
              <div className="w-full md:w-1/2 md:sticky md:top-0 md:self-start">
                <div
                  className={`product-card p-3 md:p-4 border rounded-xl bg-white shadow text-center transition-all ${
                    isSoldOut
                      ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-75"
                      : `cursor-pointer hover:bg-blue-50 hover:border-[#02a8e4] ${
                          isSelected ? "border-2 border-[#02a8e4] bg-blue-50" : ""
                        }`
                  }`}
                  onClick={() => !isSoldOut && handleProductSelect(product.id, true)}
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    className="mx-auto mb-2 md:mb-3 rounded max-w-full h-auto"
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src = "/product-placeholder.png"
                    }}
                  />
                  <h4 className="text-sm md:text-md font-semibold">{product.name}</h4>
                  {isSoldOut && (
                    <div className="mt-2 px-2 md:px-3 py-1 bg-red-100 text-red-700 text-xs md:text-sm font-medium rounded-full inline-block">
                      SOLD OUT
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full md:w-1/2 md:overflow-y-auto md:max-h-96 leading-3">
                <div className="mb-4 p-2 md:p-3 bg-gray-50 rounded-lg mt-4 md:mt-6">
                  <h5 className="text-xs md:text-sm font-medium text-gray-700 mb-2">📦 Packaging Specs</h5>
                  <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                    {product.packagingSpecs.map((spec, index) => (
                      <li className="my-0" key={index}>
                        {spec}
                      </li>
                    ))}
                  </ul>
                  <h5 className="text-xs md:text-sm font-medium text-gray-700 mb-2 mt-2">
                    💲 Priced Per Box: ${product.price || 0}
                  </h5>
                </div>

                {isSelected && !isSoldOut && (
                  <>
                    <div className="mb-4 flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          quickPurchase(product.id, 40)
                        }}
                        className="w-full py-2 px-2 md:px-4 hover:bg-blue-700 text-white text-xs md:text-sm font-medium rounded-lg transition-colors bg-[rgba(2,168,228,1)]"
                      >
                        Quick Purchase [2 Case Per Flavor]
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          quickPurchase(product.id, 20)
                        }}
                        className="w-full py-2 px-2 md:px-4 hover:bg-blue-700 text-white text-xs md:text-sm font-medium rounded-lg transition-colors bg-[rgba(2,168,228,1)]"
                      >
                        Quick Purchase [1 Case Per Flavor]
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          quickPurchase(product.id, 10)
                        }}
                        className="w-full py-2 px-2 md:px-4 hover:bg-blue-700 text-white text-xs md:text-sm font-medium rounded-lg transition-colors bg-[rgba(2,168,228,1)]"
                      >
                        Quick Purchase [10 Boxes Per Flavor]
                      </button>
                    </div>
                  </>
                )}

                <div className="mb-6">
                  <div className="flex justify-between items-center px-2 mb-2.5">
                    <h3 className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wide">OPTIONS</h3>
                    <div className="text-right">
                      <h3 className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wide text-center">
                        QUANTITY
                      </h3>
                      <p className="mt-1 text-center text-xs md:text-sm font-medium text-gray-800">BY BOXES </p>
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    {product.variants.map((variant) => {
                      const qty = selectedProducts[product.id]?.variantsSelected[variant.name] || 0

                      return (
                        <div
                          key={variant.name}
                          className={`flex items-center justify-between p-2 md:p-3 rounded-lg border ${
                            isSelected && !isSoldOut
                              ? "bg-white border-gray-100"
                              : "bg-gray-50 border-gray-200 opacity-60"
                          }`}
                        >
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <img
                                src={variant.image || "/placeholder.svg"}
                                className="w-8 h-8 md:w-10 md:h-10 rounded object-cover"
                                alt={variant.name}
                              />
                            </div>
                            <div className="text-xs font-medium text-gray-800 uppercase" style={{ fontSize: "10px" }}>
                              {variant.name}
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 md:space-x-2">
                            <button
                              className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-colors text-sm md:text-lg font-bold ${
                                isSelected && !isSoldOut
                                  ? "border-blue-400 text-blue-400 hover:bg-blue-50 cursor-pointer"
                                  : "border-gray-300 text-gray-300 cursor-not-allowed"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (isSelected && !isSoldOut) {
                                  updateVariantQuantity(product.id, variant.name, qty - 1)
                                }
                              }}
                              disabled={!isSelected || isSoldOut}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={qty}
                              onChange={(e) => {
                                if (isSelected && !isSoldOut) {
                                  const valStr = e.target.value
                                  let val = 0
                                  if (valStr === "") {
                                    val = 0
                                  } else if (valStr === "0") {
                                    val = 0
                                  } else {
                                    val = Number.parseInt(valStr.replace(/^0+/, "")) || 0
                                  }
                                  updateVariantQuantity(product.id, variant.name, val)
                                }
                              }}
                              onClick={(e) => {
                                if (isSelected && !isSoldOut) {
                                  e.target.select()
                                }
                              }}
                              onFocus={(e) => {
                                if (isSelected && !isSoldOut && e.target.value === "0") {
                                  e.target.value = ""
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault()
                                  const val = Number.parseInt((e.target as HTMLInputElement).value) || 0
                                  if (isSelected && !isSoldOut) {
                                    updateVariantQuantity(product.id, variant.name, val)
                                  }
                                  ;(e.target as HTMLInputElement).blur()
                                }
                              }}
                              className={`w-10 md:w-12 text-center border rounded text-xs md:text-sm font-medium focus:outline-none px-1 md:px-2 py-1 ${
                                isSelected && !isSoldOut
                                  ? "border-gray-300 bg-white focus:border-blue-400 cursor-text"
                                  : "border-gray-200 bg-gray-100 cursor-not-allowed"
                              }`}
                              min="0"
                              disabled={!isSelected || isSoldOut}
                              readOnly={!isSelected || isSoldOut}
                            />
                            <button
                              className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-colors text-sm md:text-lg font-bold ${
                                isSelected && !isSoldOut
                                  ? "border-blue-400 text-blue-400 hover:bg-blue-50 cursor-pointer"
                                  : "border-gray-300 text-gray-300 cursor-not-allowed"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (isSelected && !isSoldOut) {
                                  updateVariantQuantity(product.id, variant.name, qty + 1)
                                }
                              }}
                              disabled={!isSelected || isSoldOut}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Page Navigation */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mb-4">
            <div className="flex gap-2 md:gap-4">
              {!hasQuantity ? (
                <button
                  onClick={() => {
                    // Go back to product grid (step 4)
                    setCurrentStep(4)
                  }}
                  className="hover:bg-gray-300 flex-1 py-3 font-semibold bg-gray-200 text-black rounded-lg shadow"
                >
                  BACK
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      // Go back to product grid (step 4)
                      setCurrentStep(4)
                    }}
                    className="hover:bg-gray-300 flex-1 py-3 font-semibold bg-gray-200 text-black rounded-lg shadow"
                  >
                    ADD ANOTHER
                  </button>
                  <button
                    onClick={() => {
                      // Go to order summary (step after all products)
                      setCurrentStep(products.length + 5)
                    }}
                    className="bg-[#02a8e4] hover:bg-[#0296d1] text-white flex-1 py-3 font-semibold shadow rounded-lg"
                  >
                    CHECKOUT
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )
    }

    if (currentStep === products.length + 5) {
      const hasSelectedProducts = Object.keys(selectedProducts).length > 0
      return (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-6 px-0">
            <div className="flex-shrink-0 text-center mb-6">
              <h2 className="text-xl text-gray-700 mb-4">Order Summary</h2>
            </div>

            <div className="flex-shrink-0 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Customer Information</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="space-y-2">
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-medium text-gray-600">7-OH Legal Status:</td>
                        <td className="py-2 text-gray-800">{thcALegal ? "Yes" : "No"}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-medium text-gray-600">Customer Status:</td>
                        <td className="py-2 text-gray-800">{customerStatus}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-medium text-gray-600">Customer Type:</td>
                        <td className="py-2 text-gray-800">{customerType}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-medium text-gray-600">Account Manager:</td>
                        <td className="py-2 text-gray-800">{accountManager}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-medium text-gray-600">Customer Name:</td>
                        <td className="py-2 text-gray-800">{customerName}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-medium text-gray-600">Business Name:</td>
                        <td className="py-2 text-gray-800">{businessName}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-gray-600">Cell Number:</td>
                        <td className="py-2 text-gray-800">{customerCellPhone}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Selected Products</h3>
              <div className="space-y-3 overflow-y-auto pr-2">
                {Object.values(selectedProducts).map((product) => {
                  const productData = products.find((p) => p.id === product.id)
                  return Object.entries(product.variantsSelected).map(([variant, quantity]) =>
                    quantity > 0 ? (
                      <div
                        key={`${product.id}-${variant}`}
                        className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-3 shadow-sm"
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <img
                              src={
                                productData?.variants.find((v) => v.name === variant)?.image ||
                                "/placeholder.svg?height=40&width=40" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                              alt={variant}
                              className="w-8 h-8 object-cover rounded"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-gray-800 text-sm truncate">{variant}</h3>
                            <p className="text-xs text-gray-500 uppercase truncate">{product.name}</p>
                            <p className="text-xs text-gray-600">
                              ${productData?.price || 0} × {quantity} = ${(productData?.price || 0) * quantity}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <button
                            onClick={() => updateVariantQuantity(product.id, variant, quantity - 1)}
                            className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50 text-sm font-medium text-blue-400 border-blue-400"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-medium text-gray-800 text-sm">{quantity}</span>
                          <button
                            onClick={() => updateVariantQuantity(product.id, variant, quantity + 1)}
                            className="w-7 h-7 rounded-full border border-blue-400 text-blue-400 flex items-center justify-center hover:bg-blue-50 text-sm font-medium"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ) : null,
                  )
                })}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Total Amount:</span>
                  <span className="font-bold text-lg text-blue-600">${calculateTotalPrice()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative bg-white border-t border-gray-200 p-4 mb-4">
            <div className="flex gap-2 md:gap-4">
              <button
                onClick={() => {
                  handleBack()
                }}
                className="hover:bg-gray-300 flex-1 py-3 font-semibold text-black rounded-lg shadow bg-gray-200"
              >
                BACK
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-[#02a8e4] hover:bg-[#0296d1] text-white flex-1 py-3 font-semibold shadow rounded-lg"
              >
                {isLoading ? "Processing Order & Generating PDF..." : "PLACE ORDER"}
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  const shouldShowNavButtons = () => {
    if (currentStep === 1) return true // Show nav buttons for step 1
    if (currentStep === 2) return true
    if (currentStep === 3) return true
    if (currentStep === 4) return false // Product grid handles its own buttons
    if (currentStep >= 5 && currentStep < products.length + 5) return false // Individual product pages handle their own back button
    if (currentStep === products.length + 5) return false // Order summary handles its own buttons
    return currentStep > 3
  }

  const shouldShowBackButton = () => {
    if (currentStep === 4) return true // Show back button on product grid
    if (currentStep >= 5 && currentStep < products.length + 5) return false // Individual product pages handle their own back button
    return currentStep > 2 || currentStep === 2 || currentStep === 3
  }

  const handleBack = () => {
    console.log("[v0] handleBack called, currentStep:", currentStep, "showDetailsScreen:", showDetailsScreen)

    if (showDetailsScreen) {
      setShowDetailsScreen(false)
      setCurrentStep(3)
      return
    }

    if (currentStep === 4) {
      // Product grid
      setShowDetailsScreen(true)
      setCurrentStep(3)
      return
    }

    if (currentStep >= 5 && currentStep < products.length + 5) {
      const selectedProductsWithQuantities = getSelectedProductsWithQuantities()

      if (selectedProductsWithQuantities.length > 1) {
        // Find current product index in selected products
        const currentProductId = products[currentStep - 5].id
        const currentIndex = selectedProductsWithQuantities.findIndex((p) => p.id === currentProductId)

        if (currentIndex > 0) {
          // Go to previous selected product
          const prevProduct = selectedProductsWithQuantities[currentIndex - 1]
          const prevProductStep = products.findIndex((p) => p.id === prevProduct.id) + 5
          setCurrentStep(prevProductStep)
          setCurrentSelectedProductIndex(currentIndex - 1)
          return
        }
      }

      // If no previous selected product or only one selected, go back to product grid
      setCurrentStep(4)
      return
    }

    if (currentStep === products.length + 5) {
      const selectedProductsWithQuantities = getSelectedProductsWithQuantities()

      if (selectedProductsWithQuantities.length > 0) {
        // Go to the last selected product
        const lastSelectedProduct = selectedProductsWithQuantities[selectedProductsWithQuantities.length - 1]
        const lastProductStep = products.findIndex((p) => p.id === lastSelectedProduct.id) + 5
        setCurrentSelectedProductIndex(selectedProductsWithQuantities.length - 1)
        setCurrentStep(lastProductStep)
        return
      }

      // If no selected products, go back to product grid
      setCurrentStep(4)
      return
    }

    setCurrentStep(currentStep - 1)
  }

  const handleProductSelect = (productId: number, forceSelect = false) => {
    const product = products.find((p) => p.id === productId)
    if (product?.soldOut) return

    setSelectedProducts((prev) => {
      if (prev[productId] && !forceSelect) {
        const { [productId]: removed, ...rest } = prev
        return rest
      } else if (prev[productId] && forceSelect) {
        // Product is already selected and we're forcing selection - keep existing quantities
        return prev
      } else {
        // Product is not selected - create new entry with zero quantities
        return {
          ...prev,
          [productId]: {
            ...products.find((p) => p.id === productId)!,
            variantsSelected: products
              .find((p) => p.id === productId)!
              .variants.reduce(
                (acc, variant) => {
                  acc[variant.name] = 0
                  return acc
                },
                {} as Record<string, number>,
              ),
          },
        }
      }
    })
  }

  const quickPurchase = (productId: number, quantity: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product || product.soldOut) return

    // First ensure the product is selected
    if (!selectedProducts[productId]) {
      handleProductSelect(productId, true) // Use forceSelect to ensure selection
    }

    // Set quantity for all variants
    setSelectedProducts((prev) => {
      const updatedVariants: Record<string, number> = {}
      product.variants.forEach((variant) => {
        updatedVariants[variant.name] = quantity
      })

      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          variantsSelected: updatedVariants,
        },
      }
    })
  }

  // Function to update variant quantity, now correctly defined
  const updateVariantQuantity = (productId: number, variantName: string, quantity: number) => {
    setSelectedProducts((prev) => {
      const product = prev[productId]
      if (!product) return prev

      const newVariantsSelected = {
        ...product.variantsSelected,
        [variantName]: Math.max(0, quantity), // Ensure quantity is not negative
      }

      // If all quantities for this product become 0, remove the product
      const allZero = Object.values(newVariantsSelected).every((qty) => qty === 0)
      if (allZero) {
        const { [productId]: removed, ...rest } = prev
        return rest
      }

      return {
        ...prev,
        [productId]: {
          ...product,
          variantsSelected: newVariantsSelected,
        },
      }
    })
  }

  const calculateTotalPrice = () => {
    let total = 0
    Object.values(selectedProducts).forEach((product) => {
      const productData = products.find((p) => p.id === product.id)
      if (productData && productData.price) {
        const totalQuantity = Object.values(product.variantsSelected).reduce((sum, qty) => sum + qty, 0)
        total += productData.price * totalQuantity
      }
    })
    return total
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center overflow-hidden">
      {/* Toast */}
      {showToast && (
        <div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-lg text-white text-center px-4 py-2 rounded shadow z-50"
          style={{ backgroundColor: "#02a8e4" }}
        >
          {toastMessage}
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-4xl h-[670px] md:h-[670px] sm:h-[560px] relative flex flex-col overflow-hidden px-2.5">
        {/* Progress Bar with Restart Button */}
        {currentStep >= 1 && ( // Changed from currentStep === 0 || currentStep === 1
          <div className="step-dots mb-6 mt-4 relative flex justify-between flex-shrink-0">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-200 transform -translate-y-1/2 z-0"></div>
            <div
              className="step-progress absolute top-1/2 left-0 h-0.5 bg-red-600 transform -translate-y-1/2 z-10 transition-all duration-300"
              style={{ width: `${updateProgressBar()}%` }}
            ></div>
            {[0, 1, 2].map((step) => (
              <span
                key={step}
                className={`w-4 h-4 rounded-full z-20 ${
                  (currentStep === 1 && step === 0) ||
                  (currentStep >= 2 && currentStep < products.length + 4 && step === 1) ||
                  (currentStep === products.length + 4 && step === 2)
                    ? "bg-red-600"
                    : "bg-red-200"
                }`}
              />
            ))}

            {/* Restart Button */}
            <button
              onClick={handleRestart}
              className="absolute -top-2 -right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors z-30"
              title="Restart Survey"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        )}

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto">{renderStep()}</div>

        {/* Navigation Buttons */}
        {shouldShowNavButtons() && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mb-4">
            <div className="flex gap-2 md:gap-4">
              {shouldShowBackButton() && (
                <button
                  onClick={handleBack}
                  className="hover:bg-gray-300 flex-1 py-3 font-semibold bg-gray-200 text-black rounded-lg shadow"
                >
                  BACK
                </button>
              )}

              {shouldShowNextButton() && (
                <button
                  onClick={handleNext}
                  className="bg-[#02a8e4] hover:bg-[#0296d1] text-white flex-1 py-3 font-semibold shadow rounded-lg"
                >
                  NEXT
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 border-4 border-[#02a8e4] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-700 text-sm font-medium">Processing Order & Generating PDF…</p>
            </div>
          </div>
        )}
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative">
            <button
              onClick={handleCloseSuccessModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>

            <div className="text-center leading-3">
              <div className="mb-4">
                <span className="text-xl mr-2 text-black">☑︎</span>
                <span className="text-lg font-semibold text-gray-800">Success! Your order has been submitted.</span>
              </div>

              <div className="text-gray-600 mb-6 font-semibold">Ref #: {successOrderNumber}</div>

              <p className="text-gray-600 mb-6 leading-6 font-normal">
                For faster processing, please take a quick screenshot of this confirmation and share it with your
                Account Manager: <b>{accountManager}</b> via WhatsApp or Email.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Function to ensure bucket exists
const ensureBucketExists = async (supabase: any) => {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("❌ Error listing buckets:", listError)
      return false
    }

    const bucketExists = buckets?.some((bucket) => bucket.id === "invoices")

    if (!bucketExists) {
      console.log("📦 Creating invoices bucket...")
      const { data, error: createError } = await supabase.storage.createBucket("invoices", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "application/pdf",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      })

      if (createError) {
        console.error("❌ Error creating bucket:", createError)
        return false
      }

      console.log("✅ Bucket created successfully")
    }

    return true
  } catch (error) {
    console.error("❌ Error ensuring bucket exists:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Starting invoice creation...")

    const supabase = await createClient()

    const formData = await request.formData()
    const taxPermitFile = formData.get("taxPermitFile") as File | null
    const idFile = formData.get("idFile") as File | null
    const rawData = formData.get("data") as string

    console.log("📝 Form data received:", {
      hasTaxPermitFile: !!taxPermitFile,
      hasIdFile: !!idFile,
      hasRawData: !!rawData,
    })

    // Validate required data
    if (!rawData) {
      console.error("❌ Missing form data")
      return NextResponse.json({ error: "Missing form data" }, { status: 400 })
    }

    let data
    try {
      data = JSON.parse(rawData)
      console.log("✅ Data parsed successfully")
    } catch (error) {
      console.error("❌ JSON parse error:", error)
      return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 })
    }

    // Files are optional, only validate if provided
    if (taxPermitFile || idFile) {
      // Validate file sizes (max 10MB each) only if files are provided
      const maxSize = 10 * 1024 * 1024 // 10MB
      if ((taxPermitFile && taxPermitFile.size > maxSize) || (idFile && idFile.size > maxSize)) {
        console.error("❌ File size too large")
        return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 })
      }

      // Ensure bucket exists before uploading only if files are provided
      const bucketReady = await ensureBucketExists(supabase)
      if (!bucketReady) {
        console.error("❌ Storage bucket not ready")
        return NextResponse.json({ error: "Storage system not ready" }, { status: 500 })
      }
    }

    const uploadFile = async (file: File | null, folder: string) => {
      if (!file) return { path: null, url: null }

      try {
        console.log(`📤 Uploading ${file.name} to ${folder}...`)
        const arrayBuffer = await file.arrayBuffer()
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("invoices")
          .upload(`${folder}/${fileName}`, arrayBuffer, {
            contentType: file.type,
            upsert: true,
          })

        if (uploadError) {
          console.error(`❌ Upload failed for ${file.name}:`, uploadError.message)
          throw new Error(`Upload failed: ${uploadError.message}`)
        }

        const { data: urlData } = supabase.storage.from("invoices").getPublicUrl(`${folder}/${fileName}`)
        console.log(`✅ File uploaded successfully: ${fileName}`)

        return { path: uploadData.path, url: urlData.publicUrl }
      } catch (error) {
        console.error(`❌ Error uploading ${file.name}:`, error)
        throw error
      }
    }

    let taxPermit = { path: null, url: null }
    let idDocument = { path: null, url: null }

    if (taxPermitFile || idFile) {
      console.log("📤 Starting file uploads...")
      taxPermit = await uploadFile(taxPermitFile, "tax-permits")
      idDocument = await uploadFile(idFile, "id-documents")
    }

    console.log("🔢 Getting next order number...")
    const { data: maxOrder, error: maxError } = await supabase
      .from("invoices")
      .select("order_number")
      .order("order_number", { ascending: false })
      .limit(1)
      .single()

    if (maxError && maxError.code !== "PGRST116") {
      console.error("❌ Error fetching max order number:", maxError)
      return NextResponse.json({ error: "Database error fetching order number" }, { status: 500 })
    }

    const nextOrderNumber = (maxOrder?.order_number || 0) + 1
    console.log(`📊 Next order number: ${nextOrderNumber}`)

    const requiredFields = ["accountManager", "customerName", "businessName", "customerCellPhone", "customerEmail"]
    const missingFields = requiredFields.filter((field) => !data[field])

    if (missingFields.length > 0) {
      console.error("❌ Missing required fields:", missingFields)
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      )
    }

    const insertData = {
      order_number: nextOrderNumber,
      is_7oh_legal: data.thcALegal ? "Yes" : "No",
      customer_status: data.customerStatus || "New Customer",
      customer_type: data.customerType || "",

      account_manager: data.accountManager,
      customer_name: data.customerName,
      customer_cell_phone: data.customerCellPhone,
      business_name: data.businessName,
      customer_email: data.customerEmail,

      // Optional file URLs
      tax_permit_file_url: taxPermit.url,
      id_file_url: idDocument.url,

      // Product data
      selected_products: data.selectedProducts || {},
    }

    console.log("💾 Inserting data into database...")
    console.log("Insert data preview:", {
      order_number: insertData.order_number,
      customer_name: insertData.customer_name,
      business_name: insertData.business_name,
      customer_status: insertData.customer_status,
      is_7oh_legal: insertData.is_7oh_legal,
      customer_email: insertData.customer_email,
    })

    // Insert data into database
    const { data: insertedData, error: insertError } = await supabase
      .from("invoices")
      .insert([insertData])
      .select("id, order_number")

    if (insertError) {
      console.error("❌ Database insert error:", insertError)
      return NextResponse.json(
        {
          error: `Database error: ${insertError.message}`,
          details: insertError.details,
          hint: insertError.hint,
        },
        { status: 500 },
      )
    }

    console.log("✅ Invoice created successfully:", insertedData[0])
    return NextResponse.json(insertedData[0], { status: 200 })
  } catch (err: any) {
    console.error("❌ Unexpected error in invoice creation:", err)
    return NextResponse.json(
      {
        error: err.message || "Internal server error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    console.log("📋 Fetching all invoices...")

    const supabase = await createClient()

    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Error fetching invoices:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`✅ Fetched ${invoices?.length || 0} invoices`)
    return NextResponse.json(invoices || [])
  } catch (error: any) {
    console.error("❌ GET invoices error:", error)
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
      },
      { status: 500 },
    )
  }
}

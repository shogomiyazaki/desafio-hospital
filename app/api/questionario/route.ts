import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("Request body:", JSON.stringify(body, null, 2))
    console.log("API URL:", process.env.NEXT_PUBLIC_API_BASE_URL)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/questionario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    console.log("API Response status:", response.status)
    console.log("API Response data:", JSON.stringify(data, null, 2))

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Questionario creation error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Error details:", errorMessage)
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create questionário",
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}

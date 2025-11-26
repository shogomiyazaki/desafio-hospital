import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/health`, {
      method: "GET",
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        error: "Failed to check API health",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

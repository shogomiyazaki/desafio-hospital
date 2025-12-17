import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL
    
    if (!apiUrl) {
      return NextResponse.json(
        {
          status: "warning",
          message: "API_BASE_URL não configurada",
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      )
    }
    
    const response = await fetch(`${apiUrl}/health`, {
      method: "GET",
      cache: 'no-store',
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        error: "Failed to check API health",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

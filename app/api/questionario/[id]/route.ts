import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          error: "ID is required",
        },
        { status: 400 }
      )
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/questionario/${id}`, {
      method: "GET",
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Questionario fetch error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch questionário",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

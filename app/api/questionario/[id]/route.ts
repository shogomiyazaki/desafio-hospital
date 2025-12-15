import { NextRequest, NextResponse } from "next/server"

// Força a rota a ser dinâmica (não pré-renderizada)
export const dynamic = 'force-dynamic'

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

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL
    
    if (!apiUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "API_BASE_URL não configurada",
        },
        { status: 500 }
      )
    }

    const response = await fetch(`${apiUrl}/api/questionario/${id}`, {
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

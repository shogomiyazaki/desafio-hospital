import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      return response
    } catch (error) {
      console.log(`Tentativa ${i + 1} falhou:`, error)
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  throw new Error('Todas as tentativas falharam')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL
    
    console.log("Request body:", JSON.stringify(body, null, 2))
    console.log("API URL:", apiUrl)

    if (!apiUrl) {
      console.error("API_BASE_URL não configurada!")
      return NextResponse.json(
        {
          success: false,
          error: "Configuração de API não encontrada",
          message: "A variável de ambiente API_BASE_URL não está configurada. Configure NEXT_PUBLIC_API_BASE_URL ou API_BASE_URL no painel de deploy.",
        },
        { status: 500 }
      )
    }

    const response = await fetchWithRetry(`${apiUrl}/api/questionario`, {
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

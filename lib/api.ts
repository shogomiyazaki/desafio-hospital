export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}


export async function apiGet<T = any>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Erro na requisição")
    }

    return data as ApiResponse<T>
  } catch (error) {
    console.error(`GET ${endpoint} error:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    }
  }
}

export async function apiPost<T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(`POST ${endpoint} error response:`, data)
      return {
        success: false,
        error: data.error || data.message || "Erro na requisição",
      }
    }

    return data as ApiResponse<T>
  } catch (error) {
    console.error(`POST ${endpoint} error:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    }
  }
}

export async function checkApiHealth() {
  return apiGet("/health")
}

export async function submitQuestionario(data: any) {
  console.log("submitQuestionario: enviando dados", data)
  const result = apiPost("/questionario", data)
  console.log("submitQuestionario: resultado promise", result)
  return result
}

export async function getQuestionario(id: string) {
  return apiGet(`/questionario/${id}`)
}

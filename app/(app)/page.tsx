import { HospitalOptimizationForm } from "../components/hospital-optimization-form"
import { Activity } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-balance">Otimização Hospitalar</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Modelagem matemática para equilibrar capacidade e demanda no sistema de saúde
          </p>
        </header>

        <HospitalOptimizationForm />
      </div>
    </main>
  )
}

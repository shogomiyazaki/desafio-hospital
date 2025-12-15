import { HospitalOptimizationForm } from "../components/hospital-optimization-form"
import { Activity, BarChart3, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"

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

        {/* Link para Dashboard Power BI */}
        <Card className="mb-8 border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Dashboard de Resultados
            </CardTitle>
            <CardDescription>
              Após enviar o questionário, acesse o dashboard para visualizar a análise dos dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="gap-2">
              <a 
                href="https://app.powerbi.com/groups/me/reports/92edc7ce-52d8-4b83-a178-207e40cb5fe7?ctid=4de3a1ea-fae4-4f85-9657-9a9905d85269&pbi_source=linkShare" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <BarChart3 className="w-4 h-4" />
                Abrir Dashboard Power BI
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <HospitalOptimizationForm />
      </div>
    </main>
  )
}

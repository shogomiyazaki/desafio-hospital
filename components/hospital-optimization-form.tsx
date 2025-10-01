"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, FileText, TrendingUp } from "lucide-react"
import { ResultsDashboard } from "@/components/results-dashboard"
import { calculateIndicators, type HospitalData, type CalculationResults } from "@/lib/hospital-calculations"

export function HospitalOptimizationForm() {
  const [activeTab, setActiveTab] = useState("input")
  const [results, setResults] = useState<CalculationResults | null>(null)

  const [formData, setFormData] = useState<HospitalData>({
    // Pronto-Socorro
    taxaEntradaPS: 0,
    taxaEntradaAmbulancia: 0,
    taxaConversaoInternacao: 0,

    // Observação
    leitosObservacao: 0,
    tmpObservacao: 0,

    // Internações Clínicas (PS)
    internacoesClinicasPS: 0,
    tmpEnfermariaClinicaPS: 0,

    // Internações Cirúrgicas (PS)
    internacoesCirurgicasPS: 0,
    tmpEnfermariaCirurgicaPS: 0,

    // UTI (PS)
    internacoesUTIPS: 0,
    tmpUTIPS: 0,

    // Bloco Cirúrgico
    salasCirurgicasEletivas: 0,
    salasCirurgicasUrgencia: 0,

    // RPA
    unidadesRPA: 0,
    tmpRPA: 0,

    // Eletivas
    internacoesClinicasEletivas: 0,
    internacoesCirurgicasEletivas: 0,
    tmpClinicaEletiva: 0,
    tmpCirurgicaEletiva: 0,

    // Financeiro e Tempo
    ticketMedioPS: 0,
    losSemInternacao: 0,
    losComInternacao: 0,
  })

  const handleInputChange = (field: keyof HospitalData, value: string) => {
    setFormData((prev: HospitalData) => ({
      ...prev,
      [field]: Number.parseFloat(value) || 0,
    }))
  }

  const handleCalculate = () => {
    const calculatedResults = calculateIndicators(formData)
    setResults(calculatedResults)
    setActiveTab("results")
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
        <TabsTrigger value="input" className="gap-2">
          <FileText className="w-4 h-4" />
          Entrada de Dados
        </TabsTrigger>
        <TabsTrigger value="results" className="gap-2" disabled={!results}>
          <TrendingUp className="w-4 h-4" />
          Resultados
        </TabsTrigger>
      </TabsList>

      <TabsContent value="input" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Pronto-Socorro e Ambulância
            </CardTitle>
            <CardDescription>Dados de entrada e fluxo de pacientes</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="taxaEntradaPS">Taxa diária de entradas no PS</Label>
              <Input
                id="taxaEntradaPS"
                type="number"
                step="0.01"
                value={formData.taxaEntradaPS || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("taxaEntradaPS", e.target.value)}
                placeholder="Ex: 150"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxaEntradaAmbulancia">Taxa diária de entradas via Ambulância</Label>
              <Input
                id="taxaEntradaAmbulancia"
                type="number"
                step="0.01"
                value={formData.taxaEntradaAmbulancia || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("taxaEntradaAmbulancia", e.target.value)}
                placeholder="Ex: 30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxaConversaoInternacao">Taxa de conversão de internações (%)</Label>
              <Input
                id="taxaConversaoInternacao"
                type="number"
                step="0.01"
                value={formData.taxaConversaoInternacao || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("taxaConversaoInternacao", e.target.value)}
                placeholder="Ex: 25"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Observação</CardTitle>
            <CardDescription>Capacidade e tempo médio de permanência</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="leitosObservacao">Total de leitos de Observação</Label>
              <Input
                id="leitosObservacao"
                type="number"
                value={formData.leitosObservacao || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("leitosObservacao", e.target.value)}
                placeholder="Ex: 20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tmpObservacao">Tempo médio de permanência (dias)</Label>
              <Input
                id="tmpObservacao"
                type="number"
                step="0.01"
                value={formData.tmpObservacao || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("tmpObservacao", e.target.value)}
                placeholder="Ex: 1.5"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Internações Clínicas (Origem: PS)</CardTitle>
            <CardDescription>Volume e tempo de permanência na enfermaria clínica</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="internacoesClinicasPS">Internações clínicas por dia</Label>
              <Input
                id="internacoesClinicasPS"
                type="number"
                step="0.01"
                value={formData.internacoesClinicasPS || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("internacoesClinicasPS", e.target.value)}
                placeholder="Ex: 15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tmpEnfermariaClinicaPS">Tempo médio de permanência (dias)</Label>
              <Input
                id="tmpEnfermariaClinicaPS"
                type="number"
                step="0.01"
                value={formData.tmpEnfermariaClinicaPS || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("tmpEnfermariaClinicaPS", e.target.value)}
                placeholder="Ex: 5"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Internações Cirúrgicas (Origem: PS)</CardTitle>
            <CardDescription>Volume e tempo de permanência na enfermaria cirúrgica</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="internacoesCirurgicasPS">Internações cirúrgicas por dia</Label>
              <Input
                id="internacoesCirurgicasPS"
                type="number"
                step="0.01"
                value={formData.internacoesCirurgicasPS || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("internacoesCirurgicasPS", e.target.value)}
                placeholder="Ex: 8"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tmpEnfermariaCirurgicaPS">Tempo médio de permanência (dias)</Label>
              <Input
                id="tmpEnfermariaCirurgicaPS"
                type="number"
                step="0.01"
                value={formData.tmpEnfermariaCirurgicaPS || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("tmpEnfermariaCirurgicaPS", e.target.value)}
                placeholder="Ex: 4"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>UTI (Origem: PS)</CardTitle>
            <CardDescription>Volume e tempo de permanência na UTI</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="internacoesUTIPS">Internações em UTI por dia</Label>
              <Input
                id="internacoesUTIPS"
                type="number"
                step="0.01"
                value={formData.internacoesUTIPS || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("internacoesUTIPS", e.target.value)}
                placeholder="Ex: 3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tmpUTIPS">Tempo médio de permanência (dias)</Label>
              <Input
                id="tmpUTIPS"
                type="number"
                step="0.01"
                value={formData.tmpUTIPS || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("tmpUTIPS", e.target.value)}
                placeholder="Ex: 7"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bloco Cirúrgico</CardTitle>
            <CardDescription>Salas cirúrgicas disponíveis</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="salasCirurgicasEletivas">Salas para procedimentos eletivos</Label>
              <Input
                id="salasCirurgicasEletivas"
                type="number"
                value={formData.salasCirurgicasEletivas || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("salasCirurgicasEletivas", e.target.value)}
                placeholder="Ex: 4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salasCirurgicasUrgencia">Salas para urgência</Label>
              <Input
                id="salasCirurgicasUrgencia"
                type="number"
                value={formData.salasCirurgicasUrgencia || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("salasCirurgicasUrgencia", e.target.value)}
                placeholder="Ex: 2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RPA (Recuperação Pós-Anestésica)</CardTitle>
            <CardDescription>Unidades e tempo médio de permanência</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="unidadesRPA">Total de unidades de RPA</Label>
              <Input
                id="unidadesRPA"
                type="number"
                value={formData.unidadesRPA || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("unidadesRPA", e.target.value)}
                placeholder="Ex: 6"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tmpRPA">Tempo médio de permanência (horas)</Label>
              <Input
                id="tmpRPA"
                type="number"
                step="0.01"
                value={formData.tmpRPA || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("tmpRPA", e.target.value)}
                placeholder="Ex: 2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Internações Eletivas</CardTitle>
            <CardDescription>Volume e tempo de permanência de procedimentos eletivos</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="internacoesClinicasEletivas">Internações clínicas eletivas</Label>
              <Input
                id="internacoesClinicasEletivas"
                type="number"
                step="0.01"
                value={formData.internacoesClinicasEletivas || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("internacoesClinicasEletivas", e.target.value)}
                placeholder="Ex: 10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internacoesCirurgicasEletivas">Internações cirúrgicas eletivas</Label>
              <Input
                id="internacoesCirurgicasEletivas"
                type="number"
                step="0.01"
                value={formData.internacoesCirurgicasEletivas || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("internacoesCirurgicasEletivas", e.target.value)}
                placeholder="Ex: 12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tmpClinicaEletiva">TMP clínica eletiva (dias)</Label>
              <Input
                id="tmpClinicaEletiva"
                type="number"
                step="0.01"
                value={formData.tmpClinicaEletiva || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("tmpClinicaEletiva", e.target.value)}
                placeholder="Ex: 3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tmpCirurgicaEletiva">TMP cirúrgica eletiva (dias)</Label>
              <Input
                id="tmpCirurgicaEletiva"
                type="number"
                step="0.01"
                value={formData.tmpCirurgicaEletiva || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("tmpCirurgicaEletiva", e.target.value)}
                placeholder="Ex: 2.5"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados Financeiros e Tempo de Passagem</CardTitle>
            <CardDescription>Informações complementares para análise</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ticketMedioPS">Ticket médio PS (R$)</Label>
              <Input
                id="ticketMedioPS"
                type="number"
                step="0.01"
                value={formData.ticketMedioPS || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("ticketMedioPS", e.target.value)}
                placeholder="Ex: 500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="losSemInternacao">LOS sem internação (horas)</Label>
              <Input
                id="losSemInternacao"
                type="number"
                step="0.01"
                value={formData.losSemInternacao || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("losSemInternacao", e.target.value)}
                placeholder="Ex: 4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="losComInternacao">LOS com internação (horas)</Label>
              <Input
                id="losComInternacao"
                type="number"
                step="0.01"
                value={formData.losComInternacao || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("losComInternacao", e.target.value)}
                placeholder="Ex: 8"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
          <Button size="lg" onClick={handleCalculate} className="gap-2">
            <Calculator className="w-5 h-5" />
            Calcular Indicadores
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="results">{results && <ResultsDashboard results={results} formData={formData} />}</TabsContent>
    </Tabs>
  )
}

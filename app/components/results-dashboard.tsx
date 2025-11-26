"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { AlertCircle, CheckCircle2, TrendingUp, Bed, Clock, Activity } from "lucide-react"
import type { CalculationResults, HospitalData } from "@/lib/hospital-calculations"

interface ResultsDashboardProps {
  results: CalculationResults
  formData: HospitalData
}

export function ResultsDashboard({ results, formData }: ResultsDashboardProps) {
  const getUtilizationStatus = (utilization: number) => {
    if (utilization > 100) return { color: "destructive", icon: AlertCircle, label: "Sobrecarga" }
    if (utilization > 85) return { color: "default", icon: CheckCircle2, label: "Adequado" }
    return { color: "secondary", icon: TrendingUp, label: "Subutilizado" }
  }

  const formatPercent = (value: number) => `${value.toFixed(1)}%`
  const formatNumber = (value: number) => value.toFixed(2)

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Resumo Executivo
          </CardTitle>
          <CardDescription>Visão geral dos indicadores de performance do sistema hospitalar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Enfermaria Clínica</p>
              <p className="text-2xl font-bold">{formatPercent(results.fatorUtilizacaoEnfermariaClinica)}</p>
              <Badge variant={getUtilizationStatus(results.fatorUtilizacaoEnfermariaClinica).color as any}>
                {getUtilizationStatus(results.fatorUtilizacaoEnfermariaClinica).label}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Enfermaria Cirúrgica</p>
              <p className="text-2xl font-bold">{formatPercent(results.fatorUtilizacaoEnfermariaCirurgica)}</p>
              <Badge variant={getUtilizationStatus(results.fatorUtilizacaoEnfermariaCirurgica).color as any}>
                {getUtilizationStatus(results.fatorUtilizacaoEnfermariaCirurgica).label}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">UTI</p>
              <p className="text-2xl font-bold">{formatPercent(results.fatorUtilizacaoUTI)}</p>
              <Badge variant={getUtilizationStatus(results.fatorUtilizacaoUTI).color as any}>
                {getUtilizationStatus(results.fatorUtilizacaoUTI).label}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Fatores de Utilização
            </CardTitle>
            <CardDescription>Percentual de ocupação dos setores hospitalares</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Enfermaria Clínica</span>
                <span className="text-sm font-bold">{formatPercent(results.fatorUtilizacaoEnfermariaClinica)}</span>
              </div>
              <Progress value={Math.min(results.fatorUtilizacaoEnfermariaClinica, 100)} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Enfermaria Cirúrgica</span>
                <span className="text-sm font-bold">{formatPercent(results.fatorUtilizacaoEnfermariaCirurgica)}</span>
              </div>
              <Progress value={Math.min(results.fatorUtilizacaoEnfermariaCirurgica, 100)} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">UTI</span>
                <span className="text-sm font-bold">{formatPercent(results.fatorUtilizacaoUTI)}</span>
              </div>
              <Progress value={Math.min(results.fatorUtilizacaoUTI, 100)} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bloco Cirúrgico</span>
                <span className="text-sm font-bold">{formatPercent(results.fatorUtilizacaoBlocoCirurgico)}</span>
              </div>
              <Progress value={Math.min(results.fatorUtilizacaoBlocoCirurgico, 100)} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">RPA</span>
                <span className="text-sm font-bold">{formatPercent(results.fatorUtilizacaoRPA)}</span>
              </div>
              <Progress value={Math.min(results.fatorUtilizacaoRPA, 100)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed className="w-5 h-5" />
              Capacidade e Leitos
            </CardTitle>
            <CardDescription>Análise de leitos necessários vs. capacidade atual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">Enfermaria Clínica</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Capacidade Estimada</span>
                <span className="text-sm font-bold">{results.capacidadeAtualClinica} leitos</span>
              </div>
              {results.fatorUtilizacaoEnfermariaClinica > 100 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Leitos Necessários</span>
                  <span className="text-sm font-bold text-destructive">{results.leitosNecessariosClinica} leitos</span>
                </div>
              )}
            </div>

            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">Enfermaria Cirúrgica</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Capacidade Estimada</span>
                <span className="text-sm font-bold">{results.capacidadeAtualCirurgica} leitos</span>
              </div>
              {results.fatorUtilizacaoEnfermariaCirurgica > 100 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Leitos Necessários</span>
                  <span className="text-sm font-bold text-destructive">
                    {results.leitosNecessariosCirurgica} leitos
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">UTI</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Capacidade Estimada</span>
                <span className="text-sm font-bold">{results.capacidadeAtualUTI} leitos</span>
              </div>
              {results.fatorUtilizacaoUTI > 100 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Leitos Necessários</span>
                  <span className="text-sm font-bold text-destructive">{results.leitosNecessariosUTI} leitos</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Tempo Médio de Permanência (TMP)
          </CardTitle>
          <CardDescription>Comparação entre TMP atual e TMP ideal para 85% de ocupação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">Enfermaria Clínica</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">TMP Atual (PS)</span>
                  <span className="text-sm">{formatNumber(formData.tmpEnfermariaClinicaPS)} dias</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">TMP Ideal</span>
                  <span className="text-sm font-bold text-primary">{formatNumber(results.tmpIdealClinica)} dias</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">Enfermaria Cirúrgica</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">TMP Atual (PS)</span>
                  <span className="text-sm">{formatNumber(formData.tmpEnfermariaCirurgicaPS)} dias</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">TMP Ideal</span>
                  <span className="text-sm font-bold text-primary">{formatNumber(results.tmpIdealCirurgica)} dias</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">UTI</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">TMP Atual</span>
                  <span className="text-sm">{formatNumber(formData.tmpUTIPS)} dias</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">TMP Ideal</span>
                  <span className="text-sm font-bold text-primary">{formatNumber(results.tmpIdealUTI)} dias</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Giro de Leitos
          </CardTitle>
          <CardDescription>Eficiência de utilização dos leitos hospitalares</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">Enfermaria Clínica</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Giro Atual</span>
                  <span className="text-sm">{formatNumber(results.giroLeitosClinicaAtual)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Giro Necessário</span>
                  <span className="text-sm font-bold text-primary">
                    {formatNumber(results.giroLeitosClinicaNecessario)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">Enfermaria Cirúrgica</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Giro Atual</span>
                  <span className="text-sm">{formatNumber(results.giroLeitosCirurgicaAtual)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Giro Necessário</span>
                  <span className="text-sm font-bold text-primary">
                    {formatNumber(results.giroLeitosCirurgicaNecessario)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">UTI</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Giro Atual</span>
                  <span className="text-sm">{formatNumber(results.giroLeitosUTIAtual)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Giro Necessário</span>
                  <span className="text-sm font-bold text-primary">
                    {formatNumber(results.giroLeitosUTINecessario)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

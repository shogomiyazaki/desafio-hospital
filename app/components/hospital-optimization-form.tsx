"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Send, Save, Hospital, Mail, MapPin } from "lucide-react"
import { submitQuestionario } from "@/lib/api"

interface QuestionarioData {
  // Dados do Preenchedor e Hospital
  preenchedor_email: string
  hospital_nome: string
  hospital_cep: string
  
  // Pronto-Socorro
  taxa_diaria_entradas_ps: number
  taxa_diaria_entradas_ambulancia: number
  
  // Capacidade de Leitos
  capacidade_leitos_uti: number
  capacidade_leitos_clinicos: number
  capacidade_leitos_cirurgicos: number
  
  // Internações
  internacoes_clinicas_dia: number
  tempo_medio_permanencia_internado_dia: number
  internacoes_uti_dia: number
  tempo_medio_permanencia_uti_dias: number
  internacoes_cirurgicas_eletivas: number
  tmp_cirurgica_eletiva_dias: number
  
  // Bloco Cirúrgico
  salas_procedimentos_eletivos: number
  total_unidades_rpa: number
  tempo_medio_permanencia_rpa_horas: number
  
  // LOS (Length of Stay)
  los_sem_internacao_horas: number
  los_com_internacao_horas: number
  tempo_consultorio_saida: number
  quantidade_pacientes_sem_internacao: number
  tempo_consultorio_internacao: number
  quantidade_pacientes_com_internacao: number
  
  // Exames
  media_raio_x: number
  media_laboratorial: number
  media_ultrassonografia: number
  media_tomografia: number
  media_outros_exames: number
  media_sem_exames: number
  
  // Classificação de Risco
  media_emergencia: number
  media_muito_urgente: number
  media_urgente: number
  media_pouco_urgente: number
  media_nao_urgente: number
  
  // Funcionários
  media_func_enfermagem: number
  media_func_apoio_terceirizados: number
  media_func_medicos_corpo_clinico: number
  media_func_administrativo: number
  media_func_multidisciplinar: number
  media_func_tecnicos_sadt: number
  
  // Médicos
  media_medico_diretor_tecnico_ps: number
  media_medico_clinico_emergencista: number
  media_medico_pediatra: number
  media_medico_ortopedista: number
  media_medico_intensivista: number
  media_medico_cirurgiao_geral: number
  media_medico_anestesista: number
  media_medico_hospitalista_rotina: number
  
  // Enfermeiros
  media_enf_gerente: number
  media_enf_supervisor_plantao: number
  media_enf_coord: number
  media_enf_assistencial: number
  media_enf_tecnico: number
  
  // Dados Horários - Pacientes
  media_pacientes_h00: number
  media_pacientes_h01: number
  media_pacientes_h02: number
  media_pacientes_h03: number
  media_pacientes_h04: number
  media_pacientes_h05: number
  media_pacientes_h06: number
  media_pacientes_h07: number
  media_pacientes_h08: number
  media_pacientes_h09: number
  media_pacientes_h10: number
  media_pacientes_h11: number
  media_pacientes_h12: number
  media_pacientes_h13: number
  media_pacientes_h14: number
  media_pacientes_h15: number
  media_pacientes_h16: number
  media_pacientes_h17: number
  media_pacientes_h18: number
  media_pacientes_h19: number
  media_pacientes_h20: number
  media_pacientes_h21: number
  media_pacientes_h22: number
  media_pacientes_h23: number
  
  // Dados Horários - Staff Triagem
  media_staff_triagem_h00: number
  media_staff_triagem_h01: number
  media_staff_triagem_h02: number
  media_staff_triagem_h03: number
  media_staff_triagem_h04: number
  media_staff_triagem_h05: number
  media_staff_triagem_h06: number
  media_staff_triagem_h07: number
  media_staff_triagem_h08: number
  media_staff_triagem_h09: number
  media_staff_triagem_h10: number
  media_staff_triagem_h11: number
  media_staff_triagem_h12: number
  media_staff_triagem_h13: number
  media_staff_triagem_h14: number
  media_staff_triagem_h15: number
  media_staff_triagem_h16: number
  media_staff_triagem_h17: number
  media_staff_triagem_h18: number
  media_staff_triagem_h19: number
  media_staff_triagem_h20: number
  media_staff_triagem_h21: number
  media_staff_triagem_h22: number
  media_staff_triagem_h23: number
  
  // Dados Horários - Staff Consultório
  media_staff_consultorio_h00: number
  media_staff_consultorio_h01: number
  media_staff_consultorio_h02: number
  media_staff_consultorio_h03: number
  media_staff_consultorio_h04: number
  media_staff_consultorio_h05: number
  media_staff_consultorio_h06: number
  media_staff_consultorio_h07: number
  media_staff_consultorio_h08: number
  media_staff_consultorio_h09: number
  media_staff_consultorio_h10: number
  media_staff_consultorio_h11: number
  media_staff_consultorio_h12: number
  media_staff_consultorio_h13: number
  media_staff_consultorio_h14: number
  media_staff_consultorio_h15: number
  media_staff_consultorio_h16: number
  media_staff_consultorio_h17: number
  media_staff_consultorio_h18: number
  media_staff_consultorio_h19: number
  media_staff_consultorio_h20: number
  media_staff_consultorio_h21: number
  media_staff_consultorio_h22: number
  media_staff_consultorio_h23: number
}

const initialFormData: QuestionarioData = {
  // Dados do Preenchedor e Hospital
  preenchedor_email: "",
  hospital_nome: "",
  hospital_cep: "",
  
  // Pronto-Socorro
  taxa_diaria_entradas_ps: 0,
  taxa_diaria_entradas_ambulancia: 0,
  
  // Capacidade de Leitos
  capacidade_leitos_uti: 0,
  capacidade_leitos_clinicos: 0,
  capacidade_leitos_cirurgicos: 0,
  
  // Internações
  internacoes_clinicas_dia: 0,
  tempo_medio_permanencia_internado_dia: 0,
  internacoes_uti_dia: 0,
  tempo_medio_permanencia_uti_dias: 0,
  internacoes_cirurgicas_eletivas: 0,
  tmp_cirurgica_eletiva_dias: 0,
  
  // Bloco Cirúrgico
  salas_procedimentos_eletivos: 0,
  total_unidades_rpa: 0,
  tempo_medio_permanencia_rpa_horas: 0,
  
  // LOS (Length of Stay)
  los_sem_internacao_horas: 0,
  los_com_internacao_horas: 0,
  tempo_consultorio_saida: 0,
  quantidade_pacientes_sem_internacao: 0,
  tempo_consultorio_internacao: 0,
  quantidade_pacientes_com_internacao: 0,
  
  // Exames
  media_raio_x: 0,
  media_laboratorial: 0,
  media_ultrassonografia: 0,
  media_tomografia: 0,
  media_outros_exames: 0,
  media_sem_exames: 0,
  
  // Classificação de Risco
  media_emergencia: 0,
  media_muito_urgente: 0,
  media_urgente: 0,
  media_pouco_urgente: 0,
  media_nao_urgente: 0,
  
  // Funcionários
  media_func_enfermagem: 0,
  media_func_apoio_terceirizados: 0,
  media_func_medicos_corpo_clinico: 0,
  media_func_administrativo: 0,
  media_func_multidisciplinar: 0,
  media_func_tecnicos_sadt: 0,
  
  // Médicos
  media_medico_diretor_tecnico_ps: 0,
  media_medico_clinico_emergencista: 0,
  media_medico_pediatra: 0,
  media_medico_ortopedista: 0,
  media_medico_intensivista: 0,
  media_medico_cirurgiao_geral: 0,
  media_medico_anestesista: 0,
  media_medico_hospitalista_rotina: 0,
  
  // Enfermeiros
  media_enf_gerente: 0,
  media_enf_supervisor_plantao: 0,
  media_enf_coord: 0,
  media_enf_assistencial: 0,
  media_enf_tecnico: 0,
  
  // Dados Horários - Pacientes
  media_pacientes_h00: 0,
  media_pacientes_h01: 0,
  media_pacientes_h02: 0,
  media_pacientes_h03: 0,
  media_pacientes_h04: 0,
  media_pacientes_h05: 0,
  media_pacientes_h06: 0,
  media_pacientes_h07: 0,
  media_pacientes_h08: 0,
  media_pacientes_h09: 0,
  media_pacientes_h10: 0,
  media_pacientes_h11: 0,
  media_pacientes_h12: 0,
  media_pacientes_h13: 0,
  media_pacientes_h14: 0,
  media_pacientes_h15: 0,
  media_pacientes_h16: 0,
  media_pacientes_h17: 0,
  media_pacientes_h18: 0,
  media_pacientes_h19: 0,
  media_pacientes_h20: 0,
  media_pacientes_h21: 0,
  media_pacientes_h22: 0,
  media_pacientes_h23: 0,
  
  // Dados Horários - Staff Triagem
  media_staff_triagem_h00: 0,
  media_staff_triagem_h01: 0,
  media_staff_triagem_h02: 0,
  media_staff_triagem_h03: 0,
  media_staff_triagem_h04: 0,
  media_staff_triagem_h05: 0,
  media_staff_triagem_h06: 0,
  media_staff_triagem_h07: 0,
  media_staff_triagem_h08: 0,
  media_staff_triagem_h09: 0,
  media_staff_triagem_h10: 0,
  media_staff_triagem_h11: 0,
  media_staff_triagem_h12: 0,
  media_staff_triagem_h13: 0,
  media_staff_triagem_h14: 0,
  media_staff_triagem_h15: 0,
  media_staff_triagem_h16: 0,
  media_staff_triagem_h17: 0,
  media_staff_triagem_h18: 0,
  media_staff_triagem_h19: 0,
  media_staff_triagem_h20: 0,
  media_staff_triagem_h21: 0,
  media_staff_triagem_h22: 0,
  media_staff_triagem_h23: 0,
  media_staff_consultorio_h00: 0,
  media_staff_consultorio_h01: 0,
  media_staff_consultorio_h02: 0,
  media_staff_consultorio_h03: 0,
  media_staff_consultorio_h04: 0,
  media_staff_consultorio_h05: 0,
  media_staff_consultorio_h06: 0,
  media_staff_consultorio_h07: 0,
  media_staff_consultorio_h08: 0,
  media_staff_consultorio_h09: 0,
  media_staff_consultorio_h10: 0,
  media_staff_consultorio_h11: 0,
  media_staff_consultorio_h12: 0,
  media_staff_consultorio_h13: 0,
  media_staff_consultorio_h14: 0,
  media_staff_consultorio_h15: 0,
  media_staff_consultorio_h16: 0,
  media_staff_consultorio_h17: 0,
  media_staff_consultorio_h18: 0,
  media_staff_consultorio_h19: 0,
  media_staff_consultorio_h20: 0,
  media_staff_consultorio_h21: 0,
  media_staff_consultorio_h22: 0,
  media_staff_consultorio_h23: 0,
}

export function HospitalOptimizationForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState<QuestionarioData>(initialFormData)
  const [skipAutoSave, setSkipAutoSave] = useState(false)

  // Carregar dados salvos do localStorage ao montar o componente
  useEffect(() => {
    const savedEmail = localStorage.getItem("hospital_form_email")
    if (savedEmail) {
      const savedData = localStorage.getItem(`hospital_form_${savedEmail}`)
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          setFormData(parsedData)
        } catch (err) {
          console.error("Erro ao carregar dados salvos:", err)
        }
      }
    }
  }, [])

  // Prevenir mudança de valor em inputs numéricos com scroll do mouse
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement
      if (target instanceof HTMLInputElement && target.type === 'number' && document.activeElement === target) {
        e.preventDefault()
        e.stopImmediatePropagation()
      }
    }

    // Adicionar listener no documento
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true })
    
    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true })
    }
  }, [])

  // Salvar dados automaticamente quando o email ou formData mudar
  useEffect(() => {
    // Não salvar se acabamos de fazer submit ou se não tem email
    if (skipAutoSave || !formData.preenchedor_email) {
      return
    }
    
    localStorage.setItem("hospital_form_email", formData.preenchedor_email)
    localStorage.setItem(`hospital_form_${formData.preenchedor_email}`, JSON.stringify(formData))
  }, [formData, skipAutoSave])

  const handleInputChange = (field: keyof QuestionarioData, value: string) => {
    setFormData((prev: QuestionarioData) => ({
      ...prev,
      [field]: field === "preenchedor_email" || field === "hospital_nome" || field === "hospital_cep" 
        ? value 
        : (Number.parseFloat(value) || 0),
    }))
  }

  const handleSaveDraft = () => {
    if (!formData.preenchedor_email) {
      setError("Por favor, informe seu email para salvar o rascunho")
      return
    }
    
    localStorage.setItem("hospital_form_email", formData.preenchedor_email)
    localStorage.setItem(`hospital_form_${formData.preenchedor_email}`, JSON.stringify(formData))
    
    setSaveMessage("Rascunho salvo com sucesso!")
    setTimeout(() => setSaveMessage(null), 3000)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccessMessage(null)

      console.log("Enviando questionário:", formData)
      
      const result = await submitQuestionario(formData)

      console.log("Resultado recebido:", result)

      if (!result.success) {
        const errorMsg = result.error || "Erro ao enviar dados"
        console.error("Erro na resposta:", errorMsg)
        setError(errorMsg)
        return
      }

      console.log("Questionário enviado com sucesso:", result.data)
      
      // Ativar flag para pular auto-save durante a limpeza
      setSkipAutoSave(true)
      
      // Limpar o formulário após envio bem-sucedido
      const emailToRemove = formData.preenchedor_email
      setFormData(initialFormData)
      
      // Limpar localStorage
      localStorage.removeItem("hospital_form_email")
      if (emailToRemove) {
        localStorage.removeItem(`hospital_form_${emailToRemove}`)
      }
      
      setSuccessMessage("Questionário enviado com sucesso!")
      
      // Desativar flag após um tempo para permitir novo preenchimento
      setTimeout(() => {
        setSkipAutoSave(false)
      }, 1000)
      
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao enviar dados"
      console.error("Exceção capturada:", errorMsg)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      {error && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {saveMessage && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-green-600 flex items-center gap-2">
              <Save className="w-4 h-4" />
              {saveMessage}
            </p>
          </CardContent>
        </Card>
      )}

      {successMessage && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-green-600 flex items-center gap-2">
              <Send className="w-4 h-4" />
              {successMessage}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Identificação do Preenchedor */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Identificação do Preenchedor
          </CardTitle>
            <CardDescription>
              Informe seu email para salvar automaticamente seu progresso e retomar o preenchimento mais tarde
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="preenchedor_email">Email do Preenchedor *</Label>
              <Input
                id="preenchedor_email"
                type="email"
                value={formData.preenchedor_email}
                onChange={(e) => handleInputChange("preenchedor_email", e.target.value)}
                placeholder="seu.email@hospital.com.br"
                required
              />
              <p className="text-sm text-muted-foreground">
                Seus dados serão salvos automaticamente conforme você preenche
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Hospital */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hospital className="w-5 h-5" />
              Informações do Hospital
            </CardTitle>
            <CardDescription>
              Dados básicos sobre a instituição de saúde
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hospital_nome">Nome do Hospital *</Label>
              <Input
                id="hospital_nome"
                type="text"
                value={formData.hospital_nome}
                onChange={(e) => handleInputChange("hospital_nome", e.target.value)}
                placeholder="Ex: Hospital Municipal São José"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hospital_cep">CEP *</Label>
              <Input
                id="hospital_cep"
                type="text"
                value={formData.hospital_cep}
                onChange={(e) => handleInputChange("hospital_cep", e.target.value)}
                placeholder="Ex: 01234-567"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pronto-Socorro e Ambulância</CardTitle>
            <CardDescription>
              Taxa média diária de pacientes atendidos no mês anterior
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="taxa_diaria_entradas_ps">Taxa diária de entradas no PS</Label>
              <Input
                id="taxa_diaria_entradas_ps"
                type="number"
                step="0.01"
                value={formData.taxa_diaria_entradas_ps || ""}
                onChange={(e) => handleInputChange("taxa_diaria_entradas_ps", e.target.value)}
                placeholder="Ex: 180"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxa_diaria_entradas_ambulancia">Taxa diária de entradas via Ambulância</Label>
              <Input
                id="taxa_diaria_entradas_ambulancia"
                type="number"
                step="0.01"
                value={formData.taxa_diaria_entradas_ambulancia || ""}
                onChange={(e) => handleInputChange("taxa_diaria_entradas_ambulancia", e.target.value)}
                placeholder="Ex: 22"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capacidade de Leitos</CardTitle>
            <CardDescription>
              Capacidade total de leitos disponíveis por tipo
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="capacidade_leitos_uti">Leitos UTI</Label>
              <Input
                id="capacidade_leitos_uti"
                type="number"
                value={formData.capacidade_leitos_uti || ""}
                onChange={(e) => handleInputChange("capacidade_leitos_uti", e.target.value)}
                placeholder="Ex: 20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacidade_leitos_clinicos">Leitos Clínicos</Label>
              <Input
                id="capacidade_leitos_clinicos"
                type="number"
                value={formData.capacidade_leitos_clinicos || ""}
                onChange={(e) => handleInputChange("capacidade_leitos_clinicos", e.target.value)}
                placeholder="Ex: 50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacidade_leitos_cirurgicos">Leitos Cirúrgicos</Label>
              <Input
                id="capacidade_leitos_cirurgicos"
                type="number"
                value={formData.capacidade_leitos_cirurgicos || ""}
                onChange={(e) => handleInputChange("capacidade_leitos_cirurgicos", e.target.value)}
                placeholder="Ex: 30"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Internações Clínicas</CardTitle>
            <CardDescription>
              Média diária de internações clínicas e tempo médio de permanência dos pacientes internados (dados do último mês)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="internacoes_clinicas_dia">Internações clínicas por dia</Label>
              <Input
                id="internacoes_clinicas_dia"
                type="number"
                step="0.01"
                value={formData.internacoes_clinicas_dia || ""}
                onChange={(e) => handleInputChange("internacoes_clinicas_dia", e.target.value)}
                placeholder="Ex: 12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tempo_medio_permanencia_internado_dia">Tempo médio de permanência (dias)</Label>
              <Input
                id="tempo_medio_permanencia_internado_dia"
                type="number"
                step="0.01"
                value={formData.tempo_medio_permanencia_internado_dia || ""}
                onChange={(e) => handleInputChange("tempo_medio_permanencia_internado_dia", e.target.value)}
                placeholder="Ex: 4.2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Internações UTI</CardTitle>
            <CardDescription>
              Média diária de internações em UTI e tempo médio de permanência (dados do último mês)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="internacoes_uti_dia">Internações em UTI por dia</Label>
              <Input
                id="internacoes_uti_dia"
                type="number"
                step="0.01"
                value={formData.internacoes_uti_dia || ""}
                onChange={(e) => handleInputChange("internacoes_uti_dia", e.target.value)}
                placeholder="Ex: 3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tempo_medio_permanencia_uti_dias">Tempo médio de permanência (dias)</Label>
              <Input
                id="tempo_medio_permanencia_uti_dias"
                type="number"
                step="0.01"
                value={formData.tempo_medio_permanencia_uti_dias || ""}
                onChange={(e) => handleInputChange("tempo_medio_permanencia_uti_dias", e.target.value)}
                placeholder="Ex: 6.8"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bloco Cirúrgico e RPA</CardTitle>
            <CardDescription>
              Informações sobre salas cirúrgicas, recuperação pós-anestésica e tempo médio de permanência na RPA (dados do último mês)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="salas_procedimentos_eletivos">Salas para procedimentos eletivos</Label>
              <Input
                id="salas_procedimentos_eletivos"
                type="number"
                value={formData.salas_procedimentos_eletivos || ""}
                onChange={(e) => handleInputChange("salas_procedimentos_eletivos", e.target.value)}
                placeholder="Ex: 4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_unidades_rpa">Total de unidades de RPA</Label>
              <Input
                id="total_unidades_rpa"
                type="number"
                value={formData.total_unidades_rpa || ""}
                onChange={(e) => handleInputChange("total_unidades_rpa", e.target.value)}
                placeholder="Ex: 6"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tempo_medio_permanencia_rpa_horas">Tempo médio de permanência RPA (horas)</Label>
              <Input
                id="tempo_medio_permanencia_rpa_horas"
                type="number"
                step="0.01"
                value={formData.tempo_medio_permanencia_rpa_horas || ""}
                onChange={(e) => handleInputChange("tempo_medio_permanencia_rpa_horas", e.target.value)}
                placeholder="Ex: 3"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Internações Cirúrgicas Eletivas</CardTitle>
            <CardDescription>
              Média diária de cirurgias eletivas agendadas e tempo médio de permanência hospitalar (dados do último mês)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="internacoes_cirurgicas_eletivas">Internações cirúrgicas eletivas por dia</Label>
              <Input
                id="internacoes_cirurgicas_eletivas"
                type="number"
                step="0.01"
                value={formData.internacoes_cirurgicas_eletivas || ""}
                onChange={(e) => handleInputChange("internacoes_cirurgicas_eletivas", e.target.value)}
                placeholder="Ex: 8"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tmp_cirurgica_eletiva_dias">Tempo médio de permanência (dias)</Label>
              <Input
                id="tmp_cirurgica_eletiva_dias"
                type="number"
                step="0.01"
                value={formData.tmp_cirurgica_eletiva_dias || ""}
                onChange={(e) => handleInputChange("tmp_cirurgica_eletiva_dias", e.target.value)}
                placeholder="Ex: 2.3"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Length of Stay (LOS) - Tempo de Permanência</CardTitle>
            <CardDescription>
              Tempo médio de permanência dos pacientes no hospital (em horas)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="los_sem_internacao_horas">LOS sem internação (horas)</Label>
              <Input
                id="los_sem_internacao_horas"
                type="number"
                step="0.01"
                value={formData.los_sem_internacao_horas || ""}
                onChange={(e) => handleInputChange("los_sem_internacao_horas", e.target.value)}
                placeholder="Ex: 4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="los_com_internacao_horas">LOS com internação (horas)</Label>
              <Input
                id="los_com_internacao_horas"
                type="number"
                step="0.01"
                value={formData.los_com_internacao_horas || ""}
                onChange={(e) => handleInputChange("los_com_internacao_horas", e.target.value)}
                placeholder="Ex: 9"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consultório e Exames</CardTitle>
            <CardDescription>
              Tempo médio de atendimento em consultório e quantidade de pacientes atendidos (com e sem internação - dados do último mês)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tempo_consultorio_saida">Tempo consultório (sem internação) em minutos</Label>
              <Input
                id="tempo_consultorio_saida"
                type="number"
                value={formData.tempo_consultorio_saida || ""}
                onChange={(e) => handleInputChange("tempo_consultorio_saida", e.target.value)}
                placeholder="Ex: 120"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidade_pacientes_sem_internacao">Quantidade de pacientes (sem internação)</Label>
              <Input
                id="quantidade_pacientes_sem_internacao"
                type="number"
                value={formData.quantidade_pacientes_sem_internacao || ""}
                onChange={(e) => handleInputChange("quantidade_pacientes_sem_internacao", e.target.value)}
                placeholder="Ex: 140"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tempo_consultorio_internacao">Tempo consultório (com internação) em minutos</Label>
              <Input
                id="tempo_consultorio_internacao"
                type="number"
                value={formData.tempo_consultorio_internacao || ""}
                onChange={(e) => handleInputChange("tempo_consultorio_internacao", e.target.value)}
                placeholder="Ex: 240"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidade_pacientes_com_internacao">Quantidade de pacientes (com internação)</Label>
              <Input
                id="quantidade_pacientes_com_internacao"
                type="number"
                value={formData.quantidade_pacientes_com_internacao || ""}
                onChange={(e) => handleInputChange("quantidade_pacientes_com_internacao", e.target.value)}
                placeholder="Ex: 40"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Média de Exames</CardTitle>
            <CardDescription>
              Quantidade média diária de exames realizados por tipo (dados do último mês)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="media_raio_x">Média Raio-X</Label>
              <Input
                id="media_raio_x"
                type="number"
                value={formData.media_raio_x || ""}
                onChange={(e) => handleInputChange("media_raio_x", e.target.value)}
                placeholder="Ex: 55"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_laboratorial">Média Laboratorial</Label>
              <Input
                id="media_laboratorial"
                type="number"
                value={formData.media_laboratorial || ""}
                onChange={(e) => handleInputChange("media_laboratorial", e.target.value)}
                placeholder="Ex: 120"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_ultrassonografia">Média Ultrassonografia</Label>
              <Input
                id="media_ultrassonografia"
                type="number"
                value={formData.media_ultrassonografia || ""}
                onChange={(e) => handleInputChange("media_ultrassonografia", e.target.value)}
                placeholder="Ex: 15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_tomografia">Média Tomografia</Label>
              <Input
                id="media_tomografia"
                type="number"
                value={formData.media_tomografia || ""}
                onChange={(e) => handleInputChange("media_tomografia", e.target.value)}
                placeholder="Ex: 10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_outros_exames">Média Outros Exames</Label>
              <Input
                id="media_outros_exames"
                type="number"
                value={formData.media_outros_exames || ""}
                onChange={(e) => handleInputChange("media_outros_exames", e.target.value)}
                placeholder="Ex: 8"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_sem_exames">Média Sem Exames</Label>
              <Input
                id="media_sem_exames"
                type="number"
                value={formData.media_sem_exames || ""}
                onChange={(e) => handleInputChange("media_sem_exames", e.target.value)}
                placeholder="Ex: 50"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Média de Urgência (Classificação de Manchester)</CardTitle>
            <CardDescription>
              Distribuição média diária de pacientes por nível de urgência segundo o Protocolo de Manchester (dados do último mês)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="media_emergencia">Emergência</Label>
              <Input
                id="media_emergencia"
                type="number"
                value={formData.media_emergencia || ""}
                onChange={(e) => handleInputChange("media_emergencia", e.target.value)}
                placeholder="Ex: 5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_muito_urgente">Muito Urgente</Label>
              <Input
                id="media_muito_urgente"
                type="number"
                value={formData.media_muito_urgente || ""}
                onChange={(e) => handleInputChange("media_muito_urgente", e.target.value)}
                placeholder="Ex: 20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_urgente">Urgente</Label>
              <Input
                id="media_urgente"
                type="number"
                value={formData.media_urgente || ""}
                onChange={(e) => handleInputChange("media_urgente", e.target.value)}
                placeholder="Ex: 70"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_pouco_urgente">Pouco Urgente</Label>
              <Input
                id="media_pouco_urgente"
                type="number"
                value={formData.media_pouco_urgente || ""}
                onChange={(e) => handleInputChange("media_pouco_urgente", e.target.value)}
                placeholder="Ex: 60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_nao_urgente">Não Urgente</Label>
              <Input
                id="media_nao_urgente"
                type="number"
                value={formData.media_nao_urgente || ""}
                onChange={(e) => handleInputChange("media_nao_urgente", e.target.value)}
                placeholder="Ex: 25"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Média de Funcionários por Categoria</CardTitle>
            <CardDescription>
              Quantidade média de funcionários por setor e turno (considere a equipe típica do último mês)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="media_func_enfermagem">Enfermagem</Label>
              <Input
                id="media_func_enfermagem"
                type="number"
                value={formData.media_func_enfermagem || ""}
                onChange={(e) => handleInputChange("media_func_enfermagem", e.target.value)}
                placeholder="Ex: 22"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_func_apoio_terceirizados">Apoio Terceirizados</Label>
              <Input
                id="media_func_apoio_terceirizados"
                type="number"
                value={formData.media_func_apoio_terceirizados || ""}
                onChange={(e) => handleInputChange("media_func_apoio_terceirizados", e.target.value)}
                placeholder="Ex: 10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_func_medicos_corpo_clinico">Médicos Corpo Clínico</Label>
              <Input
                id="media_func_medicos_corpo_clinico"
                type="number"
                value={formData.media_func_medicos_corpo_clinico || ""}
                onChange={(e) => handleInputChange("media_func_medicos_corpo_clinico", e.target.value)}
                placeholder="Ex: 12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_func_administrativo">Administrativo</Label>
              <Input
                id="media_func_administrativo"
                type="number"
                value={formData.media_func_administrativo || ""}
                onChange={(e) => handleInputChange("media_func_administrativo", e.target.value)}
                placeholder="Ex: 15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_func_multidisciplinar">Multidisciplinar</Label>
              <Input
                id="media_func_multidisciplinar"
                type="number"
                value={formData.media_func_multidisciplinar || ""}
                onChange={(e) => handleInputChange("media_func_multidisciplinar", e.target.value)}
                placeholder="Ex: 7"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_func_tecnicos_sadt">Técnicos SADT</Label>
              <Input
                id="media_func_tecnicos_sadt"
                type="number"
                value={formData.media_func_tecnicos_sadt || ""}
                onChange={(e) => handleInputChange("media_func_tecnicos_sadt", e.target.value)}
                placeholder="Ex: 9"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Médicos por Especialidade</CardTitle>
            <CardDescription>
              Quantidade média de médicos por especialidade por turno (considere a escala típica do último mês)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="media_medico_diretor_tecnico_ps">Diretor Técnico PS</Label>
              <Input
                id="media_medico_diretor_tecnico_ps"
                type="number"
                value={formData.media_medico_diretor_tecnico_ps || ""}
                onChange={(e) => handleInputChange("media_medico_diretor_tecnico_ps", e.target.value)}
                placeholder="Ex: 1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_medico_clinico_emergencista">Clínico Emergencista</Label>
              <Input
                id="media_medico_clinico_emergencista"
                type="number"
                value={formData.media_medico_clinico_emergencista || ""}
                onChange={(e) => handleInputChange("media_medico_clinico_emergencista", e.target.value)}
                placeholder="Ex: 6"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_medico_pediatra">Pediatra</Label>
              <Input
                id="media_medico_pediatra"
                type="number"
                value={formData.media_medico_pediatra || ""}
                onChange={(e) => handleInputChange("media_medico_pediatra", e.target.value)}
                placeholder="Ex: 3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_medico_ortopedista">Ortopedista</Label>
              <Input
                id="media_medico_ortopedista"
                type="number"
                value={formData.media_medico_ortopedista || ""}
                onChange={(e) => handleInputChange("media_medico_ortopedista", e.target.value)}
                placeholder="Ex: 2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_medico_intensivista">Intensivista</Label>
              <Input
                id="media_medico_intensivista"
                type="number"
                value={formData.media_medico_intensivista || ""}
                onChange={(e) => handleInputChange("media_medico_intensivista", e.target.value)}
                placeholder="Ex: 1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_medico_cirurgiao_geral">Cirurgião Geral</Label>
              <Input
                id="media_medico_cirurgiao_geral"
                type="number"
                value={formData.media_medico_cirurgiao_geral || ""}
                onChange={(e) => handleInputChange("media_medico_cirurgiao_geral", e.target.value)}
                placeholder="Ex: 2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_medico_anestesista">Anestesista</Label>
              <Input
                id="media_medico_anestesista"
                type="number"
                value={formData.media_medico_anestesista || ""}
                onChange={(e) => handleInputChange("media_medico_anestesista", e.target.value)}
                placeholder="Ex: 2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_medico_hospitalista_rotina">Hospitalista Rotina</Label>
              <Input
                id="media_medico_hospitalista_rotina"
                type="number"
                value={formData.media_medico_hospitalista_rotina || ""}
                onChange={(e) => handleInputChange("media_medico_hospitalista_rotina", e.target.value)}
                placeholder="Ex: 3"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enfermeiros por Nível</CardTitle>
            <CardDescription>
              Quantidade média de enfermeiros por nível hierárquico por turno (considere a escala típica do último mês)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="media_enf_gerente">Gerente</Label>
              <Input
                id="media_enf_gerente"
                type="number"
                value={formData.media_enf_gerente || ""}
                onChange={(e) => handleInputChange("media_enf_gerente", e.target.value)}
                placeholder="Ex: 1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_enf_supervisor_plantao">Supervisor de Plantão</Label>
              <Input
                id="media_enf_supervisor_plantao"
                type="number"
                value={formData.media_enf_supervisor_plantao || ""}
                onChange={(e) => handleInputChange("media_enf_supervisor_plantao", e.target.value)}
                placeholder="Ex: 2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_enf_coord">Coordenador</Label>
              <Input
                id="media_enf_coord"
                type="number"
                value={formData.media_enf_coord || ""}
                onChange={(e) => handleInputChange("media_enf_coord", e.target.value)}
                placeholder="Ex: 1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_enf_assistencial">Assistencial</Label>
              <Input
                id="media_enf_assistencial"
                type="number"
                value={formData.media_enf_assistencial || ""}
                onChange={(e) => handleInputChange("media_enf_assistencial", e.target.value)}
                placeholder="Ex: 8"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media_enf_tecnico">Técnico</Label>
              <Input
                id="media_enf_tecnico"
                type="number"
                value={formData.media_enf_tecnico || ""}
                onChange={(e) => handleInputChange("media_enf_tecnico", e.target.value)}
                placeholder="Ex: 12"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados Horários - Média de Pacientes e Staff</CardTitle>
            <CardDescription>
              Informe a média de pacientes que deram entrada no hospital em cada horário, 
              considerando os dados do último mês. Também informe quantos profissionais 
              estavam disponíveis para triagem e consultório em cada horário.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 24 }, (_, i) => {
              const hourPacientes = `media_pacientes_h${String(i).padStart(2, "0")}` as keyof QuestionarioData
              const hourTriagem = `media_staff_triagem_h${String(i).padStart(2, "0")}` as keyof QuestionarioData
              const hourConsultorio = `media_staff_consultorio_h${String(i).padStart(2, "0")}` as keyof QuestionarioData
              
              return (
                <div key={i} className="grid gap-4 md:grid-cols-4 items-end pb-2 border-b">
                  <div className="space-y-2">
                    <Label className="font-semibold">{String(i).padStart(2, "0")}:00</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={hourPacientes}>Média Pacientes</Label>
                    <Input
                      id={hourPacientes}
                      type="number"
                      value={formData[hourPacientes] || ""}
                      onChange={(e) => handleInputChange(hourPacientes, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={hourTriagem}>Staff Triagem</Label>
                    <Input
                      id={hourTriagem}
                      type="number"
                      value={formData[hourTriagem] || ""}
                      onChange={(e) => handleInputChange(hourTriagem, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={hourConsultorio}>Staff Consultório</Label>
                    <Input
                      id={hourConsultorio}
                      type="number"
                      value={formData[hourConsultorio] || ""}
                      onChange={(e) => handleInputChange(hourConsultorio, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>


      <div className="flex justify-center gap-4 pt-4">
        <Button 
          size="lg" 
          variant="outline" 
          onClick={handleSaveDraft} 
          className="gap-2"
          type="button"
        >
          <Save className="w-5 h-5" />
          Salvar Rascunho
        </Button>
        <Button size="lg" onClick={handleSubmit} disabled={loading} className="gap-2">
          <Send className="w-5 h-5" />
          {loading ? "Enviando..." : "Enviar Questionário"}
        </Button>
      </div>
    </div>
  )
}

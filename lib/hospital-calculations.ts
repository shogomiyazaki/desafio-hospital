export interface HospitalData {
    // Pronto-Socorro
    taxaEntradaPS: number
    taxaEntradaAmbulancia: number
    taxaConversaoInternacao: number
  
    // Observação
    leitosObservacao: number
    tmpObservacao: number
  
    // Internações Clínicas (PS)
    internacoesClinicasPS: number
    tmpEnfermariaClinicaPS: number
  
    // Internações Cirúrgicas (PS)
    internacoesCirurgicasPS: number
    tmpEnfermariaCirurgicaPS: number
  
    // UTI (PS)
    internacoesUTIPS: number
    tmpUTIPS: number
  
    // Bloco Cirúrgico
    salasCirurgicasEletivas: number
    salasCirurgicasUrgencia: number
  
    // RPA
    unidadesRPA: number
    tmpRPA: number
  
    // Eletivas
    internacoesClinicasEletivas: number
    internacoesCirurgicasEletivas: number
    tmpClinicaEletiva: number
    tmpCirurgicaEletiva: number
  
    // Financeiro e Tempo
    ticketMedioPS: number
    losSemInternacao: number
    losComInternacao: number
  }
  
  export interface CalculationResults {
    // Fatores de Utilização
    fatorUtilizacaoEnfermariaClinica: number
    fatorUtilizacaoEnfermariaCirurgica: number
    fatorUtilizacaoUTI: number
    fatorUtilizacaoBlocoCirurgico: number
    fatorUtilizacaoRPA: number
  
    // Leitos Necessários
    leitosNecessariosClinica: number
    leitosNecessariosCirurgica: number
    leitosNecessariosUTI: number
  
    // TMP Ideal
    tmpIdealClinica: number
    tmpIdealCirurgica: number
    tmpIdealUTI: number
  
    // Giro de Leitos
    giroLeitosClinicaAtual: number
    giroLeitosCirurgicaAtual: number
    giroLeitosUTIAtual: number
  
    giroLeitosClinicaNecessario: number
    giroLeitosCirurgicaNecessario: number
    giroLeitosUTINecessario: number
  
    // Capacidade Atual Estimada
    capacidadeAtualClinica: number
    capacidadeAtualCirurgica: number
    capacidadeAtualUTI: number
  }
  
  export function calculateIndicators(data: HospitalData): CalculationResults {
    // Demanda total de internações
    const demandaClinica = data.internacoesClinicasPS + data.internacoesClinicasEletivas
    const demandaCirurgica = data.internacoesCirurgicasPS + data.internacoesCirurgicasEletivas
    const demandaUTI = data.internacoesUTIPS
  
    // Leitos-dia necessários (Demanda × TMP)
    const leitosDiaClinica =
      data.internacoesClinicasPS * data.tmpEnfermariaClinicaPS + data.internacoesClinicasEletivas * data.tmpClinicaEletiva
  
    const leitosDiaCirurgica =
      data.internacoesCirurgicasPS * data.tmpEnfermariaCirurgicaPS +
      data.internacoesCirurgicasEletivas * data.tmpCirurgicaEletiva
  
    const leitosDiaUTI = data.internacoesUTIPS * data.tmpUTIPS
  
    // Estimativa de capacidade atual (assumindo 85% de ocupação ideal)
    const ocupacaoIdeal = 0.85
    const capacidadeAtualClinica = Math.ceil(leitosDiaClinica / ocupacaoIdeal)
    const capacidadeAtualCirurgica = Math.ceil(leitosDiaCirurgica / ocupacaoIdeal)
    const capacidadeAtualUTI = Math.ceil(leitosDiaUTI / ocupacaoIdeal)
  
    // Fatores de Utilização (Demanda / Capacidade)
    const fatorUtilizacaoEnfermariaClinica =
      capacidadeAtualClinica > 0 ? (leitosDiaClinica / capacidadeAtualClinica) * 100 : 0
  
    const fatorUtilizacaoEnfermariaCirurgica =
      capacidadeAtualCirurgica > 0 ? (leitosDiaCirurgica / capacidadeAtualCirurgica) * 100 : 0
  
    const fatorUtilizacaoUTI = capacidadeAtualUTI > 0 ? (leitosDiaUTI / capacidadeAtualUTI) * 100 : 0
  
    // Bloco Cirúrgico (assumindo 8 horas/dia por sala)
    const horasDisponiveisBlocoDia = (data.salasCirurgicasEletivas + data.salasCirurgicasUrgencia) * 8
    const horasNecessariasDia = (data.internacoesCirurgicasPS + data.internacoesCirurgicasEletivas) * 2 // assumindo 2h por cirurgia
    const fatorUtilizacaoBlocoCirurgico =
      horasDisponiveisBlocoDia > 0 ? (horasNecessariasDia / horasDisponiveisBlocoDia) * 100 : 0
  
    // RPA (convertendo TMP de horas para dias)
    const tmpRPADias = data.tmpRPA / 24
    const leitosDiaRPA = (data.internacoesCirurgicasPS + data.internacoesCirurgicasEletivas) * tmpRPADias
    const fatorUtilizacaoRPA = data.unidadesRPA > 0 ? (leitosDiaRPA / data.unidadesRPA) * 100 : 0
  
    // Leitos Necessários (quando utilização > 100%)
    const leitosNecessariosClinica =
      fatorUtilizacaoEnfermariaClinica > 100 ? Math.ceil(leitosDiaClinica / ocupacaoIdeal) : capacidadeAtualClinica
  
    const leitosNecessariosCirurgica =
      fatorUtilizacaoEnfermariaCirurgica > 100 ? Math.ceil(leitosDiaCirurgica / ocupacaoIdeal) : capacidadeAtualCirurgica
  
    const leitosNecessariosUTI = fatorUtilizacaoUTI > 100 ? Math.ceil(leitosDiaUTI / ocupacaoIdeal) : capacidadeAtualUTI
  
    // TMP Ideal (para atingir 85% de ocupação)
    const tmpIdealClinica =
      capacidadeAtualClinica > 0 && demandaClinica > 0
        ? (capacidadeAtualClinica * ocupacaoIdeal) / demandaClinica
        : data.tmpEnfermariaClinicaPS
  
    const tmpIdealCirurgica =
      capacidadeAtualCirurgica > 0 && demandaCirurgica > 0
        ? (capacidadeAtualCirurgica * ocupacaoIdeal) / demandaCirurgica
        : data.tmpEnfermariaCirurgicaPS
  
    const tmpIdealUTI =
      capacidadeAtualUTI > 0 && demandaUTI > 0 ? (capacidadeAtualUTI * ocupacaoIdeal) / demandaUTI : data.tmpUTIPS
  
    // Giro de Leitos Atual (Internações / Leitos)
    const giroLeitosClinicaAtual = capacidadeAtualClinica > 0 ? demandaClinica / capacidadeAtualClinica : 0
  
    const giroLeitosCirurgicaAtual = capacidadeAtualCirurgica > 0 ? demandaCirurgica / capacidadeAtualCirurgica : 0
  
    const giroLeitosUTIAtual = capacidadeAtualUTI > 0 ? demandaUTI / capacidadeAtualUTI : 0
  
    // Giro de Leitos Necessário (para 85% de ocupação)
    const giroLeitosClinicaNecessario =
      capacidadeAtualClinica > 0
        ? ocupacaoIdeal /
          ((data.internacoesClinicasPS * data.tmpEnfermariaClinicaPS +
            data.internacoesClinicasEletivas * data.tmpClinicaEletiva) /
            demandaClinica)
        : 0
  
    const giroLeitosCirurgicaNecessario =
      capacidadeAtualCirurgica > 0
        ? ocupacaoIdeal /
          ((data.internacoesCirurgicasPS * data.tmpEnfermariaCirurgicaPS +
            data.internacoesCirurgicasEletivas * data.tmpCirurgicaEletiva) /
            demandaCirurgica)
        : 0
  
    const giroLeitosUTINecessario = capacidadeAtualUTI > 0 ? ocupacaoIdeal / data.tmpUTIPS : 0
  
    return {
      fatorUtilizacaoEnfermariaClinica,
      fatorUtilizacaoEnfermariaCirurgica,
      fatorUtilizacaoUTI,
      fatorUtilizacaoBlocoCirurgico,
      fatorUtilizacaoRPA,
  
      leitosNecessariosClinica,
      leitosNecessariosCirurgica,
      leitosNecessariosUTI,
  
      tmpIdealClinica,
      tmpIdealCirurgica,
      tmpIdealUTI,
  
      giroLeitosClinicaAtual,
      giroLeitosCirurgicaAtual,
      giroLeitosUTIAtual,
  
      giroLeitosClinicaNecessario,
      giroLeitosCirurgicaNecessario,
      giroLeitosUTINecessario,
  
      capacidadeAtualClinica,
      capacidadeAtualCirurgica,
      capacidadeAtualUTI,
    }
  }

  /**
   * Converte os dados do formulário (formato API) para o formato esperado pela função de cálculo
   */
  export function convertFormDataToHospitalData(formData: any): HospitalData {
    return {
      // Pronto-Socorro
      taxaEntradaPS: formData.taxa_diaria_entradas_ps || 0,
      taxaEntradaAmbulancia: formData.taxa_diaria_entradas_ambulancia || 0,
      taxaConversaoInternacao: 0.15, // valor padrão
    
      // Observação
      leitosObservacao: formData.total_leitos_observacao || 0,
      tmpObservacao: formData.tempo_medio_permanencia_observacao_dias || 0,
    
      // Internações Clínicas (PS)
      internacoesClinicasPS: formData.internacoes_clinicas_dia || 0,
      tmpEnfermariaClinicaPS: formData.tempo_medio_permanencia_internado_dia || 0,
    
      // Internações Cirúrgicas (PS)
      internacoesCirurgicasPS: 0, // não está no formulário
      tmpEnfermariaCirurgicaPS: 0, // não está no formulário
    
      // UTI (PS)
      internacoesUTIPS: formData.internacoes_uti_dia || 0,
      tmpUTIPS: formData.tempo_medio_permanencia_uti_dias || 0,
    
      // Bloco Cirúrgico
      salasCirurgicasEletivas: formData.salas_procedimentos_eletivos || 0,
      salasCirurgicasUrgencia: formData.salas_urgencia || 0,
    
      // RPA
      unidadesRPA: formData.total_unidades_rpa || 0,
      tmpRPA: formData.tempo_medio_permanencia_rpa_horas || 0,
    
      // Eletivas
      internacoesClinicasEletivas: 0, // não está no formulário
      internacoesCirurgicasEletivas: formData.internacoes_cirurgicas_eletivas || 0,
      tmpClinicaEletiva: 0, // não está no formulário
      tmpCirurgicaEletiva: formData.tmp_cirurgica_eletiva_dias || 0,
    
      // Financeiro e Tempo
      ticketMedioPS: formData.ticket_medio_ps_reais || 0,
      losSemInternacao: formData.los_sem_internacao_horas || 0,
      losComInternacao: formData.los_com_internacao_horas || 0,
    }
  }
  
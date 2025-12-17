export interface HospitalData {
    taxaEntradaPS: number
    taxaEntradaAmbulancia: number
    taxaConversaoInternacao: number
    leitosObservacao: number
    tmpObservacao: number
    internacoesClinicasPS: number
    tmpEnfermariaClinicaPS: number
    internacoesCirurgicasPS: number
    tmpEnfermariaCirurgicaPS: number
    internacoesUTIPS: number
    tmpUTIPS: number
    salasCirurgicasEletivas: number
    salasCirurgicasUrgencia: number
    unidadesRPA: number
    tmpRPA: number
    internacoesClinicasEletivas: number
    internacoesCirurgicasEletivas: number
    tmpClinicaEletiva: number
    tmpCirurgicaEletiva: number
    ticketMedioPS: number
    losSemInternacao: number
    losComInternacao: number
  }
  
  export interface CalculationResults {
    fatorUtilizacaoEnfermariaClinica: number
    fatorUtilizacaoEnfermariaCirurgica: number
    fatorUtilizacaoUTI: number
    fatorUtilizacaoBlocoCirurgico: number
    fatorUtilizacaoRPA: number
    leitosNecessariosClinica: number
    leitosNecessariosCirurgica: number
    leitosNecessariosUTI: number
    tmpIdealClinica: number
    tmpIdealCirurgica: number
    tmpIdealUTI: number
    giroLeitosClinicaAtual: number
    giroLeitosCirurgicaAtual: number
    giroLeitosUTIAtual: number
  
    giroLeitosClinicaNecessario: number
    giroLeitosCirurgicaNecessario: number
    giroLeitosUTINecessario: number
    capacidadeAtualClinica: number
    capacidadeAtualCirurgica: number
    capacidadeAtualUTI: number
  }
  
  export function calculateIndicators(data: HospitalData): CalculationResults {
    const demandaClinica = data.internacoesClinicasPS + data.internacoesClinicasEletivas
    const demandaCirurgica = data.internacoesCirurgicasPS + data.internacoesCirurgicasEletivas
    const demandaUTI = data.internacoesUTIPS
  
    const leitosDiaClinica =
      data.internacoesClinicasPS * data.tmpEnfermariaClinicaPS + data.internacoesClinicasEletivas * data.tmpClinicaEletiva
  
    const leitosDiaCirurgica =
      data.internacoesCirurgicasPS * data.tmpEnfermariaCirurgicaPS +
      data.internacoesCirurgicasEletivas * data.tmpCirurgicaEletiva
  
    const leitosDiaUTI = data.internacoesUTIPS * data.tmpUTIPS
  
    const ocupacaoIdeal = 0.85
    const capacidadeAtualClinica = Math.ceil(leitosDiaClinica / ocupacaoIdeal)
    const capacidadeAtualCirurgica = Math.ceil(leitosDiaCirurgica / ocupacaoIdeal)
    const capacidadeAtualUTI = Math.ceil(leitosDiaUTI / ocupacaoIdeal)
  
    const fatorUtilizacaoEnfermariaClinica =
      capacidadeAtualClinica > 0 ? (leitosDiaClinica / capacidadeAtualClinica) * 100 : 0
  
    const fatorUtilizacaoEnfermariaCirurgica =
      capacidadeAtualCirurgica > 0 ? (leitosDiaCirurgica / capacidadeAtualCirurgica) * 100 : 0
  
    const fatorUtilizacaoUTI = capacidadeAtualUTI > 0 ? (leitosDiaUTI / capacidadeAtualUTI) * 100 : 0
  
    const horasDisponiveisBlocoDia = (data.salasCirurgicasEletivas + data.salasCirurgicasUrgencia) * 8
    const horasNecessariasDia = (data.internacoesCirurgicasPS + data.internacoesCirurgicasEletivas) * 2 // assumindo 2h por cirurgia
    const fatorUtilizacaoBlocoCirurgico =
      horasDisponiveisBlocoDia > 0 ? (horasNecessariasDia / horasDisponiveisBlocoDia) * 100 : 0

    const tmpRPADias = data.tmpRPA / 24
    const leitosDiaRPA = (data.internacoesCirurgicasPS + data.internacoesCirurgicasEletivas) * tmpRPADias
    const fatorUtilizacaoRPA = data.unidadesRPA > 0 ? (leitosDiaRPA / data.unidadesRPA) * 100 : 0
  

    const leitosNecessariosClinica =
      fatorUtilizacaoEnfermariaClinica > 100 ? Math.ceil(leitosDiaClinica / ocupacaoIdeal) : capacidadeAtualClinica
  
    const leitosNecessariosCirurgica =
      fatorUtilizacaoEnfermariaCirurgica > 100 ? Math.ceil(leitosDiaCirurgica / ocupacaoIdeal) : capacidadeAtualCirurgica
  
    const leitosNecessariosUTI = fatorUtilizacaoUTI > 100 ? Math.ceil(leitosDiaUTI / ocupacaoIdeal) : capacidadeAtualUTI
  

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
  

    const giroLeitosClinicaAtual = capacidadeAtualClinica > 0 ? demandaClinica / capacidadeAtualClinica : 0
  
    const giroLeitosCirurgicaAtual = capacidadeAtualCirurgica > 0 ? demandaCirurgica / capacidadeAtualCirurgica : 0
  
    const giroLeitosUTIAtual = capacidadeAtualUTI > 0 ? demandaUTI / capacidadeAtualUTI : 0
  

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


  export function convertFormDataToHospitalData(formData: any): HospitalData {
    return {
      
      taxaEntradaPS: formData.taxa_diaria_entradas_ps || 0,
      taxaEntradaAmbulancia: formData.taxa_diaria_entradas_ambulancia || 0,
      taxaConversaoInternacao: 0.15, 
    
      
      leitosObservacao: formData.total_leitos_observacao || 0,
      tmpObservacao: formData.tempo_medio_permanencia_observacao_dias || 0,
    
      
      internacoesClinicasPS: formData.internacoes_clinicas_dia || 0,
      tmpEnfermariaClinicaPS: formData.tempo_medio_permanencia_internado_dia || 0,
    
      
      internacoesCirurgicasPS: 0,
      tmpEnfermariaCirurgicaPS: 0, 
    
      
      internacoesUTIPS: formData.internacoes_uti_dia || 0,
      tmpUTIPS: formData.tempo_medio_permanencia_uti_dias || 0,
    
      
      salasCirurgicasEletivas: formData.salas_procedimentos_eletivos || 0,
      salasCirurgicasUrgencia: formData.salas_urgencia || 0,
    
      
      unidadesRPA: formData.total_unidades_rpa || 0,
      tmpRPA: formData.tempo_medio_permanencia_rpa_horas || 0,
    
      
      internacoesClinicasEletivas: 0, 
      internacoesCirurgicasEletivas: formData.internacoes_cirurgicas_eletivas || 0,
      tmpClinicaEletiva: 0, 
      tmpCirurgicaEletiva: formData.tmp_cirurgica_eletiva_dias || 0,
    
      
      ticketMedioPS: formData.ticket_medio_ps_reais || 0,
      losSemInternacao: formData.los_sem_internacao_horas || 0,
      losComInternacao: formData.los_com_internacao_horas || 0,
    }
  }
  
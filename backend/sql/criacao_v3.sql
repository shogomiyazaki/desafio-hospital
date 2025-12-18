CREATE TABLE public.questionario_v3 (
  id BIGSERIAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  -- =========================
  -- IDENTIFICAÇÃO
  -- =========================
  preenchedor_email TEXT NOT NULL,
  hospital_nome TEXT NOT NULL,
  hospital_cep TEXT NULL,

  -- =========================
  -- DEMANDA / ENTRADAS
  -- =========================
  taxa_diaria_entradas_ps INTEGER NULL,
  taxa_diaria_entradas_ambulancia INTEGER NULL,

  -- =========================
  -- CAPACIDADE DE LEITOS
  -- =========================
  capacidade_leitos_uti INTEGER NULL,
  capacidade_leitos_clinicos INTEGER NULL,
  capacidade_leitos_cirurgicos INTEGER NULL,

  -- =========================
  -- INTERNAÇÕES
  -- =========================
  internacoes_clinicas_dia INTEGER NULL,
  tempo_medio_permanencia_internado_dia REAL NULL,

  internacoes_uti_dia INTEGER NULL,
  tempo_medio_permanencia_uti_dias REAL NULL,

  internacoes_cirurgicas_eletivas INTEGER NULL,
  tmp_cirurgica_eletiva_dias REAL NULL,

  -- =========================
  -- SALAS / RPA
  -- =========================
  salas_procedimentos_eletivos INTEGER NULL,
  total_unidades_rpa INTEGER NULL,
  tempo_medio_permanencia_rpa_horas INTEGER NULL,

  -- =========================
  -- LOS (FOCO PRINCIPAL)
  -- =========================
  los_sem_internacao_horas INTEGER NULL,
  los_com_internacao_horas INTEGER NULL,

  tempo_consultorio_saida INTEGER NULL,
  quantidade_pacientes_sem_internacao INTEGER NULL,

  tempo_consultorio_internacao INTEGER NULL,
  quantidade_pacientes_com_internacao INTEGER NULL,

  -- =========================
  -- MIX DE EXAMES
  -- =========================
  media_raio_x INTEGER NULL,
  media_laboratorial INTEGER NULL,
  media_ultrassonografia INTEGER NULL,
  media_tomografia INTEGER NULL,
  media_outros_exames INTEGER NULL,
  media_sem_exames INTEGER NULL,

  -- =========================
  -- CLASSIFICAÇÃO DE RISCO
  -- =========================
  media_emergencia INTEGER NULL,
  media_muito_urgente INTEGER NULL,
  media_urgente INTEGER NULL,
  media_pouco_urgente INTEGER NULL,
  media_nao_urgente INTEGER NULL,

  -- =========================
  -- STAFF (MÉDIA)
  -- =========================
  media_func_enfermagem INTEGER NULL,
  media_func_apoio_terceirizados INTEGER NULL,
  media_func_medicos_corpo_clinico INTEGER NULL,
  media_func_administrativo INTEGER NULL,
  media_func_multidisciplinar INTEGER NULL,
  media_func_tecnicos_sadt INTEGER NULL,

  -- =========================
  -- MÉDICOS
  -- =========================
  media_medico_diretor_tecnico_ps INTEGER NULL,
  media_medico_clinico_emergencista INTEGER NULL,
  media_medico_pediatra INTEGER NULL,
  media_medico_ortopedista INTEGER NULL,
  media_medico_intensivista INTEGER NULL,
  media_medico_cirurgiao_geral INTEGER NULL,
  media_medico_anestesista INTEGER NULL,
  media_medico_hospitalista_rotina INTEGER NULL,

  -- =========================
  -- ENFERMAGEM
  -- =========================
  media_enf_gerente INTEGER NULL,
  media_enf_supervisor_plantao INTEGER NULL,
  media_enf_coord INTEGER NULL,
  media_enf_assistencial INTEGER NULL,
  media_enf_tecnico INTEGER NULL,

  -- =========================
  -- PACIENTES POR HORA (MÉDIA ÚLTIMO MÊS)
  -- =========================
  media_pacientes_h00 INTEGER NULL,
  media_pacientes_h01 INTEGER NULL,
  media_pacientes_h02 INTEGER NULL,
  media_pacientes_h03 INTEGER NULL,
  media_pacientes_h04 INTEGER NULL,
  media_pacientes_h05 INTEGER NULL,
  media_pacientes_h06 INTEGER NULL,
  media_pacientes_h07 INTEGER NULL,
  media_pacientes_h08 INTEGER NULL,
  media_pacientes_h09 INTEGER NULL,
  media_pacientes_h10 INTEGER NULL,
  media_pacientes_h11 INTEGER NULL,
  media_pacientes_h12 INTEGER NULL,
  media_pacientes_h13 INTEGER NULL,
  media_pacientes_h14 INTEGER NULL,
  media_pacientes_h15 INTEGER NULL,
  media_pacientes_h16 INTEGER NULL,
  media_pacientes_h17 INTEGER NULL,
  media_pacientes_h18 INTEGER NULL,
  media_pacientes_h19 INTEGER NULL,
  media_pacientes_h20 INTEGER NULL,
  media_pacientes_h21 INTEGER NULL,
  media_pacientes_h22 INTEGER NULL,
  media_pacientes_h23 INTEGER NULL,

  -- =========================
  -- STAFF TRIAGEM POR HORA
  -- =========================
  media_staff_triagem_h00 INTEGER NULL,
  media_staff_triagem_h01 INTEGER NULL,
  media_staff_triagem_h02 INTEGER NULL,
  media_staff_triagem_h03 INTEGER NULL,
  media_staff_triagem_h04 INTEGER NULL,
  media_staff_triagem_h05 INTEGER NULL,
  media_staff_triagem_h06 INTEGER NULL,
  media_staff_triagem_h07 INTEGER NULL,
  media_staff_triagem_h08 INTEGER NULL,
  media_staff_triagem_h09 INTEGER NULL,
  media_staff_triagem_h10 INTEGER NULL,
  media_staff_triagem_h11 INTEGER NULL,
  media_staff_triagem_h12 INTEGER NULL,
  media_staff_triagem_h13 INTEGER NULL,
  media_staff_triagem_h14 INTEGER NULL,
  media_staff_triagem_h15 INTEGER NULL,
  media_staff_triagem_h16 INTEGER NULL,
  media_staff_triagem_h17 INTEGER NULL,
  media_staff_triagem_h18 INTEGER NULL,
  media_staff_triagem_h19 INTEGER NULL,
  media_staff_triagem_h20 INTEGER NULL,
  media_staff_triagem_h21 INTEGER NULL,
  media_staff_triagem_h22 INTEGER NULL,
  media_staff_triagem_h23 INTEGER NULL,

  -- =========================
  -- STAFF CONSULTÓRIO POR HORA
  -- =========================
  media_staff_consultorio_h00 INTEGER NULL,
  media_staff_consultorio_h01 INTEGER NULL,
  media_staff_consultorio_h02 INTEGER NULL,
  media_staff_consultorio_h03 INTEGER NULL,
  media_staff_consultorio_h04 INTEGER NULL,
  media_staff_consultorio_h05 INTEGER NULL,
  media_staff_consultorio_h06 INTEGER NULL,
  media_staff_consultorio_h07 INTEGER NULL,
  media_staff_consultorio_h08 INTEGER NULL,
  media_staff_consultorio_h09 INTEGER NULL,
  media_staff_consultorio_h10 INTEGER NULL,
  media_staff_consultorio_h11 INTEGER NULL,
  media_staff_consultorio_h12 INTEGER NULL,
  media_staff_consultorio_h13 INTEGER NULL,
  media_staff_consultorio_h14 INTEGER NULL,
  media_staff_consultorio_h15 INTEGER NULL,
  media_staff_consultorio_h16 INTEGER NULL,
  media_staff_consultorio_h17 INTEGER NULL,
  media_staff_consultorio_h18 INTEGER NULL,
  media_staff_consultorio_h19 INTEGER NULL,
  media_staff_consultorio_h20 INTEGER NULL,
  media_staff_consultorio_h21 INTEGER NULL,
  media_staff_consultorio_h22 INTEGER NULL,
  media_staff_consultorio_h23 INTEGER NULL,

  CONSTRAINT questionario_v3_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

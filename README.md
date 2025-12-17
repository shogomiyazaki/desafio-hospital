# 🏥 Sistema de Otimização Hospitalar

## 📋 Sobre o Projeto

Este projeto é um **sistema de coleta e análise de dados hospitalares** desenvolvido como parte do desafio de otimização hospitalar da UNIFESP. O objetivo é criar uma ferramenta que auxilie na **modelagem matemática para equilibrar capacidade e demanda** no sistema de saúde.

### 🎯 Objetivos

- **Coletar dados operacionais** de hospitais de forma estruturada
- **Analisar indicadores de desempenho** como tempo de permanência (LOS), ocupação de leitos e fluxo de pacientes
- **Fornecer insights** através de dashboard Power BI para tomada de decisões
- **Otimizar recursos** hospitalares através de modelagem matemática

---

## 🚀 Funcionalidades

### Para Hospitais (Clientes)

- ✅ **Formulário intuitivo** para preenchimento de dados operacionais
- ✅ **Salvamento automático** do progresso usando email como identificador
- ✅ **Retomada do preenchimento** - continue de onde parou
- ✅ **Validação de dados** em tempo real
- ✅ **Dashboard Power BI** para visualização dos resultados

### Dados Coletados

O sistema coleta informações sobre:

| Categoria | Dados |
|-----------|-------|
| **Identificação** | Email do preenchedor, Nome do hospital, CEP |
| **Pronto-Socorro** | Taxa de entradas diárias, Entradas via ambulância |
| **Capacidade** | Leitos UTI, Clínicos e Cirúrgicos |
| **Internações** | Internações clínicas, UTI e cirúrgicas eletivas |
| **Tempo de Permanência** | LOS com/sem internação, Tempo em RPA |
| **Exames** | Média diária por tipo (Raio-X, Lab, USG, TC) |
| **Classificação de Risco** | Distribuição por protocolo de Manchester |
| **Equipe** | Funcionários, médicos e enfermeiros por categoria |
| **Fluxo Horário** | Média de pacientes e staff por hora (24h) |

---

## 📊 Dashboard de Resultados

Após o envio do questionário, os dados são processados e disponibilizados em um **Dashboard Power BI** interativo:

🔗 **[Acessar Dashboard Power BI](https://app.powerbi.com/groups/me/reports/92edc7ce-52d8-4b83-a178-207e40cb5fe7?ctid=4de3a1ea-fae4-4f85-9657-9a9905d85269&pbi_source=linkShare)**

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn/UI** - Componentes de interface
- **Lucide Icons** - Ícones

### Backend
- **Next.js API Routes** - Endpoints da API
- **Python/Flask** - API externa para processamento
- **Supabase** - Banco de dados PostgreSQL

### Deploy
- **Vercel** - Hospedagem e CI/CD

---

## 🏃‍♂️ Como Executar Localmente

### Pré-requisitos

- Node.js 18+ 
- npm, yarn, pnpm ou bun

### Instalação

```bash
# Clone o repositório
git clone https://github.com/shogomiyazaki/desafio-hospital.git
cd desafio-hospital

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Execute o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```env
NEXT_PUBLIC_API_BASE_URL=http://sua-api-url:5000
API_BASE_URL=http://sua-api-url:5000
```

---

## 📁 Estrutura do Projeto

```
desafio-hospital/
├── app/
│   ├── (app)/              # Layout principal
│   │   ├── page.tsx        # Página inicial
│   │   ├── layout.tsx      # Layout
│   │   └── globals.css     # Estilos globais
│   ├── api/                # Rotas de API
│   │   ├── health/         # Health check
│   │   └── questionario/   # CRUD questionário
│   └── components/         # Componentes React
│       ├── hospital-optimization-form.tsx
│       └── ui/             # Componentes UI (Shadcn)
├── lib/                    # Utilitários
│   ├── api.ts              # Cliente API
│   └── utils.ts            # Funções auxiliares
└── public/                 # Assets estáticos
```

---

## 👥 Equipe

Projeto desenvolvido por estudantes da **UNIFESP** como parte do desafio de otimização hospitalar.

---

## 📄 Licença

Este projeto é de uso acadêmico e está sob supervisão da UNIFESP.

---

## 📞 Suporte

Em caso de dúvidas ou problemas:
- Abra uma [issue](https://github.com/shogomiyazaki/desafio-hospital/issues) no GitHub
- Entre em contato com a equipe de desenvolvimento

---

<div align="center">
  <p>Feito com ❤️ para melhorar a gestão hospitalar</p>
  <p><strong>UNIFESP - 2025</strong></p>
</div>


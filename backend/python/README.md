# API Questionário Hospitalar

API REST em Flask para gerenciamento de questionários hospitalares (v3).

## Instalação

```bash
pip install -r requirements.txt
```

## Configuração

As configurações estão no arquivo `config.py`. Você pode editar diretamente ou usar variáveis de ambiente (o arquivo também suporta `.env`).

Principais configurações:
- `DB_PASSWORD` - Senha do banco de dados PostgreSQL
- `DEBUG` - Modo debug (True/False)
- `HOST` - Host da aplicação (padrão: 0.0.0.0)
- `PORT` - Porta da aplicação (padrão: 5000)

## Execução

```bash
python app_v3.py
```

A API estará disponível em `http://localhost:5000`

## Endpoints

### POST `/api/questionario`
Cria ou atualiza um questionário (UPSERT baseado no e-mail).

**Campos obrigatórios:** `preenchedor_email`, `hospital_nome`

### GET `/api/questionario`
Lista todos os questionários com paginação.

**Query params:** `page`, `limit`

### GET `/api/questionario/<id>`
Obtém um questionário por ID.

### GET `/api/questionario/email/<email>`
Obtém um questionário por e-mail.

### GET `/health`
Verifica o status da API e conexão com o banco de dados.

## Estrutura

- `app_v3.py` - Aplicação Flask principal
- `config.py` - Configurações e variáveis de ambiente
- `requirements.txt` - Dependências do projeto


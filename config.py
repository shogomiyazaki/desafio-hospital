import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

class Config:
    """Configurações da aplicação"""
    
    # ⚠️ IMPORTANTE: Configure a senha do PostgreSQL nas variáveis de ambiente
    # Crie um arquivo .env na raiz do projeto com:
    # DB_PASSWORD=sua_senha_aqui
    
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'rpvmm*hospital*unifesp')
    # Força o uso da senha correta se a variável de ambiente não estiver definida
    if DB_PASSWORD == '[YOUR-PASSWORD]':
        DB_PASSWORD = 'rpvmm*hospital*unifesp'
    DB_HOST = 'aws-0-us-west-2.pooler.supabase.com'
    DB_PORT = '5432'
    DB_NAME = 'postgres'
    DB_USER = 'postgres.tjijuriqxwcknylumkoe'

    # URL de conexão completa
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    # Configurações da API
    SECRET_KEY = os.getenv('SECRET_KEY', 'RPVMM*UNIFESP*2025')
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
    HOST = os.getenv('HOST', '0.0.0.0')
    PORT = int(os.getenv('PORT', '5000'))
    
    # Configurações de CORS (se necessário)
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')


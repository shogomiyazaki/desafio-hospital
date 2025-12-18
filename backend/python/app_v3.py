from flask import Flask, request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from datetime import datetime
import logging
import re
from config import Config

# Configuração do logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# IMPORTANTE: Configure a senha do PostgreSQL no arquivo .env ou diretamente aqui
DATABASE_URL = Config.DATABASE_URL

def get_db_connection():
    """Estabelece conexão com o banco de dados PostgreSQL"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        logger.error(f"Erro ao conectar com o banco de dados: {e}")
        raise

def validate_email(email):
    """Valida formato de e-mail"""
    if not email or not isinstance(email, str):
        return False
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_questionario_data(data):
    """Valida os dados do questionário v3"""
    # Campos obrigatórios
    required_fields = ['preenchedor_email', 'hospital_nome']
    
    # Verifica campos obrigatórios
    missing_fields = [field for field in required_fields if field not in data or data[field] is None]
    if missing_fields:
        return False, f"Campos obrigatórios ausentes: {', '.join(missing_fields)}"
    
    # Valida formato do e-mail
    if not validate_email(data['preenchedor_email']):
        return False, "E-mail inválido"
    
    # Valida hospital_nome não vazio
    if not isinstance(data['hospital_nome'], str) or len(data['hospital_nome'].strip()) == 0:
        return False, "hospital_nome deve ser uma string não vazia"
    
    # Lista de todos os campos possíveis
    all_fields = [
        # Identificação (obrigatórios)
        'preenchedor_email',
        'hospital_nome',
        'hospital_cep',
        # Demanda / Entradas
        'taxa_diaria_entradas_ps',
        'taxa_diaria_entradas_ambulancia',
        # Capacidade de leitos
        'capacidade_leitos_uti',
        'capacidade_leitos_clinicos',
        'capacidade_leitos_cirurgicos',
        # Internações
        'internacoes_clinicas_dia',
        'tempo_medio_permanencia_internado_dia',
        'internacoes_uti_dia',
        'tempo_medio_permanencia_uti_dias',
        'internacoes_cirurgicas_eletivas',
        'tmp_cirurgica_eletiva_dias',
        # Salas / RPA
        'salas_procedimentos_eletivos',
        'total_unidades_rpa',
        'tempo_medio_permanencia_rpa_horas',
        # LOS (Foco Principal)
        'los_sem_internacao_horas',
        'los_com_internacao_horas',
        'tempo_consultorio_saida',
        'quantidade_pacientes_sem_internacao',
        'tempo_consultorio_internacao',
        'quantidade_pacientes_com_internacao',
        # Mix de exames
        'media_raio_x',
        'media_laboratorial',
        'media_ultrassonografia',
        'media_tomografia',
        'media_outros_exames',
        'media_sem_exames',
        # Classificação de risco
        'media_emergencia',
        'media_muito_urgente',
        'media_urgente',
        'media_pouco_urgente',
        'media_nao_urgente',
        # Staff (Média)
        'media_func_enfermagem',
        'media_func_apoio_terceirizados',
        'media_func_medicos_corpo_clinico',
        'media_func_administrativo',
        'media_func_multidisciplinar',
        'media_func_tecnicos_sadt',
        # Médicos
        'media_medico_diretor_tecnico_ps',
        'media_medico_clinico_emergencista',
        'media_medico_pediatra',
        'media_medico_ortopedista',
        'media_medico_intensivista',
        'media_medico_cirurgiao_geral',
        'media_medico_anestesista',
        'media_medico_hospitalista_rotina',
        # Enfermagem
        'media_enf_gerente',
        'media_enf_supervisor_plantao',
        'media_enf_coord',
        'media_enf_assistencial',
        'media_enf_tecnico',
        # Média de pacientes por horário (h00 a h23)
        'media_pacientes_h00', 'media_pacientes_h01', 'media_pacientes_h02', 'media_pacientes_h03',
        'media_pacientes_h04', 'media_pacientes_h05', 'media_pacientes_h06', 'media_pacientes_h07',
        'media_pacientes_h08', 'media_pacientes_h09', 'media_pacientes_h10', 'media_pacientes_h11',
        'media_pacientes_h12', 'media_pacientes_h13', 'media_pacientes_h14', 'media_pacientes_h15',
        'media_pacientes_h16', 'media_pacientes_h17', 'media_pacientes_h18', 'media_pacientes_h19',
        'media_pacientes_h20', 'media_pacientes_h21', 'media_pacientes_h22', 'media_pacientes_h23',
        # Média de staff de triagem por horário (h00 a h23)
        'media_staff_triagem_h00', 'media_staff_triagem_h01', 'media_staff_triagem_h02', 'media_staff_triagem_h03',
        'media_staff_triagem_h04', 'media_staff_triagem_h05', 'media_staff_triagem_h06', 'media_staff_triagem_h07',
        'media_staff_triagem_h08', 'media_staff_triagem_h09', 'media_staff_triagem_h10', 'media_staff_triagem_h11',
        'media_staff_triagem_h12', 'media_staff_triagem_h13', 'media_staff_triagem_h14', 'media_staff_triagem_h15',
        'media_staff_triagem_h16', 'media_staff_triagem_h17', 'media_staff_triagem_h18', 'media_staff_triagem_h19',
        'media_staff_triagem_h20', 'media_staff_triagem_h21', 'media_staff_triagem_h22', 'media_staff_triagem_h23',
        # Média de médicos no consultório por horário (h00 a h23)
        'media_staff_consultorio_h00', 'media_staff_consultorio_h01', 'media_staff_consultorio_h02', 'media_staff_consultorio_h03',
        'media_staff_consultorio_h04', 'media_staff_consultorio_h05', 'media_staff_consultorio_h06', 'media_staff_consultorio_h07',
        'media_staff_consultorio_h08', 'media_staff_consultorio_h09', 'media_staff_consultorio_h10', 'media_staff_consultorio_h11',
        'media_staff_consultorio_h12', 'media_staff_consultorio_h13', 'media_staff_consultorio_h14', 'media_staff_consultorio_h15',
        'media_staff_consultorio_h16', 'media_staff_consultorio_h17', 'media_staff_consultorio_h18', 'media_staff_consultorio_h19',
        'media_staff_consultorio_h20', 'media_staff_consultorio_h21', 'media_staff_consultorio_h22', 'media_staff_consultorio_h23'
    ]
    
    # Campos que devem ser inteiros
    int_fields = [
        'taxa_diaria_entradas_ps', 'taxa_diaria_entradas_ambulancia',
        'capacidade_leitos_uti', 'capacidade_leitos_clinicos', 'capacidade_leitos_cirurgicos',
        'internacoes_clinicas_dia', 'internacoes_uti_dia', 'internacoes_cirurgicas_eletivas',
        'salas_procedimentos_eletivos', 'total_unidades_rpa', 'tempo_medio_permanencia_rpa_horas',
        'los_sem_internacao_horas', 'los_com_internacao_horas',
        'tempo_consultorio_saida', 'quantidade_pacientes_sem_internacao',
        'tempo_consultorio_internacao', 'quantidade_pacientes_com_internacao',
        'media_raio_x', 'media_laboratorial', 'media_ultrassonografia', 'media_tomografia',
        'media_outros_exames', 'media_sem_exames',
        'media_emergencia', 'media_muito_urgente', 'media_urgente', 'media_pouco_urgente', 'media_nao_urgente',
        'media_func_enfermagem', 'media_func_apoio_terceirizados', 'media_func_medicos_corpo_clinico',
        'media_func_administrativo', 'media_func_multidisciplinar', 'media_func_tecnicos_sadt',
        'media_medico_diretor_tecnico_ps', 'media_medico_clinico_emergencista', 'media_medico_pediatra',
        'media_medico_ortopedista', 'media_medico_intensivista', 'media_medico_cirurgiao_geral',
        'media_medico_anestesista', 'media_medico_hospitalista_rotina',
        'media_enf_gerente', 'media_enf_supervisor_plantao', 'media_enf_coord',
        'media_enf_assistencial', 'media_enf_tecnico'
    ] + [f'media_pacientes_h{i:02d}' for i in range(24)] + \
      [f'media_staff_triagem_h{i:02d}' for i in range(24)] + \
      [f'media_staff_consultorio_h{i:02d}' for i in range(24)]
    
    # Valida apenas os campos que foram enviados
    for field in data.keys():
        if field not in all_fields:
            return False, f"Campo desconhecido: {field}"
        
        value = data[field]
        if value is not None:
            if field in int_fields:
                if not isinstance(value, int) or value < 0:
                    return False, f"Campo {field} deve ser um número inteiro não negativo"
            elif field in ['preenchedor_email', 'hospital_nome', 'hospital_cep']:
                # Campos de texto
                if not isinstance(value, str):
                    return False, f"Campo {field} deve ser uma string"
            else:
                # Campos REAL (float)
                if not isinstance(value, (int, float)) or value < 0:
                    return False, f"Campo {field} deve ser um número não negativo"
    
    return True, "Dados válidos"

@app.route('/api/questionario', methods=['POST'])
def criar_ou_atualizar_questionario():
    """
    Endpoint para criar ou atualizar um questionário v3
    Se o e-mail já existir, o registro será atualizado (UPSERT)
    
    Body (JSON): Campos obrigatórios: preenchedor_email, hospital_nome
    Exemplo:
    {
        "preenchedor_email": "usuario@hospital.com",
        "hospital_nome": "Hospital Exemplo",
        "hospital_cep": "01234-567",
        "taxa_diaria_entradas_ps": 150,
        "taxa_diaria_entradas_ambulancia": 25,
        "capacidade_leitos_uti": 20,
        "capacidade_leitos_clinicos": 50,
        "capacidade_leitos_cirurgicos": 30,
        "internacoes_clinicas_dia": 30,
        "tempo_medio_permanencia_internado_dia": 4.2,
        "internacoes_uti_dia": 5,
        "tempo_medio_permanencia_uti_dias": 6.8,
        "salas_procedimentos_eletivos": 8,
        "total_unidades_rpa": 6,
        "tempo_medio_permanencia_rpa_horas": 2,
        "internacoes_cirurgicas_eletivas": 20,
        "tmp_cirurgica_eletiva_dias": 2.8,
        "los_sem_internacao_horas": 4,
        "los_com_internacao_horas": 48,
        "tempo_consultorio_saida": 2,
        "quantidade_pacientes_sem_internacao": 100,
        "tempo_consultorio_internacao": 3,
        "quantidade_pacientes_com_internacao": 50,
        "media_raio_x": 10,
        "media_laboratorial": 15,
        "media_ultrassonografia": 5,
        "media_tomografia": 3,
        "media_outros_exames": 2,
        "media_sem_exames": 5,
        "media_emergencia": 20,
        "media_muito_urgente": 30,
        "media_urgente": 40,
        "media_pouco_urgente": 50,
        "media_nao_urgente": 10,
        "media_func_enfermagem": 25,
        "media_func_apoio_terceirizados": 10,
        "media_func_medicos_corpo_clinico": 15,
        "media_func_administrativo": 8,
        "media_func_multidisciplinar": 5,
        "media_func_tecnicos_sadt": 12,
        "media_medico_diretor_tecnico_ps": 1,
        "media_medico_clinico_emergencista": 5,
        "media_medico_pediatra": 3,
        "media_medico_ortopedista": 2,
        "media_medico_intensivista": 4,
        "media_medico_cirurgiao_geral": 3,
        "media_medico_anestesista": 2,
        "media_medico_hospitalista_rotina": 5,
        "media_enf_gerente": 2,
        "media_enf_supervisor_plantao": 4,
        "media_enf_coord": 3,
        "media_enf_assistencial": 15,
        "media_enf_tecnico": 10,
        "media_pacientes_h08": 20,
        "media_pacientes_h09": 25,
        "media_staff_triagem_h08": 2,
        "media_staff_consultorio_h08": 3
    }
    """
    try:
        # Verifica se o conteúdo é JSON
        if not request.is_json:
            return jsonify({
                'success': False,
                'message': 'Content-Type deve ser application/json'
            }), 400
        
        data = request.get_json()
        
        # Valida os dados
        is_valid, message = validate_questionario_data(data)
        if not is_valid:
            return jsonify({
                'success': False,
                'message': message
            }), 400
        
        # Conecta ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verifica se já existe um registro com o mesmo e-mail
        cursor.execute(
            "SELECT id, created_at FROM questionario_v3 WHERE preenchedor_email = %s",
            (data['preenchedor_email'],)
        )
        existing_record = cursor.fetchone()
        
        if existing_record:
            # UPDATE: Registro existe, atualiza
            record_id, original_created_at = existing_record
            
            # Monta a query de UPDATE dinamicamente
            update_fields = [field for field in data.keys() if field != 'preenchedor_email']
            if not update_fields:
                cursor.close()
                conn.close()
                return jsonify({
                    'success': False,
                    'message': 'Nenhum campo para atualizar além do e-mail'
                }), 400
            
            set_clauses = ', '.join([f"{field} = %s" for field in update_fields])
            values = tuple(data[field] for field in update_fields) + (data['preenchedor_email'],)
            
            update_query = f"""
            UPDATE questionario_v3
            SET {set_clauses}
            WHERE preenchedor_email = %s
            RETURNING id, created_at;
            """
            
            cursor.execute(update_query, values)
            result = cursor.fetchone()
            conn.commit()
            
            cursor.close()
            conn.close()
            
            logger.info(f"Questionário v3 atualizado com sucesso. ID: {result[0]}, E-mail: {data['preenchedor_email']}")
            
            return jsonify({
                'success': True,
                'message': 'Questionário atualizado com sucesso',
                'action': 'updated',
                'data': {
                    'id': result[0],
                    'preenchedor_email': data['preenchedor_email'],
                    'created_at': original_created_at.isoformat(),
                    'updated_at': result[1].isoformat()
                }
            }), 200
        else:
            # INSERT: Registro não existe, cria novo
            fields = list(data.keys())
            placeholders = ', '.join(['%s'] * len(fields))
            field_names = ', '.join(fields)
            
            insert_query = f"""
            INSERT INTO questionario_v3 ({field_names})
            VALUES ({placeholders})
            RETURNING id, created_at;
            """
            
            values = tuple(data[field] for field in fields)
            
            cursor.execute(insert_query, values)
            result = cursor.fetchone()
            conn.commit()
            
            cursor.close()
            conn.close()
            
            logger.info(f"Questionário v3 criado com sucesso. ID: {result[0]}, E-mail: {data['preenchedor_email']}")
            
            return jsonify({
                'success': True,
                'message': 'Questionário criado com sucesso',
                'action': 'created',
                'data': {
                    'id': result[0],
                    'preenchedor_email': data['preenchedor_email'],
                    'created_at': result[1].isoformat()
                }
            }), 201
        
    except psycopg2.Error as e:
        logger.error(f"Erro no banco de dados: {e}")
        if conn:
            conn.rollback()
            cursor.close()
            conn.close()
        return jsonify({
            'success': False,
            'message': f'Erro no banco de dados: {str(e)}'
        }), 500
        
    except Exception as e:
        logger.error(f"Erro interno: {e}")
        if conn:
            conn.rollback()
            cursor.close()
            conn.close()
        return jsonify({
            'success': False,
            'message': 'Erro interno do servidor'
        }), 500

@app.route('/api/questionario/<int:questionario_id>', methods=['GET'])
def obter_questionario(questionario_id):
    """Obtém um questionário específico por ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("SELECT * FROM questionario_v3 WHERE id = %s", (questionario_id,))
        questionario = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if questionario:
            return jsonify({
                'success': True,
                'data': dict(questionario)
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Questionário não encontrado'
            }), 404
            
    except Exception as e:
        logger.error(f"Erro ao obter questionário: {e}")
        return jsonify({
            'success': False,
            'message': 'Erro interno do servidor'
        }), 500

@app.route('/api/questionario/email/<email>', methods=['GET'])
def obter_questionario_por_email(email):
    """Obtém um questionário específico por e-mail"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("SELECT * FROM questionario_v3 WHERE preenchedor_email = %s", (email,))
        questionario = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if questionario:
            return jsonify({
                'success': True,
                'data': dict(questionario)
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Questionário não encontrado para o e-mail fornecido'
            }), 404
            
    except Exception as e:
        logger.error(f"Erro ao obter questionário por e-mail: {e}")
        return jsonify({
            'success': False,
            'message': 'Erro interno do servidor'
        }), 500

@app.route('/api/questionario', methods=['GET'])
def listar_questionarios():
    """Lista todos os questionários com paginação"""
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        offset = (page - 1) * limit
        
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Conta total de registros
        cursor.execute("SELECT COUNT(*) FROM questionario_v3")
        total = cursor.fetchone()['count']
        
        # Busca os registros com paginação
        cursor.execute("""
            SELECT * FROM questionario_v3 
            ORDER BY created_at DESC 
            LIMIT %s OFFSET %s
        """, (limit, offset))
        
        questionarios = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'data': [dict(q) for q in questionarios],
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total,
                'pages': (total + limit - 1) // limit
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Erro ao listar questionários: {e}")
        return jsonify({
            'success': False,
            'message': 'Erro interno do servidor'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint para verificar a saúde da API"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.close()
        conn.close()
        
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    # IMPORTANTE: Configure a senha do PostgreSQL antes de executar
    if '[YOUR-PASSWORD]' in DATABASE_URL or 'sua_senha_aqui' in DATABASE_URL:
        print("ATENCAO: Configure a senha do PostgreSQL!")
        print("Opcao 1: Crie um arquivo .env com DB_PASSWORD=sua_senha")
        print("Opcao 2: Edite o arquivo config.py diretamente")
        print("Opcao 3: Configure a variavel de ambiente DB_PASSWORD")
        exit(1)
    
    app.run(debug=Config.DEBUG, host=Config.HOST, port=Config.PORT)




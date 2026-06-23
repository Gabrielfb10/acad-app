Atue como um Desenvolvedor Full-Stack Sênior. Quero que você crie uma aplicação web responsiva focada em auxiliar treinos de academia, com ênfase total em dispositivos móveis (mobile-first, otimizada para telas com max-width de 768px). A aplicação terá um front-end interativo e um back-end com banco de dados para persistência real das informações.

### 1. Stack Tecnológica
- **Front-end:** React com Tailwind CSS (organizado em componentes reutilizáveis).
- **Back-end:** [ESCOLHA SUA PREFERÊNCIA AQUI: Python (FastAPI/Flask) ou Java (Spring Boot) ou Node.js (Express)].
- **Banco de Dados:** SQLite (para facilidade de configuração inicial) ou PostgreSQL.

### 2. Esquema do Banco de Dados (Modelagem)
Crie as seguintes tabelas/entidades:
- **Exercise (Exercício):** `id` (PK), `name` (string), `default_sets` (int, padrão 3), `default_reps` (int, padrão 15), `default_rest` (int, padrão 50), `weight` (float, padrão 0.0).
- **Workout (Treino):** `id` (PK), `title` (string, ex: "Treino A"), `created_at` (timestamp).
- **Workout_Exercise (Tabela de Associação):** `workout_id` (FK), `exercise_id` (FK), `order_index` (int).

### 3. API e Endpoints Necessários
Desenvolva uma API RESTful com os seguintes endpoints:
- `GET /api/exercises` - Retorna a lista geral de exercícios.
- `PUT /api/exercises/{id}/weight` - Atualiza a carga de um exercício específico.
- `GET /api/workouts` - Retorna todos os treinos criados.
- `POST /api/workouts` - Cria um novo treino.
- `DELETE /api/workouts/{id}` - Deleta um treino.
- `POST /api/workouts/{id}/exercises` - Adiciona um exercício à playlist do treino.
- `DELETE /api/workouts/{workout_id}/exercises/{exercise_id}` - Remove um exercício do treino.

### 4. Requisitos de UI/UX (Front-end)
A interface deve usar um tema escuro (bg-zinc-950) com detalhes em vermelho/laranja para remeter a apps de fitness. A navegação deve ser feita por uma Bottom Navigation Bar contendo duas abas: "Exercícios" e "Treinos".

- **Aba Exercícios:** Lista completa de exercícios em formato Accordion. O cabeçalho mostra o nome. Ao expandir, exibe um grid com "Séries", "Repetições", "Intervalo" e um campo editável para "Carga". Ao editar a carga, o front-end deve fazer uma requisição PUT imediata para a API para salvar o dado.
- **Aba Treinos:** Exibe cards para cada treino criado. Deve haver um botão claro de "+ Novo Treino". Ao editar um treino, abra um modal para selecionar exercícios da lista geral e adicioná-los à "playlist" daquele treino. Dentro do card, os exercícios devem ser listados, permitindo exclusão individual ou exclusão do treino completo.

### 5. Carga de Dados Inicial (Seed)
Inclua um script ou instrução para popular o banco de dados com a seguinte lista de exercícios iniciais:
- Agachamento frontal halter
- Leg horizontal pés paralelos
- Elevação pélvica máquina
- Cadeira flexora
- Cadeira extensora
- Cadeira abdutora
- Panturrilha máquina
- Extensão lombar máquina
- Supino máquina
- Supino inclinado com halteres
- Crucifixo no voador
- Desenvolvimento maquina pronada
- Elevação lateral
- Tríceps na polia alta com corda
- Tríceps francês no banco halter
- Abdominal remador
- Alongamentos on/off
- Puxada pela frente pronada
- Puxada triangulo
- Remada pulley pronada
- Bíceps alternado
- Bíceps banco scott barra reta
- Bíceps martelo halter
- Abdominal infra solo joelhos estendidos

Por favor, forneça o código estruturado do back-end, do front-end e as instruções claras de como rodar o projeto localmente.
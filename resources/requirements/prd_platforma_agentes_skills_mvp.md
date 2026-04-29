# PRD — Plataforma de Agentes Customizados com Sistema de Skills Estilo ChatGPT

## 1. Resumo executivo

Construir uma plataforma interna onde a equipa operacional possa:
1. criar **agentes customizados**;
2. definir o propósito, instruções e comportamento de cada agente;
3. **criar, anexar e evoluir skills** por agente, seguindo a lógica conceptual das Skills do ChatGPT;
4. executar esses agentes sobre inputs reais;
5. obter outputs operacionais consistentes e descarregáveis.

O **MVP** deve validar este modelo com um primeiro caso de uso concreto:
- **Agente de Planeamento DSC**
- Skill inicial: **DSC Rotas**
- Input: ficheiro Excel diário + instruções no chat
- Output: documentos Word finais prontos a imprimir, exatamente no padrão/template esperado, incluindo folhas de serviço por viatura e documento de serviços excluídos/remarcar.

---

## 2. Visão do produto

### 2.1 Problema

Hoje, criar agentes úteis e reutilizáveis exige demasiado trabalho manual:
- prompts dispersos;
- regras operacionais não estruturadas;
- outputs inconsistentes;
- dificuldade em reaproveitar lógica entre casos;
- ausência de uma camada de produto para “ensinar” skills a agentes e executá-las de forma controlada.

No caso DSC, existe já uma lógica operacional clara e repetível:
- regras de planeamento;
- regras de exclusão;
- exceções do dia;
- templates de output;
- necessidade de fidelidade documental.

Mas essa lógica ainda não está encapsulada num sistema de agentes e skills reutilizável.

### 2.2 Oportunidade

Criar uma plataforma que transforme “prompts e know-how operacional” em:
- **agentes persistentes**;
- **skills reutilizáveis**;
- **execuções rastreáveis**;
- **outputs padronizados**.

O primeiro valor do produto não é ser um “builder genérico de IA”.  
É ser um **sistema operacional para workflows inteligentes**, começando com DSC.

### 2.3 Visão

“Qualquer processo operacional recorrente deve poder ser encapsulado como uma combinação de:
- um agente,
- um conjunto de skills,
- inputs estruturados,
- outputs verificáveis.”

---

## 3. Objetivos do produto

### 3.1 Objetivo principal do MVP

Permitir que um utilizador interno:
1. crie um agente;
2. defina e associe skills ao agente;
3. execute uma skill sobre ficheiros reais;
4. receba outputs finais consistentes para download.

### 3.2 Objetivos específicos

#### Produto
- criar uma UX simples de gestão de agentes;
- suportar criação e edição de skills na plataforma;
- permitir execução de skills com inputs e instruções ad hoc;
- armazenar histórico de execuções.

#### IA
- usar OpenAI para raciocínio, interpretação de instruções e orquestração;
- permitir que skills tenham instruções formais no estilo ChatGPT.

#### Operação
- gerar documentos finais com fidelidade ao template;
- reduzir trabalho manual de planeamento;
- tornar a lógica de execução auditável.

---

## 4. Não-objetivos do MVP

Fora de âmbito nesta fase:
- sistema avançado de permissões/roles;
- colaboração multiutilizador em tempo real;
- marketplace público de skills;
- billing interno por uso;
- geocoding/mapeamento avançado em tempo real;
- estimativas logísticas de trânsito em tempo real;
- execução assíncrona complexa com filas distribuídas;
- integração com ERP/TMS legado;
- versionamento enterprise de prompts com branching sofisticado;
- publicação cross-workspace.

---

## 5. Utilizadores-alvo

### 5.1 Utilizador principal
**Equipa operacional interna**

Perfil esperado:
- quer resultados rápidos;
- não quer escrever código;
- precisa de controlar regras e exceções;
- trabalha com ficheiros, instruções e templates;
- valoriza outputs descarregáveis e consistentes.

### 5.2 Utilizador secundário
**Administrador de conhecimento / owner do processo**
- define regras;
- cria ou ajusta skills;
- testa resultados;
- mantém templates e referências.

No MVP, estes papéis podem existir implicitamente sem sistema formal de permissões.

---

## 6. Jobs to be Done

### JTBD principal
“Quando tenho um processo operacional recorrente com regras específicas e documentos finais obrigatórios, quero ensiná-lo a um agente com skills reutilizáveis para executar o processo com menos trabalho manual e mais consistência.”

### JTBD do caso DSC
“Quando recebo o ficheiro diário de serviços DSC, quero carregá-lo, aplicar instruções e exceções do dia, e obter as folhas de serviço Word e a lista de excluídos prontas a usar, sem reescrever tudo manualmente.”

---

## 7. Casos de uso do MVP

### 7.1 Gestão de agentes
- criar novo agente;
- editar nome, descrição, instruções-base;
- definir personalidade/objetivo do agente;
- associar skills ao agente;
- ativar/desativar skills.

### 7.2 Gestão de skills
- criar uma skill nova;
- editar a definição da skill;
- adicionar instruções;
- adicionar ficheiros de referência;
- adicionar templates;
- indicar schema de input/output;
- definir se a skill usa ficheiros;
- testar a skill.

### 7.3 Execução
- escolher agente;
- abrir sessão/chat de execução;
- anexar ficheiro(s);
- escrever instruções;
- escolher skill ou deixar seleção assistida;
- correr execução;
- obter outputs e logs.

### 7.4 Histórico
- ver execuções anteriores;
- rever inputs;
- descarregar outputs gerados;
- duplicar uma execução como base para nova execução.

---

## 8. Proposta de UX

### 8.1 Estrutura geral

#### Sidebar esquerda
- lista de agentes
- botão “Novo agente”
- pesquisa
- favoritos/recentes

#### Painel principal
Dependendo do contexto:
- **Vista do agente**
- **Editor de skill**
- **Sessão de execução**
- **Histórico**

### 8.2 Fluxo principal

#### A. Criar agente
1. clicar “Novo agente”
2. definir:
   - nome
   - descrição
   - objetivo
   - instruções-base
3. guardar

#### B. Criar skill
1. dentro do agente, clicar “Adicionar skill”
2. escolher:
   - criar do zero
   - duplicar skill existente
3. preencher:
   - nome
   - descrição
   - instruções
   - ficheiros de referência
   - templates/assets
4. guardar

#### C. Executar
1. abrir agente
2. iniciar nova execução
3. anexar Excel e outros ficheiros
4. escrever instruções do dia
5. selecionar skill DSC Rotas
6. correr
7. visualizar:
   - resumo textual
   - outputs gerados
   - DOCX para download
   - alertas

---

## 9. Princípios de design do produto

1. **Skill-first**  
   A unidade principal de reutilização é a skill.

2. **Agente como contentor de contexto**  
   O agente agrega objetivo, instruções persistentes e conjunto de skills.

3. **Execução rastreável**  
   Toda a execução deve guardar inputs, instruções, artefactos gerados e logs.

4. **Determinismo onde importa**  
   Geração de DOCX, parsing de ficheiros e aplicação de templates devem ter componentes o mais determinísticas possível.

5. **LLM para raciocínio, não para tudo**  
   O modelo decide, interpreta e estrutura. A camada de aplicação valida, persiste e monta outputs.

6. **Output profissional**  
   O sistema deve gerar documentos finais utilizáveis, não apenas texto intermédio.

---

## 10. Requisitos funcionais

### 10.1 Módulo de agentes

#### RF-01 Criar agente
O utilizador deve poder criar um agente com:
- nome
- descrição curta
- instruções-base
- idioma default
- categoria

#### RF-02 Editar agente
O utilizador deve poder alterar os dados do agente.

#### RF-03 Listar agentes
O sistema deve mostrar todos os agentes criados.

#### RF-04 Selecionar agente ativo
O utilizador deve poder abrir um agente e usá-lo.

---

### 10.2 Módulo de skills

#### RF-05 Criar skill
O utilizador deve poder criar uma skill com estrutura compatível com o modelo conceptual das Skills do ChatGPT:
- nome
- descrição
- instruções
- referências
- assets/templates
- configuração de input
- configuração de output

#### RF-06 Editar skill
O utilizador deve poder editar a skill sem recriá-la.

#### RF-07 Associar skill a agente
Uma skill pode ser anexada a um ou mais agentes.

#### RF-08 Ativar/desativar skill
Uma skill pode ficar ativa ou inativa para um agente.

#### RF-09 Testar skill
O utilizador deve poder correr uma skill em modo de teste com inputs controlados.

#### RF-10 Ver definição da skill
A plataforma deve expor a definição estruturada da skill.

---

### 10.3 Módulo de execução

#### RF-11 Criar execução
O utilizador deve poder iniciar uma execução num agente.

#### RF-12 Anexar ficheiros
A execução deve aceitar upload de ficheiros, incluindo Excel e DOCX.

#### RF-13 Instruções em linguagem natural
O utilizador deve poder escrever instruções complementares no chat.

#### RF-14 Seleção de skill
O sistema deve permitir:
- seleção manual de skill;
- opcionalmente, sugestão automática da skill adequada.

#### RF-15 Correr skill
A plataforma deve executar a skill com base em:
- contexto do agente;
- definição da skill;
- ficheiros anexados;
- instruções do utilizador.

#### RF-16 Produzir outputs descarregáveis
A execução deve devolver ficheiros finais para download.

#### RF-17 Guardar histórico
Cada execução deve ser guardada com estado, inputs, outputs e logs.

---

### 10.4 Módulo documental

#### RF-18 Templates DOCX
A plataforma deve permitir associar templates DOCX a uma skill.

#### RF-19 Geração de DOCX
A plataforma deve gerar documentos finais em `.docx`.

#### RF-20 Fidelidade de formato
O sistema deve preservar a estrutura documental e elementos do template, incluindo cabeçalho, título, secções e formatação esperada.

#### RF-21 Múltiplos outputs
Uma execução pode gerar vários ficheiros:
- várias folhas de serviço;
- documento de excluídos;
- eventualmente resumo.

---

### 10.5 Módulo de execução DSC Rotas

#### RF-22 Ler Excel diário
A skill DSC deve ler o ficheiro Excel diário.

#### RF-23 Identificar colunas críticas
A skill DSC deve identificar:
- RSAD
- Cliente
- Morada/Local
- Serviço a realizar
- flags e colunas auxiliares  
conforme a lógica da especificação.

#### RF-24 Aplicar regras de negócio
A skill DSC deve aplicar regras operacionais e exceções temporárias recebidas no chat.

#### RF-25 Produzir resumo operacional
Antes dos ficheiros finais, a skill deve devolver um resumo do tipo:
- total de linhas
- quantos entram
- quantos ficam de fora
- principais motivos de exclusão.

#### RF-26 Gerar folhas de serviço por viatura
A skill DSC deve gerar um DOCX por viatura.

#### RF-27 Gerar documento de excluídos
A skill DSC deve gerar um DOCX com serviços a remarcar.

#### RF-28 Preservar campos críticos
Cliente e Serviço devem respeitar a transcrição fiel das colunas definidas na especificação.

---

## 11. Requisitos não funcionais

#### RNF-01 Simplicidade de uso
Um utilizador não técnico deve conseguir criar um agente e executar uma skill sem suporte técnico.

#### RNF-02 Tempo de resposta
No MVP, uma execução simples deve devolver resultado em tempo aceitável para uso operacional.  
Meta inicial: experiência responsiva, com feedback progressivo e estado visível.

#### RNF-03 Confiabilidade documental
Os ficheiros DOCX gerados devem abrir corretamente em Microsoft Word.

#### RNF-04 Auditabilidade
Cada execução deve ser reconstituível:
- que ficheiros entraram;
- que instruções foram dadas;
- que versão da skill correu;
- que outputs saíram.

#### RNF-05 Modularidade
A arquitetura deve permitir adicionar novos tipos de skill sem reescrever o core.

#### RNF-06 Segurança mínima
Uploads, outputs e definições de skills devem ficar restritos ao ambiente interno.

---

## 12. Modelo conceptual do produto

### 12.1 Entidades principais

#### Agent
Representa um agente configurável.
Campos:
- id
- name
- description
- system_instructions
- default_language
- status
- created_at
- updated_at

#### Skill
Representa uma skill reutilizável.
Campos:
- id
- name
- description
- skill_definition
- input_schema
- output_schema
- version
- status
- created_at
- updated_at

#### AgentSkill
Associação entre agente e skill.
Campos:
- id
- agent_id
- skill_id
- enabled
- priority

#### SkillAsset
Ficheiros associados a uma skill.
Campos:
- id
- skill_id
- type
- file_url
- file_name
- mime_type

#### Execution
Execução concreta.
Campos:
- id
- agent_id
- selected_skill_id
- user_prompt
- status
- summary
- raw_model_output
- created_at
- completed_at

#### ExecutionFile
Ficheiros de input/output.
Campos:
- id
- execution_id
- role (input/output/reference)
- file_url
- file_name
- mime_type

#### SkillVersion
Versão imutável da definição de skill.
Campos:
- id
- skill_id
- version_number
- definition_snapshot
- created_at

---

## 13. Forma recomendada de modelar uma skill

Como queres algo “igual ao ChatGPT” a nível conceptual, a plataforma deve tratar uma skill como um objeto com esta estrutura:

### 13.1 Skill object

#### Metadata
- skill_name
- display_name
- description
- category
- tags

#### Triggering / When to use
- sinais de ativação
- tipos de input esperados
- condições de uso

#### Instructions
- instruções principais
- workflow
- regras
- constraints
- fallbacks

#### Resources
- referências markdown
- exemplos
- schemas

#### Assets
- DOCX templates
- exemplos de output
- logos
- ficheiros auxiliares

#### Tools / Execution config
- parser excel
- docx generator
- llm reasoning
- validator

#### I/O schema
- accepted file types
- required fields
- generated artifacts

---

## 14. Arquitetura funcional recomendada

### 14.1 Componentes

#### Frontend
Responsável por:
- gestão de agentes
- gestão de skills
- chat/execução
- upload/download
- histórico

#### Backend API
Responsável por:
- autenticação simples interna
- CRUD de agentes e skills
- gestão de execuções
- orquestração de pipeline
- persistência

#### LLM Orchestrator
Responsável por:
- montar prompt/runtime
- injetar instruções do agente
- injetar definição da skill
- interpretar outputs do modelo
- chamar passos determinísticos

#### File Processing Layer
Responsável por:
- leitura de Excel
- parsing de documentos
- armazenamento temporário
- gestão de templates DOCX
- geração de outputs

#### Storage
Responsável por:
- base de dados
- object storage para ficheiros
- versionamento de skill definitions

---

## 15. Arquitetura técnica recomendada

Tendo em conta que queres implementar isto rapidamente via vibe coding, a recomendação é uma stack simples e produtiva.

### 15.1 Stack sugerida

#### Frontend
- Next.js
- React
- Tailwind
- componentes UI simples

#### Backend
- Next.js API routes ou backend separado leve
- Node.js/TypeScript

#### Persistência
- Postgres
- ORM simples (Prisma, por exemplo)

#### Storage de ficheiros
- Google Cloud Storage ou storage compatível

#### LLM
- OpenAI API

#### Processamento documental
- biblioteca DOCX / templating DOCX
- parser Excel
- opcionalmente Python workers só para tarefas documentais mais sensíveis

### 15.2 Nota sobre “Google Antigravity”
Como descreves isso como plataforma de vibe coding da Google, o PRD deve manter isto flexível:
- frontend e backend podem ser gerados/iterados nessa plataforma;
- a arquitetura não deve depender de features proprietárias dela;
- ela entra como **acelerador de desenvolvimento**, não como dependência estrutural do produto.

---

## 16. Fluxo técnico de execução

### 16.1 Fluxo genérico
1. utilizador escolhe agente
2. inicia execução
3. anexa ficheiros
4. envia instruções
5. seleciona skill
6. backend cria execution record
7. sistema resolve a versão ativa da skill
8. runtime monta contexto:
   - instruções base do agente
   - definição da skill
   - referências
   - assets relevantes
   - inputs
9. pipeline processa ficheiros
10. LLM interpreta e estrutura plano
11. camada determinística gera outputs
12. outputs são guardados
13. utilizador descarrega ficheiros

---

## 17. Fluxo funcional do skill DSC Rotas

### 17.1 Inputs
- Excel diário
- instruções do chat
- template(s) DOCX
- eventual configuração do agente

### 17.2 Passos do workflow
1. ler Excel
2. validar estrutura
3. mapear colunas
4. identificar linhas válidas
5. aplicar exceções do dia
6. organizar lógica de rota
7. identificar serviços excluídos
8. gerar resumo textual
9. gerar DOCX por viatura
10. gerar DOCX de excluídos
11. disponibilizar outputs

### 17.3 Regras nucleares
A implementação deve refletir as regras do documento da skill, incluindo:
- base operacional Porto Alto;
- regras de saída/jornada/regresso;
- limite de condução;
- tempo mínimo por paragem;
- restrições horárias por cliente;
- critérios de exequibilidade;
- regras de exclusão e reagendamento;
- preservação fiel de Cliente e Serviço a realizar.

---

## 18. Estratégia de execução da skill DSC no MVP

### 18.1 Divisão ideal entre LLM e lógica determinística

#### LLM faz
- interpretar instruções do dia;
- inferir ambiguidades controladas;
- aplicar raciocínio operacional;
- justificar exclusões;
- estruturar plano final da rota;
- gerar resumo textual.

#### Camada determinística faz
- ler Excel;
- mapear colunas;
- validar campos obrigatórios;
- montar estrutura de dados;
- preencher DOCX;
- exportar ficheiros;
- guardar outputs.

### 18.2 Porque isto importa
Se deixares a geração documental e parte da validação toda no modelo, arriscas:
- inconsistência;
- alucinação de campos;
- DOCX partidos;
- outputs menos reprodutíveis.

---

## 19. Especificação detalhada do MVP

### 19.1 Epic A — Agent Builder

#### Feature A1 — Lista de agentes
Critérios de aceitação:
- mostrar agentes existentes;
- criar novo agente;
- abrir agente ao clicar.

#### Feature A2 — Editor de agente
Critérios:
- editar nome;
- editar descrição;
- editar instruções base;
- guardar alterações.

---

### 19.2 Epic B — Skill Builder

#### Feature B1 — Criar skill
Critérios:
- criar nova skill;
- guardar metadata;
- editar instruções;
- associar assets.

#### Feature B2 — Estrutura estilo ChatGPT
Critérios:
- skill deve ter separação clara entre metadata, description, instructions, assets e I/O;
- skill deve ser reutilizável entre agentes;
- skill deve poder evoluir por versões.

#### Feature B3 — Upload de assets
Critérios:
- permitir upload de templates DOCX;
- permitir anexar exemplos e referências;
- listar assets anexados.

---

### 19.3 Epic C — Execution Workspace

#### Feature C1 — Sessão de execução
Critérios:
- interface tipo chat;
- upload de ficheiros;
- escolha de skill;
- botão executar.

#### Feature C2 — Resultado
Critérios:
- mostrar resumo textual;
- mostrar lista de outputs;
- permitir download de todos os DOCX.

---

### 19.4 Epic D — Histórico

#### Feature D1 — Histórico de execuções
Critérios:
- listar execuções por agente;
- estado (running, completed, failed);
- data/hora;
- skill usada.

#### Feature D2 — Detalhe de execução
Critérios:
- mostrar instruções;
- mostrar inputs;
- mostrar outputs;
- permitir repetir execução.

---

### 19.5 Epic E — Skill DSC Rotas

#### Feature E1 — Parsing Excel
Critérios:
- aceitar ficheiro Excel;
- identificar colunas relevantes;
- assinalar ambiguidades.

#### Feature E2 — Aplicação de regras
Critérios:
- aplicar regras operacionais standard;
- aceitar exceções temporárias do chat;
- não promover exceções a permanentes.

#### Feature E3 — Geração DOCX
Critérios:
- gerar uma folha de serviço por viatura;
- gerar documento de excluídos;
- respeitar o formato alvo.

---

## 20. User stories

### Agent management
- Como utilizador operacional, quero criar um agente para encapsular um processo recorrente.
- Como utilizador, quero editar as instruções-base de um agente para ajustar o seu comportamento.

### Skill management
- Como utilizador, quero criar uma skill reutilizável para um workflow específico.
- Como utilizador, quero anexar templates DOCX a uma skill para garantir consistência documental.
- Como utilizador, quero ensinar regras específicas à skill para que ela aja sempre do mesmo modo.

### Execution
- Como utilizador, quero carregar um Excel e dar instruções em linguagem natural.
- Como utilizador, quero que o agente execute a skill correta.
- Como utilizador, quero descarregar os DOCX finais.

### Traceability
- Como utilizador, quero rever uma execução passada para perceber porque certos serviços ficaram excluídos.
- Como owner do processo, quero saber que versão da skill foi usada numa execução.

---

## 21. Critérios de aceitação globais do MVP

O MVP é considerado bem-sucedido se permitir:

1. criar pelo menos 1 agente sem intervenção técnica;
2. criar e editar pelo menos 1 skill;
3. anexar assets a essa skill;
4. correr uma execução com Excel + instruções;
5. gerar múltiplos ficheiros DOCX para download;
6. guardar histórico da execução;
7. repetir a execução com pequenas alterações;
8. demonstrar o caso DSC ponta-a-ponta.

---

## 22. KPIs do MVP

### Produto
- nº de agentes criados
- nº de skills criadas
- nº de execuções por semana
- taxa de execuções concluídas com sucesso

### Operação
- tempo médio desde upload até output
- % de execuções que exigem edição manual posterior
- % de outputs aceites sem retrabalho
- redução do tempo operacional por planeamento

### Qualidade
- taxa de falhas documentais
- taxa de campos críticos incorretos
- nº de exclusões sem justificação válida

---

## 23. Riscos e mitigação

### Risco 1 — Skills demasiado livres
Se as skills forem só prompts soltos, a plataforma degrada-se.  
**Mitigação:** impor estrutura mínima obrigatória da skill.

### Risco 2 — DOCX inconsistentes
Gerar Word “bonito” mas inconsistente é um risco elevado.  
**Mitigação:** geração por pipeline determinístico com template binding.

### Risco 3 — Excel com estrutura variável
Os ficheiros reais podem variar.  
**Mitigação:** camada de mapeamento e validação antes do LLM.

### Risco 4 — Alucinação de campos
O modelo pode inventar Cliente/Serviço.  
**Mitigação:** bloquear transcrição via pipeline e validar contra input.

### Risco 5 — Complexidade excessiva da plataforma no MVP
Tentar fazer marketplace/versionamento avançado cedo demais pode atrasar.  
**Mitigação:** focar em CRUD simples + execução + histórico.

### Risco 6 — Dependência excessiva do modelo
Se tudo depender do LLM, o sistema fica frágil.  
**Mitigação:** separar raciocínio de produção documental.

---

## 24. Roadmap recomendado

### Fase 1 — Core platform
- lista de agentes
- criar/editar agente
- criar/editar skill
- upload de assets
- execução simples
- histórico base

### Fase 2 — Skill DSC completa
- parser Excel
- runtime DSC
- DOCX por viatura
- DOCX excluídos
- validações
- resumo operacional

### Fase 3 — Robustez
- versionamento de skill
- duplicar skill
- repetir execução
- melhoria de logs
- comparação entre execuções

### Fase 4 — Escala interna
- biblioteca de skills
- templates por skill
- publicação entre agentes
- permissões leves
- integrações extra

---

## 25. Recomendação de implementação prática

### 25.1 Começar pelo vertical slice
Não comeces pelo “builder universal”.  
Começa por um fluxo completo que prove a plataforma:

**Agente:** Planeamento DSC  
**Skill:** DSC Rotas  
**Input:** Excel + instruções  
**Output:** DOCX finais

Se este vertical slice funcionar, o resto da plataforma torna-se generalização.

### 25.2 Sequência ideal de construção

#### Sprint 1
- modelo de dados
- CRUD de agentes
- CRUD de skills
- upload de assets

#### Sprint 2
- execution workspace
- guardar execuções
- integração OpenAI
- montagem de runtime

#### Sprint 3
- parser Excel DSC
- regras mínimas
- JSON intermédio estruturado

#### Sprint 4
- geração DOCX
- download
- validação final
- hardening

---

## 26. Exemplo de definição mínima de skill no produto

```yaml
name: dsc-rotas
display_name: DSC Rotas
description: Lê um Excel diário de serviços DSC, aplica regras operacionais e exceções do dia, organiza serviços por rota e gera folhas de serviço e documento de excluídos em DOCX.
category: operations
input_types:
  - xlsx
  - text_instructions
output_types:
  - docx
  - summary
required_assets:
  - folha_servico_template.docx
  - excluidos_template.docx
```

Depois, no corpo:
- instruções
- workflow
- regras
- campos protegidos
- formato de output

---

## 27. Decisões abertas que ainda recomendo fechar na implementação

Mesmo sem bloquear o PRD, há 5 decisões que convém fixar logo no build:
1. se cada skill terá editor livre ou editor com campos estruturados;
2. se os assets ficam por skill ou também por agente;
3. se a execução usa sempre skill manual ou pode haver auto-routing;
4. se o histórico guarda só ficheiros finais ou também snapshots intermédios;
5. se o engine documental será Node-only ou Node + Python worker.

A minha recomendação para o MVP:
- **editor híbrido**: campos estruturados + instructions livres;
- **assets por skill**;
- **seleção manual da skill**;
- **guardar outputs finais + snapshot do plano**;
- **Node-first**, só introduzir Python se o DOCX exigir.

---

## 28. Definição de sucesso do MVP

O MVP está validado quando um utilizador interno consegue, sem código:
- criar o agente DSC,
- associar a skill DSC Rotas,
- carregar o Excel diário,
- dar instruções do dia,
- executar,
- receber os DOCX finais corretos para download.

---

## 29. Próximo passo recomendado

O passo mais útil agora é transformar este PRD em **especificação de build pronta para vibe coding**, dividida em:
- arquitetura de páginas;
- schema de base de dados;
- componentes UI;
- endpoints;
- objetos TypeScript;
- fluxo de execução;
- backlog priorizado por sprint.

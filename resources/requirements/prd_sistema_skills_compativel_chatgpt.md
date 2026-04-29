# PRD — Sistema de Skills Compatível com ChatGPT

## 1. Resumo executivo

Construir um **Skill System** dentro da plataforma de agentes que replique o mais possível a lógica de funcionamento das Skills do ChatGPT.

O sistema deve permitir que uma skill seja:
- uma unidade reutilizável de capacidade;
- acoplável a um ou mais agentes;
- composta por **instruções, assets, referências, scripts e metadados**;
- versionável;
- testável;
- executável sobre inputs reais;
- importável/exportável num formato compatível com o paradigma de skills do ChatGPT.

O objetivo é que a tua plataforma não tenha “prompts soltos”, mas sim um **runtime de skills** com comportamento previsível, modular e transportável.

---

## 2. Objetivo do produto

### 2.1 Objetivo principal
Permitir que skills na tua plataforma funcionem com a mesma lógica conceptual das Skills do ChatGPT:
- **discovery**
- **triggering**
- **loading progressivo**
- **execução orientada por instruções**
- **uso de assets e referências**
- **scripts opcionais**
- **empacotamento portável**

### 2.2 Objetivos secundários
- permitir criar skills visualmente dentro da plataforma;
- permitir editar skills como ficheiros estruturados;
- permitir testar skills isoladamente;
- permitir importação de skills já feitas para ChatGPT;
- permitir reutilização da mesma skill em vários agentes;
- permitir governança, versões e histórico.

---

## 3. Problema a resolver

Hoje, a maioria das plataformas de “custom agents” implementa skills como:
- prompts longos;
- automações ad hoc;
- funções acopladas ao agente;
- lógica não reutilizável;
- assets dispersos;
- sem packaging standard.

Isso dificulta:
- reaproveitamento;
- manutenção;
- transporte entre sistemas;
- clareza de triggering;
- previsibilidade de execução.

Tu queres um sistema em que a skill seja um **artefacto de produto completo**, semelhante ao ChatGPT:
- com estrutura própria;
- com regras de uso;
- com recursos anexos;
- com runtime claro;
- com possibilidade de ser criada nativamente ou importada.

---

## 4. Visão

“Uma skill deve funcionar como um pacote portável de capacidade que ensina um agente a executar uma tarefa específica, com instruções, recursos, ferramentas e outputs previsíveis.”

---

## 5. Princípios do sistema de skills

### 5.1 Skill-first architecture
A skill é a unidade primária de comportamento reutilizável.

### 5.2 Compatibilidade conceptual com ChatGPT
O sistema deve seguir a mesma filosofia:
- skill descoberta por metadata;
- instruções nucleares em ficheiro principal;
- recursos auxiliares carregados apenas quando necessário;
- assets separados do raciocínio;
- scripts usados apenas quando acrescentam fiabilidade.

### 5.3 Separation of concerns
- **Agente** = contexto, missão, personalidade, conjunto de skills
- **Skill** = capacidade específica e reutilizável
- **Execução** = aplicação concreta de skill + inputs + contexto

### 5.4 Progressive loading
Nem todo o conteúdo da skill deve entrar no contexto logo à partida. O runtime deve carregar:
1. metadata primeiro;
2. instruções principais quando a skill é selecionada;
3. referências/scripts/assets apenas quando necessário.

### 5.5 Determinismo quando necessário
Se a skill precisar de:
- parsing,
- cálculos,
- geração DOCX,
- transformação estrutural,
então deve poder usar scripts determinísticos.

### 5.6 Portabilidade
Uma skill deve poder ser:
- criada no teu sistema;
- exportada como pacote;
- importada de uma skill externa com estrutura semelhante.

---

## 6. Definição de skill

### 6.1 Definição funcional
Uma skill é um **pacote reutilizável de instruções e recursos** que ensina um agente a executar uma tarefa específica de forma consistente.

### 6.2 O que uma skill pode conter
Uma skill pode conter:
- instruções principais;
- descrição de triggering;
- exemplos;
- referências;
- templates;
- assets;
- scripts;
- configuração de input/output;
- validações;
- regras de execução.

### 6.3 O que uma skill não é
Uma skill não deve ser:
- só um prompt;
- só uma função de código;
- só um template;
- só um workflow hardcoded no agente.

---

## 7. Objetivos funcionais do sistema de skills

O sistema deve permitir:

1. criar uma skill do zero;
2. importar uma skill existente;
3. editar skill de forma visual e/ou em ficheiros;
4. associar skills a agentes;
5. definir triggering e when-to-use;
6. anexar assets e referências;
7. anexar scripts;
8. validar a skill;
9. versionar a skill;
10. testar a skill;
11. executar a skill em produção;
12. exportar a skill.

---

## 8. Estrutura lógica compatível com ChatGPT

### 8.1 Modelo alvo

A plataforma deve adotar uma estrutura semelhante a esta:

```text
skill-name/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── scripts/
├── references/
└── assets/
```

### 8.2 Significado de cada parte

#### SKILL.md
Ficheiro principal da skill.  
Contém:
- frontmatter
- nome
- descrição
- instruções de comportamento
- referência a outros recursos

#### agents/openai.yaml
Metadados de apresentação/UI.

#### scripts/
Lógica executável opcional.

#### references/
Documentação auxiliar a ser carregada apenas quando necessário.

#### assets/
Ficheiros usados na execução ou output:
- templates DOCX
- imagens
- logos
- exemplos
- boilerplates

---

## 9. Requisitos de compatibilidade

### 9.1 Compatibilidade mínima obrigatória
A plataforma deve conseguir representar skills com estes conceitos:
- `name`
- `description`
- `SKILL.md`
- `agents/openai.yaml`
- `scripts/`
- `references/`
- `assets/`

### 9.2 Compatibilidade de comportamento
A skill deve poder ser usada como no ChatGPT:
- descoberta por metadata;
- selecionada pelo runtime;
- instruções carregadas progressivamente;
- recursos usados apenas quando relevantes.

### 9.3 Compatibilidade de packaging
A skill deve ser importável/exportável como bundle único, idealmente zipado.

### 9.4 Compatibilidade de edição
A platform deve suportar duas formas:
- **editor visual**
- **editor raw file-based**

---

## 10. Componentes do Skill System

### 10.1 Skill Registry
Responsável por:
- listar skills;
- indexar metadata;
- permitir pesquisa;
- gerir estado da skill;
- gerir associação a agentes.

### 10.2 Skill Builder
Interface de criação/edição de skill.

### 10.3 Skill Validator
Valida:
- estrutura;
- campos obrigatórios;
- coerência;
- referências quebradas;
- assets em falta;
- scripts inválidos.

### 10.4 Skill Packager
Cria bundle de exportação.

### 10.5 Skill Importer
Lê skill externa e converte para modelo interno.

### 10.6 Skill Runtime
Resolve:
- seleção da skill;
- carregamento progressivo;
- execução;
- acesso a scripts/resources/assets;
- produção de outputs.

### 10.7 Skill Versioning
Guarda versões publicadas e snapshots usados em execuções.

---

## 11. Ciclo de vida de uma skill

### 11.1 Estados
Cada skill deve ter estados como:
- Draft
- Validated
- Published
- Deprecated
- Archived

### 11.2 Ciclo
1. Create
2. Edit
3. Validate
4. Test
5. Publish
6. Attach to agents
7. Execute
8. Iterate
9. Deprecate

---

## 12. Fluxo de criação de skill

### 12.1 Criar do zero
O utilizador define:
- nome técnico;
- display name;
- descrição;
- when to use;
- instruções;
- inputs esperados;
- outputs esperados;
- assets;
- referências;
- scripts opcionais.

### 12.2 Criar a partir de template
O utilizador pode começar com:
- skill vazia;
- template documental;
- template analítico;
- template workflow;
- skill duplicada.

### 12.3 Criar a partir de import
O utilizador pode importar:
- zip de skill;
- estrutura de ficheiros;
- skill exportada previamente.

---

## 13. Requisitos do editor de skill

### 13.1 Editor híbrido
O editor deve ter:
- modo formulário estruturado;
- modo ficheiro/raw.

### 13.2 Campos obrigatórios
- skill name
- display name
- description
- instructions
- status
- version

### 13.3 Campos recomendados
- triggers
- examples
- accepted inputs
- generated outputs
- tags
- references
- assets
- scripts

### 13.4 Editor de ficheiros
A skill deve poder ser editada por ficheiro:
- `SKILL.md`
- `openai.yaml`
- ficheiros em `references/`
- ficheiros em `scripts/`

---

## 14. PRD funcional do `SKILL.md`

### 14.1 Papel do SKILL.md
É o entrypoint da skill.  
É o ficheiro principal lido pelo runtime quando a skill é ativada.

### 14.2 Estrutura
Deve conter:
1. frontmatter YAML
2. body em markdown

### 14.3 Frontmatter mínimo
```yaml
name: dsc-rotas
description: skill para ler um excel diário de serviços DSC, aplicar regras operacionais, organizar rotas, gerar folhas de serviço e documento de excluídos. usar quando o utilizador quer transformar um ficheiro operacional em outputs docx consistentes.
```

### 14.4 Regras do frontmatter
- `name` em lowercase;
- sem campos arbitrários no núcleo compatível;
- `description` deve servir de trigger principal.

### 14.5 Body
O body deve conter:
- instruções operacionais;
- workflow;
- regras;
- referências a outros ficheiros;
- instruções sobre scripts e assets.

---

## 15. Triggering e discovery

### 15.1 Como deve funcionar
O runtime deve decidir se uma skill é relevante com base em:
- descrição da skill;
- tags;
- tipo de input;
- intenções do utilizador;
- contexto do agente.

### 15.2 Modos de triggering

#### Manual
O utilizador escolhe a skill.

#### Assisted
O sistema sugere skills.

#### Automatic
O runtime ativa a skill com base no matching.

### 15.3 Para o MVP
Recomendação:
- manual + assisted
- não automático puro na primeira versão

---

## 16. Progressive loading

### 16.1 Fases de loading

#### Fase 1 — Metadata load
Carregar apenas:
- name
- description
- tags
- accepted input types

#### Fase 2 — Core load
Se skill for selecionada:
- carregar `SKILL.md`

#### Fase 3 — Conditional load
Se necessário:
- carregar references específicas
- carregar scripts
- resolver assets

### 16.2 Porque isto é obrigatório
Sem progressive loading:
- skills grandes vão poluir contexto;
- runtime fica caro;
- piora precisão.

---

## 17. Recursos da skill

### 17.1 References
Usadas para conhecimento auxiliar.
Exemplos:
- regras de negócio
- schemas
- glossários
- exemplos de output

### 17.2 Assets
Usados para output ou apoio material.
Exemplos:
- DOCX templates
- logos
- imagens
- boilerplates

### 17.3 Scripts
Usados quando texto não basta.
Exemplos:
- parser Excel
- gerador DOCX
- transformações determinísticas
- validadores

---

## 18. Runtime de skill

### 18.1 Inputs do runtime
- agent context
- selected skill
- user message
- attached files
- execution config
- tool availability

### 18.2 Passos do runtime
1. resolver skill
2. carregar metadata
3. carregar `SKILL.md`
4. identificar referências adicionais necessárias
5. montar contexto
6. decidir se usa scripts
7. executar pipeline
8. recolher outputs
9. persistir logs e artefactos

### 18.3 Outputs do runtime
- resposta textual
- structured output
- ficheiros gerados
- logs
- execution trace
- error report

---

## 19. Scripts dentro da skill

### 19.1 Quando usar scripts
Scripts devem existir quando:
- o processo é frágil;
- a precisão importa;
- há manipulação documental/estrutural;
- a mesma transformação seria repetida várias vezes.

### 19.2 Quando não usar scripts
Não usar scripts para:
- transformação simples de texto;
- análise sem necessidade de computação externa;
- tarefas que o modelo resolve melhor diretamente.

### 19.3 Requisitos dos scripts
Cada script deve:
- ter interface clara;
- ser chamável pelo runtime;
- ter logs mínimos;
- falhar de forma explícita;
- devolver output previsível.

---

## 20. Modelo de dados do subsistema de skills

### 20.1 Skill
- id
- slug
- display_name
- description
- status
- current_version_id
- created_at
- updated_at

### 20.2 SkillVersion
- id
- skill_id
- version_number
- skill_md_content
- openai_yaml_content
- manifest_json
- created_at
- created_by

### 20.3 SkillFile
- id
- skill_version_id
- path
- type
- mime_type
- content_ref
- checksum

### 20.4 SkillAgentBinding
- id
- skill_id
- agent_id
- enabled
- priority
- configuration_override

### 20.5 SkillExecutionLog
- id
- execution_id
- skill_version_id
- loading_trace
- scripts_called
- outputs_generated
- errors

---

## 21. Importação de skills

### 21.1 Objetivo
Permitir importar skills feitas noutros contextos, especialmente skills criadas diretamente no ChatGPT.

### 21.2 Formatos suportados
- `.zip`
- diretório estruturado
- eventualmente repositório

### 21.3 Processo de import
1. upload do pacote
2. inspeção da estrutura
3. localizar `SKILL.md`
4. localizar `agents/openai.yaml`
5. indexar `scripts/`, `references/`, `assets/`
6. validar
7. criar representação interna
8. mostrar relatório de compatibilidade

### 21.4 Relatório de import
Deve indicar:
- ficheiros encontrados;
- incompatibilidades;
- campos faltantes;
- scripts não suportados;
- assets em falta;
- se a skill ficou pronta ou precisa adaptação.

---

## 22. Exportação de skills

### 22.1 Objetivo
Permitir que uma skill criada na tua plataforma possa sair como pacote portável.

### 22.2 Conteúdo do export
- `SKILL.md`
- `agents/openai.yaml`
- `scripts/`
- `references/`
- `assets/`
- manifest interno opcional

### 22.3 Regras
- estrutura consistente;
- paths preservados;
- versão congelada;
- zip único.

---

## 23. Validação de skill

### 23.1 O que validar
- presença de `SKILL.md`;
- frontmatter válido;
- `name` e `description`;
- coerência de paths;
- existência de assets referidos;
- existência de references referidas;
- integridade dos scripts;
- tamanho total;
- conflitos de nome.

### 23.2 Níveis de validação

#### Structural validation
A skill está bem formada?

#### Runtime validation
A skill consegue ser executada?

#### Compatibility validation
A skill respeita o modelo compatível?

---

## 24. Teste de skill

### 24.1 Modos de teste

#### Unit test
Testar partes da skill:
- parsing
- script
- output

#### Dry run
Simular execução sem efeitos finais.

#### Full run
Executar skill de ponta a ponta.

### 24.2 Test harness
Cada skill deve poder ter:
- sample inputs
- expected outputs
- test prompts

---

## 25. Versionamento

### 25.1 Requisitos
Cada publicação de skill deve criar uma nova versão imutável.

### 25.2 O que versionar
- `SKILL.md`
- metadados
- references
- assets
- scripts
- config

### 25.3 Regras
- execuções antigas apontam para a versão usada;
- editar draft não altera execuções passadas;
- rollback deve ser possível.

---

## 26. Associação entre agente e skill

### 26.1 Papel da associação
Uma skill existe autonomamente, mas pode ser ligada a agentes.

### 26.2 O binding deve permitir
- enable/disable;
- prioridade;
- overrides locais;
- exposição ao utilizador.

### 26.3 Override por agente
Um agente pode sobrescrever:
- prompt introdutório;
- parâmetros default;
- assets opcionais;
- visibilidade.

Mas não deve partir a portabilidade da skill.

---

## 27. Governança

### 27.1 Princípios
- skill é reusável;
- skill tem owner;
- skill pode ser publicada ou retirada;
- skill deve ter changelog.

### 27.2 Metadados de governança
- owner
- team
- created_by
- updated_by
- published_at
- deprecated_at

---

## 28. Segurança e isolamento

### 28.1 Requisitos
- assets privados não devem ser expostos fora da skill;
- scripts devem correr em ambiente controlado;
- imports devem ser validados;
- execuções devem ficar auditadas.

### 28.2 Scripts
Scripts não devem correr arbitrariamente sem validação do runtime.

---

## 29. UX do subsistema de skills

### 29.1 Vistas principais
- Skill Library
- Skill Editor
- Skill Import
- Skill Test
- Skill Versions
- Skill Usage/Analytics

### 29.2 Skill Editor tabs
- Overview
- Instructions
- References
- Assets
- Scripts
- Inputs/Outputs
- Test
- Versions

### 29.3 Skill detail page
Deve mostrar:
- descrição
- estado
- versão atual
- agentes que usam
- últimos testes
- últimas execuções

---

## 30. Requisitos funcionais detalhados

### RF-01 Criar skill
O utilizador pode criar uma skill vazia.

### RF-02 Editar `SKILL.md`
O utilizador pode editar o ficheiro principal.

### RF-03 Editar metadata
O utilizador pode editar nome, descrição, tags e estado.

### RF-04 Adicionar references
O utilizador pode anexar ficheiros de referência.

### RF-05 Adicionar assets
O utilizador pode anexar templates e outros assets.

### RF-06 Adicionar scripts
O utilizador pode anexar scripts executáveis.

### RF-07 Validar skill
O sistema valida antes de publicar.

### RF-08 Publicar skill
O utilizador publica uma versão.

### RF-09 Testar skill
O utilizador corre testes.

### RF-10 Importar skill
O utilizador importa um pacote externo.

### RF-11 Exportar skill
O utilizador exporta uma skill.

### RF-12 Associar a agente
O utilizador liga uma skill a um agente.

### RF-13 Executar skill
O runtime consegue usar a skill numa execução.

### RF-14 Ver versões
O utilizador consegue navegar versões.

### RF-15 Duplicar skill
O utilizador pode criar uma derivação.

---

## 31. Requisitos não funcionais

### RNF-01 Compatibilidade estrutural
A estrutura deve espelhar o paradigma de ChatGPT skills.

### RNF-02 Portabilidade
Uma skill deve viajar entre ambientes com pouca adaptação.

### RNF-03 Observabilidade
Execução e loading devem ser rastreáveis.

### RNF-04 Robustez
Erros em references/scripts/assets devem ser explícitos.

### RNF-05 Escalabilidade contextual
Progressive loading deve evitar context bloat.

### RNF-06 Auditabilidade
Cada execução deve indicar a versão exata da skill usada.

---

## 32. KPIs do sistema de skills

- nº de skills criadas
- nº de skills importadas com sucesso
- % de skills validadas sem erro
- % de execuções bem-sucedidas por skill
- tempo médio de criação/publicação
- tempo médio de importação
- % de skills reutilizadas por mais de um agente
- taxa de falha de scripts
- taxa de rollback por versão

---

## 33. Riscos

### Risco 1
Criar só uma “simulação visual” de skill e não uma skill real.  
**Mitigação:** skill como pacote com ficheiros reais.

### Risco 2
Compatibilidade superficial com ChatGPT.  
**Mitigação:** espelhar estrutura, lifecycle e progressive loading.

### Risco 3
Excesso de liberdade no editor.  
**Mitigação:** validação forte + estrutura mínima obrigatória.

### Risco 4
Scripts quebram portabilidade.  
**Mitigação:** manifest de compatibilidade e relatório de import.

### Risco 5
Imports falham silenciosamente.  
**Mitigação:** relatório claro de compatibilidade.

---

## 34. Roadmap recomendado

### Fase 1 — Core compatibility
- modelo de dados
- `SKILL.md`
- `openai.yaml`
- skill library
- skill editor
- validator básico
- binding agente-skill

### Fase 2 — Runtime
- loading progressivo
- execução com references/assets
- logs
- testing harness

### Fase 3 — Portabilidade
- import zip
- export zip
- compatibility report
- version snapshots

### Fase 4 — Maturidade
- assisted triggering
- analytics
- reusable templates
- diff entre versões
- governance avançada

---

## 35. Definição de sucesso

O subsistema de skills é bem-sucedido quando:
1. uma skill criada na plataforma se comporta como unidade autónoma reutilizável;
2. a skill pode ser anexada a vários agentes;
3. o runtime usa metadata + `SKILL.md` + recursos de forma progressiva;
4. a skill pode ser validada, testada e versionada;
5. a skill pode ser exportada;
6. uma skill criada no ChatGPT pode ser importada com adaptação mínima.

---

## 36. Recomendação final de produto

A decisão certa aqui é:

**não modelar skills como “campos numa tabela”, mas como pacotes reais com ficheiros reais**, com uma camada de produto por cima para:
- editar;
- validar;
- testar;
- publicar;
- executar;
- importar/exportar.

Ou seja:
- **internamente**, a skill deve existir como bundle estruturado;
- **na interface**, o utilizador vê um builder amigável;
- **no runtime**, o sistema trata a skill como pacote portável.

Isso é o que te aproxima verdadeiramente da lógica do ChatGPT, e é o que te vai permitir importar skills no futuro sem teres de reinventar tudo.

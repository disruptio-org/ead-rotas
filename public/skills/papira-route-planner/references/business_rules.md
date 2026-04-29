# skill-spec-dsc-rotas

## Objetivo

Criar uma skill para planeamento operacional DSC que:
- lê um ficheiro Excel diário de serviços;
- organiza serviços em rotas eficientes por viatura;
- valida exequibilidade com regras operacionais rígidas;
- gera folhas de serviço em Word prontas a imprimir;
- lista separadamente os serviços excluídos / a reagendar;
- aceita instruções excecionais dadas em linguagem natural no chat.

A skill deve privilegiar **execução real no terreno**, não apenas otimização teórica.

---

## Âmbito da skill

A skill deve cobrir:

1. **Planeamento de rotas DSC**
2. **Balanceamento de carga por viatura e condutor**
3. **Validação de exequibilidade**
4. **Expurgo de serviços que não caibam nas regras**
5. **Reagendamento proposto dos excluídos**
6. **Geração de folhas de serviço em Word**
7. **Geração de listagem separada de excluídos**
8. **Aplicação de exceções operacionais recebidas no chat**

---

## Input padrão

### Input principal
Um ficheiro Excel diário com a listagem de serviços.

### Inputs adicionais possíveis
Instruções escritas no chat, por exemplo:
- "para este dia, Lisboa é a coluna J assinalada"
- "acima de Coimbra fica fora"
- "Montepio Portimão passa para sexta"
- "DGAJ Lisboa vai no dia seguinte"
- "só temos 3 viaturas e 5 motoristas"
- "cada folha de serviço é um Word pronto a imprimir"
- "usar template oficial"

A skill deve tratar estas instruções como **regras excecionais do dia**, sem as transformar automaticamente em regra permanente, a menos que o utilizador diga explicitamente que passam a standard.

---

## Output padrão

A skill deve produzir:

1. **Rotas finais otimizadas por viatura**
2. **Folha de serviço Word por viatura**
3. **Documento separado com os serviços excluídos / a reagendar**
4. **Alertas de inexequibilidade**
5. **Justificação objetiva para o que foi removido**
6. **Indicação clara dos RSAD executados e excluídos**

---

## Regras operacionais standard

Estas regras são permanentes, salvo instrução explícita em contrário.

### 1. Base operacional
- A saída e o regresso são feitos a partir de **Porto Alto**

### 2. Hora de saída
- Standard: **09h00**
- Algarve: **08h00**

### 3. Jornada
- Jornada total: **9 horas**
- Intervalo de almoço: **1 hora**

### 4. Regresso obrigatório à base
- O regresso deve acontecer **1 hora antes do final da jornada**
- Portanto:
  - saída às 09h00 → regresso até **17h00**
  - saída às 08h00 → regresso até **16h00**

### 5. Limite de condução
- Máximo de **5 horas de condução por jornada**

### 6. Tempo mínimo por paragem
- Todas as paragens têm **mínimo de 20 minutos**

### 7. Restrições horárias por cliente
- **ISS** → atendimento até às **16h00**
- **Montepio** → atendimento até às **17h00**
- **DGAJ / Tribunais** → atendimento até às **16h00**

### 8. Critério de exequibilidade
Uma rota só é exequível se cumprir simultaneamente:
- saída correta;
- máximo de 5h de condução;
- 1h de almoço;
- mínimo de 20 min por paragem;
- regresso à base dentro da hora-limite;
- cumprimento das restrições horárias dos clientes.

Se não cumprir, a skill deve:
- **não fechar a rota como exequível**
- excluir os pontos necessários
- gerar documento de excluídos / remarcar

---

## Regras de planeamento

### 1. Princípio base
A skill deve otimizar para:
- exequibilidade real;
- menor risco operacional;
- menor dispersão geográfica;
- menor mistura de clusters incompatíveis.

### 2. Priorização
A prioridade deve ser:
1. cumprir regras operacionais;
2. proteger clientes críticos;
3. agrupar geograficamente;
4. equilibrar carga por viatura / condutor;
5. só depois maximizar número de serviços.

### 3. Balanceamento de carga
A skill deve distribuir carga por:
- número de serviços;
- tempo total estimado;
- tempo de condução;
- dispersão geográfica;
- quilometragem acumulada por condutor ao longo do período, quando essa informação estiver disponível.

### 4. Clusters
A skill deve preferir clusters coerentes, por exemplo:
- Lisboa central
- Lisboa/Oeste
- Leiria
- Santarém/DGAJ
- Alentejo
- Algarve comercial
- Algarve DGAJ

### 5. Misturas a evitar
Evitar misturar:
- Lisboa com Alto Alentejo
- Oeste com Leiria pesada
- DGAJ com rotas comerciais longas
- Portimão/Algarve com qualquer outro bloco
- pontos isolados fora do eixo principal

### 6. Regra de corte
Se uma rota ficar acima do limite:
- remover primeiro serviços mais fora de eixo;
- depois serviços duplicados por zona;
- depois serviços menos críticos;
- manter sempre blocos sensíveis consistentes.

---

## Regras de exclusão / reagendamento

A skill deve excluir ou remarcar quando:
- um serviço obriga a desvio excessivo;
- um serviço duplica geografia já coberta por um bloco crítico;
- o número de paragens torna a rota inexequível;
- a condução ultrapassa 5 horas;
- o retorno à base falha a hora-limite;
- o cliente fecha antes da hora prevista de chegada;
- existam instruções em falta ou dados críticos ausentes.

### Saída obrigatória para os excluídos
Os excluídos devem ser listados separadamente com:
- **RSAD**
- **Cliente**
- **Morada / Local**
- **Serviço a realizar**
- **Motivo da exclusão / remarcar**

---

## Regras de identificação de serviços

Sempre que possível, a skill deve identificar cada paragem com:
1. **RSAD**
2. **Cliente**
3. **Morada / Local**
4. **Serviço a realizar**

### Fonte de verdade
- **Cliente** = transcrição fiel da **coluna C** do ficheiro de input
- **Serviço a realizar** = transcrição fiel da **coluna H** do ficheiro de input

A skill **não deve reescrever**, simplificar ou “interpretar” estes dois campos, salvo pedido explícito.

---

## Exceções temporárias

A skill deve suportar exceções do dia, por exemplo:
- "neste caso, Lisboa são os serviços assinalados com X na coluna J"
- "neste exercício, tudo acima de Coimbra fica fora"
- "este cliente passa para sexta"
- "esta rota fica exclusiva para DGAJ"
- "esta regra é só para hoje"

A skill deve:
- aplicar a exceção apenas ao planeamento em curso;
- não promovê-la a regra permanente;
- explicitar no output que foi usada uma regra excecional.

---

## Estrutura esperada do ficheiro Excel

A skill deve ser tolerante a pequenas variações de cabeçalhos, mas mapear explicitamente colunas como:

- **Data do Serviço**
- **RSAD**
- **Cliente**
- **NC**
- **Morada**
- colunas auxiliares
- **Serviço a executar**
- possíveis flags / marcações do dia

Se o Excel vier sem cabeçalhos coerentes, a skill deve:
- tentar inferir com base na posição;
- e assinalar no output qualquer ambiguidade relevante.

---

## Processo de trabalho da skill

### Passo 1 — Ler e validar o ficheiro
- carregar Excel
- validar número de linhas
- validar presença de RSAD, Cliente, Morada, Serviço
- identificar flags excecionais, se existirem

### Passo 2 — Aplicar regras do dia
- ler instruções adicionais do chat
- identificar exceções temporárias
- aplicar overrides necessários

### Passo 3 — Criar clusters
- agrupar geograficamente
- identificar blocos pesados
- marcar pontos isolados

### Passo 4 — Testar exequibilidade
Para cada rota candidata:
- estimar condução
- estimar operação (mínimo 20 min por paragem)
- inserir almoço
- validar regresso
- validar horários-limite

### Passo 5 — Expurgar o que não cabe
- remover serviços fora de eixo
- proteger clientes críticos
- manter rotas coerentes
- gerar lista de reagendamento

### Passo 6 — Produzir rotas finais
- definir sequência por viatura
- definir equipa
- definir rota final
- explicitar, quando útil, se a rota está “no limite controlado”

### Passo 7 — Produzir documentos
- folha de serviço Word por viatura
- documento Word com excluídos / remarcar

---

## Template da folha de serviço

### Nome do documento
`Folha_Servico_<data>_<viatura>.docx`

### Formato visual
- usar template oficial
- incluir **logo no header**
- título central:
  **FOLHA DE SERVIÇO DIÁRIO - DSC**
- tabela de identificação no topo

### Tabela de identificação
Campos:
- Data
- Viatura
- Condutor
- Ajudante

### Heading 1
**Sequência da Rota**

Conteúdo:
- sequência da rota em texto
- ex.: `Porto Alto → Tomar → Torres Novas → ... → Porto Alto`

### Heading 2
**Plano de Execução**

Cada paragem deve incluir, por esta ordem:
- RSAD
- Cliente
- Morada
- Serviço a realizar

### Heading 3
**Checklist Operacional**

Checklist mínima:
- [ ] Contentores carregados
- [ ] GT disponível
- [ ] e-GAR validada
- [ ] Equipamento operacional

#### Em cada paragem
- [ ] Serviço executado
- [ ] Guias assinadas
- [ ] Anomalias

---

## Template do documento de excluídos

### Nome do documento
`Servicos_Excluidos_<data>.docx`

### Conteúdo
Título:
**SERVIÇOS A REMARCAR**

Cada linha deve incluir:
- RSAD
- Cliente
- Morada / Local
- Serviço a realizar
- Motivo

---

## Regras de qualidade

A skill deve:
- evitar inventar dados
- ser honesta sobre ambiguidades
- preferir exclusão controlada a rota inexequível
- evitar otimizações “bonitas no mapa” mas impossíveis na prática
- manter consistência entre rota, folha de serviço e lista de excluídos

---

## Casos em que a skill deve alertar explicitamente

Gerar alerta quando:
- uma rota está no limite máximo;
- um cluster tem demasiadas paragens;
- um serviço foi perdido por falta de instrução;
- há duplicação de cliente / zona;
- houve exceção manual aplicada;
- faltam colunas críticas no Excel;
- o ficheiro mudou de estrutura face ao standard.

---

## Padrão de resposta textual no chat

Antes de gerar ficheiros, a skill deve ser capaz de dizer:
- quantas linhas existem no ficheiro;
- quantos serviços entram;
- quantos ficam de fora;
- por que motivo ficam de fora.

Exemplo:
- `Tens 30 linhas no ficheiro.`
- `Entram 21 serviços.`
- `Ficam 9 para remarcar.`
- `O principal fator de corte é excesso de paragens no cluster Santarém e dispersão geográfica.`

---

## Comportamento esperado da skill

### A skill deve:
- ser prática
- responder em português de Portugal
- usar linguagem operacional clara
- manter consistência documental
- respeitar o template oficial

### A skill não deve:
- inventar RSAD
- simplificar Cliente ou Serviço sem ordem explícita
- validar como exequível uma rota que falha regras
- misturar blocos incompatíveis só para “fazer caber”
- perder logótipo ou formatação do template

---

## Templates de prompt internos úteis

### Prompt-base de planeamento
"Analisa o ficheiro Excel diário, aplica as regras operacionais DSC, organiza as rotas por viatura, expurga o que não couber, e gera folhas de serviço em Word e documento separado de excluídos."

### Prompt com exceção Lisboa
"Para este dia, a rota de Lisboa é composta apenas pelos serviços com célula não vazia na coluna J."

### Prompt de revisão
"Revê as rotas à luz das regras: máximo 5h de condução, regresso 1h antes do final da jornada, almoço de 1h e mínimo 20 min por paragem."

---

## Requisitos para scripts / automação da skill

Se a skill usar scripts, devem existir funções para:
- ler Excel com cabeçalhos variáveis;
- mapear colunas;
- identificar RSAD / Cliente / Morada / Serviço;
- agrupar por cluster;
- calcular carga por rota;
- gerar DOCX a partir do template oficial;
- gerar documento de excluídos.

---

## Entregáveis mínimos da skill

1. `SKILL.md`
2. `agents/openai.yaml`
3. referência com estas regras de negócio
4. template(s) DOCX oficiais
5. eventuais scripts para:
   - leitura Excel
   - criação de DOCX
   - geração de excluídos

---

## Resumo executivo

Esta skill serve para transformar um ficheiro diário de serviços DSC em:
- rotas exequíveis,
- folhas de serviço prontas a imprimir,
- e lista objetiva de serviços a remarcar,

aplicando regras operacionais rígidas, exceções do dia, e preservando a fidelidade dos campos críticos:
- **Cliente = coluna C**
- **Serviço a realizar = coluna H**
- **RSAD sempre visível**

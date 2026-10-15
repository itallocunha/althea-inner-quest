# Plano de evolução de Althea

## Organização das ideias e desenvolvimento por etapas

Versão 1.0 • 15 de outubro de 2026

Este documento organiza a expansão de Althea em mundos com jornadas, mecânicas e experiências próprias. Ele serve como guia de trabalho para desenvolver o jogo em partes, acompanhar decisões e preparar pedidos claros para o Lovable ou para um assistente de desenvolvimento.

A prioridade é preservar a jornada atual e o progresso dos jogadores enquanto o universo cresce. A próxima entrega recomendada é organizar o Atlas de Althea; a primeira grande expansão proposta é o mundo dos gnomos, dedicado à educação financeira.

### Como usar este documento

1. Escolha uma única etapa e confirme se suas dependências estão prontas.
2. Preencha a ficha de tarefa antes de pedir alterações.
3. Copie o prompt base e acrescente o prompt da etapa escolhida.
4. Revise a entrega com os critérios de conclusão e registre o resultado.
5. Sincronize a versão validada e só então avance para a próxima tarefa.

As etapas descrevem uma sequência recomendada. Os nomes dos mundos, as regras de combate e a função dos pets continuam abertos para decisão. Registre mudanças nessas propostas antes de orientar novas implementações.

### O que este plano entrega

- Uma estrutura para o universo, os mundos, os continentes e os desafios.
- Treze etapas numeradas de 0 a 12, com escopo e critérios de conclusão.
- Dezoito prompts para planejar, implementar, revisar, sincronizar e corrigir.
- Um quadro de tarefas e fichas preenchíveis para continuar organizando as ideias.

### Primeira ação recomendada

Execute o diagnóstico da etapa 0. Em seguida, desenhe a navegação do Atlas usando as telas atuais. Trabalhe primeiro com um mundo ativo e os demais como propostas; isso permite testar a organização antes de criar novas economias, combates e sistemas sociais.

### Organização do guia

Consulte a visão do universo, os cuidados de desenvolvimento e o roteiro geral antes das etapas detalhadas. A biblioteca de prompts e as fichas de acompanhamento ficam depois das etapas e podem ser reutilizadas em qualquer atualização.

<!-- pagebreak -->

## 1 A estrutura do universo

**Althea é o universo que conecta as experiências do jogador.** Cada mundo tem uma identidade visual e uma jornada principal. Um mesmo mundo pode receber outras jornadas no futuro, desde que elas tenham objetivos e regras claros.

O cenário atual pode ser apresentado como **Althea O Mundo das Cinco Orbes**. Esse nome é uma proposta; o nome definitivo deve preservar o reconhecimento do projeto e suas artes existentes.

### A navegação proposta

**Atlas de Althea → Mundo → Continente → Ilhas → Desafios**

O Atlas reúne as entradas atuais de Mundo e Jornadas. O jogador escolhe um mundo no sistema de planetas, conhece sua proposta e entra no mapa. No primeiro mundo, os continentes continuam associados às cinco orbes e conduzem aos mapas de desafios.

Planetas representam mundos. Orbes representam partes da jornada atual. As duas escalas precisam de nomes e apresentações reconhecíveis para orientar o jogador.

| Experiência | Proposta de jogo | Primeiro recorte possível |
| --- | --- | --- |
| Cinco Orbes | Autoconhecimento por exploração, criação e reflexão | Preservar a jornada e organizar sua entrada pelo Atlas |
| Mundo dos Gnomos | Educação financeira por decisões e simulação | Uma vila, um objetivo e cinco missões conectadas |
| Liderança | Decisões e consequências para um grupo | Uma expedição com decisões narrativas |
| Trabalho em Equipe | Papéis complementares e colaboração | Uma missão com objetivos compartilhados |
| Oratória | Expressão, argumentação e comunicação | Uma apresentação com autoavaliação |
| Expedições | Aplicação de habilidades em aventuras | Um calabouço solo com combate e recompensa |

### O que acompanha o herói

O personagem mantém sua identidade, suas conquistas e suas coleções. Cada mundo registra seu próprio avanço. As regras de uso de habilidades e equipamentos são definidas por atividade, evitando que uma expansão altere sem intenção o equilíbrio das outras.

As expedições podem ter uma central e entradas espalhadas pelos mundos. A primeira versão pode funcionar no cenário atual; um mundo exclusivo para aventuras pode ser decidido depois de testar essa experiência.

<!-- pagebreak -->

## 2 Cuidados para desenvolver com continuidade

### A base atual e as expansões

A base consultada contém a jornada das cinco orbes, desafios, personagem, atributos, inventário, habilidades, medalhas, histórias, portfólio e projeção de cartas em 3D. Verifique o funcionamento de cada recurso antes de usá-lo como dependência de uma etapa nova.

O estado principal do jogo é salvo no navegador pela chave `althea-game-state`. Mundos adicionais jogáveis, economia dos gnomos, combates, contas compartilhadas, cooperação entre jogadores e pets são expansões a validar e implementar.

### Progresso do jogador

- Prepare exportação e restauração do progresso antes de mudar sua estrutura.
- Preserve os identificadores existentes de desafios, cartas e conquistas.
- Uma atualização deve manter personagem, XP, respostas, imagens e itens antigos.
- Uma migração deve produzir o mesmo resultado quando executada novamente.
- Se a leitura ou a migração falhar, preserve o original e ofereça recuperação.
- Separe experiência do herói, dinheiro da simulação e recompensas de combate.

**Código e progresso seguem fluxos diferentes.** GitHub e Lovable sincronizam os arquivos do projeto. O personagem salvo em um navegador depende também do domínio e daquele navegador. Recuperar o progresso entre computador, celular e endereços diferentes exige uma solução própria de contas e armazenamento.

### Arquitetura e artes

Leia o `AGENTS.md` antes de implementar. Centralize as artes em `src/lib/journeyAssets.ts`; novas artes entram em `imagens/` e são processadas por `npm run art`. Preserve o fluxo que gera `public/art/`. Use `getJourneyResume` para retomar a jornada e derive as coleções do progresso existente.

### Ritmo de trabalho

Mantenha uma tarefa em implementação por vez. Escolha Lovable ou o ambiente local como responsável pela alteração atual e sincronize antes de trocar. Isole mudanças extensas em uma branch, com uma versão estável identificada para recuperação. Confirme que o Lovable acompanha a branch escolhida ou integre a entrega na branch sincronizada ao concluir.

Preserve os endereços antigos durante a transição. Ofereça alternativas estáticas para animações, suporte a toque e teclado e carregamento adequado das artes em celulares. Defina limites de desempenho a partir de testes nos aparelhos que serão usados.

<!-- pagebreak -->

## 3 O roteiro de desenvolvimento

Os critérios de conclusão controlam o avanço. O esforço indicado é relativo e depende do diagnóstico, da disponibilidade de arte e dos testes. A tabela não representa datas de entrega prometidas.

| Etapa | Entrega principal | Dependência | Esforço |
| --- | --- | --- | --- |
| 0 | Diagnóstico e versão de referência | Base atual | Pequeno |
| 1 | Atlas com o mundo atual | 0 | Médio |
| 2 | Progresso preparado para vários mundos | 0 e 1 | Alto |
| 3 | Primeiro capítulo dos gnomos | 2 | Médio |
| 4 | Economia básica da vila | 3 | Médio |
| 5 | Bolsa Gnomágica simulada | 4 | Alto |
| 6 | Primeiro calabouço solo | 2 | Alto |
| 7 | Monstruário colecionável | 6 | Médio |
| 8 | Contas e progresso entre dispositivos | 2 | Alto |
| 9 | Guilda e primeira missão cooperativa | 6 e 8 | Alto |
| 10 | Missões raras e eventos | 6 e 7 | Médio |
| 11 | Próxima jornada educacional | 2 e modelo validado | Variável |
| 12 | Primeiro pet companheiro | 2 e função definida | Médio |

### A ordem de prioridade

**Agora:** estabilizar a base, organizar o Atlas e preparar os dados para novos mundos.

**Próxima expansão:** construir uma pequena experiência completa no mundo dos gnomos. Validar orçamento, objetivos e consequências antes de implementar a bolsa.

**Linha de ação:** depois da base comum, desenvolver um calabouço solo e o Monstruário. Esse caminho pode anteceder a Bolsa Gnomágica se testar combate passar a ser a prioridade; encerre a tarefa financeira atual antes de trocar de frente.

**Depois:** contas compartilhadas, guildas, eventos, novas jornadas e pets. Uma expedição cooperativa com chefe deve vir após a missão cooperativa simples.

### O limite de cada entrega

Cada versão precisa completar um pequeno ciclo jogável. Na vila, receber recursos, escolher e observar uma consequência. No calabouço, entrar, enfrentar, receber uma recompensa e sair. Acrescente variedade depois de validar esse ciclo.

<!-- pagebreak -->

## 4 Preparar a base e organizar o Atlas

### Etapa 0 Diagnóstico e versão de referência

**Objetivo:** conhecer a situação real do projeto e guardar uma referência recuperável.

**Entrega:** inventário das funções existentes, problemas reproduzíveis, registro da versão e roteiro de testes. Inclua abertura direta de páginas sem personagem, retomada de salvamento antigo e recebimento repetido de recompensas.

**Concluída quando:** a branch e a versão local estão identificadas; compilação e testes têm resultados registrados; os problemas foram separados em tarefas pequenas; o progresso de teste tem cópia recuperável.

**Prompt para diagnóstico**

```text
Analise Althea antes de expandir o jogo. Leia AGENTS.md, confira a branch e as diferenças entre pasta local e GitHub e mapeie navegação, salvamento, progressão, recompensas e coleções. Verifique abertura direta de rotas, uso sem personagem e recuperação de salvamentos. Execute as verificações existentes quando disponíveis. Entregue diagnóstico com evidências, prioridades e uma primeira correção pequena. Nesta tarefa faça apenas a análise, sem alterar código, progresso ou configurações externas.
```

### Etapa 1 Atlas de Althea

**Objetivo:** reunir Mundo e Jornadas em uma navegação compreensível.

**Entrega:** um Atlas com o mundo das Cinco Orbes ativo e os demais apresentados como futuros. A seleção mostra nome, proposta, situação e progresso. O mundo atual continua levando aos continentes e aos desafios existentes.

**Concluída quando:** os caminhos antigos continuam acessíveis; Continuar aventura retoma o ponto correto; mundos futuros estão identificados; a seleção funciona no celular, no teclado e com movimento reduzido.

Comece com posições estáveis e animações discretas. A rotação deve permitir leitura e seleção confortáveis. Renderização 3D complexa pode ser uma melhoria posterior.

**Prompt para implementação**

```text
Implemente somente a primeira versão do Atlas de Althea, reunindo Mundo e Jornadas. Use o cenário atual como primeiro mundo ativo e apresente os demais como futuros. Preserve as rotas, as cinco orbes, os desafios e todo o progresso. Reaproveite artes e componentes e mantenha seleção acessível no celular e no teclado. A retomada deve usar a regra central de progresso. Não implemente novos mundos jogáveis nesta tarefa. Entregue a mudança funcionando e as verificações realizadas.
```

<!-- pagebreak -->

## 5 Preparar os mundos e começar os gnomos

### Etapa 2 Progresso por mundo

**Objetivo:** permitir novas jornadas sem misturar seus registros com os da jornada atual.

**Entrega:** identificadores estáveis de mundos e jornadas, separação entre dados globais e avanço de cada experiência, versão do salvamento e migração compatível com o estado antigo. Valide exportação e restauração antes de migrar dados reais.

**Concluída quando:** um salvamento antigo mantém os mesmos valores; executar a migração duas vezes mantém o resultado; retornar às Cinco Orbes preserva a posição; uma falha mantém disponível a cópia anterior.

Preserve identificadores como `b1` a `b10` e seus equivalentes das outras orbes. Novos mundos recebem seus próprios identificadores e regras; eles não precisam repetir a estrutura das cinco orbes.

**Prompt para implementação**

```text
Prepare o estado de Althea para vários mundos. Separe identidade e conquistas globais do progresso de cada jornada. Preserve a leitura de althea-game-state e os identificadores atuais. Implemente primeiro exportação e restauração verificadas; depois acrescente migração versionada e repetível, preservando o original em caso de falha. Teste com personagem, desafios, respostas, imagens, cartas e medalhas existentes. Não introduza mecânicas de novos mundos nesta etapa.
```

### Etapa 3 Primeiro capítulo dos gnomos

**Objetivo:** testar o mundo financeiro em uma experiência curta e completa.

**Entrega proposta:** uma vila com três personagens de apoio, um objetivo de compra ou construção e cinco missões conectadas. Os temas iniciais são necessidades e desejos, recursos disponíveis, escolhas, reserva e planejamento.

**Concluída quando:** um jogador consegue começar, compreender o objetivo, tomar decisões, observar consequências e concluir o capítulo; sair e retornar mantém o avanço; a jornada atual permanece acessível.

**Prompt para implementação**

```text
Crie apenas o primeiro capítulo jogável do Mundo dos Gnomos, integrado ao Atlas. Proponha uma vila, três personagens de apoio e cinco missões em torno de um objetivo financeiro simples. Use recursos fictícios e consequências claras. Preserve o personagem global e salve o avanço desse mundo separadamente. Reaproveite inventário, cartas e componentes adequados. Não implemente bolsa, comércio entre jogadores nem guildas. Entregue um ciclo completo e um roteiro de teste.
```

<!-- pagebreak -->

## 6 Desenvolver a economia e a Bolsa Gnomágica

### Etapa 4 Economia básica da vila

**Objetivo:** tornar as escolhas financeiras compreensíveis e consistentes.

**Entrega:** carteira fictícia, histórico de movimentações, entradas, despesas, metas e uma loja pequena com utilidade narrativa. Cada movimentação tem origem identificável. Uma missão não pode gerar uma nova recompensa a cada clique ou atualização da página.

**Concluída quando:** saldo e histórico concordam; operações inválidas são tratadas; recarregar preserva os dados; repetir uma conclusão não duplica o benefício; o jogador entende a consequência de sua decisão.

**Prompt para implementação**

```text
Implemente somente a economia básica do capítulo dos gnomos. Crie carteira fictícia, histórico, metas e uma loja pequena. Separe dinheiro da simulação e XP do herói. Identifique cada recompensa ou operação para impedir duplicação por cliques e conclusões repetidas. Defina o tratamento de operações inválidas e preserve os dados ao recarregar. Teste saldo, histórico, retomada e repetição das ações. Não adicione bolsa nem transações entre jogadores.
```

### Etapa 5 Bolsa Gnomágica de Valores

**Objetivo:** apresentar decisões sob incerteza em uma simulação educativa.

**Entrega inicial:** poucas empresas fictícias, rodadas com cenários compreensíveis e um histórico que explique as consequências. O jogador compara concentração de recursos, diversificação, horizonte e necessidade de reserva.

**Concluída quando:** os cenários são reproduzíveis para teste; mudanças de preço têm explicação no jogo; perdas permitem continuar aprendendo; resultado simulado e recompensa educacional são registrados separadamente.

A primeira versão usa empresas e recursos fictícios, sem dinheiro real. A conclusão pode reconhecer participação e reflexão; evite associar automaticamente lucro na simulação à qualidade do aprendizado.

**Prompt para implementação**

```text
Crie uma primeira simulação da Bolsa Gnomágica após validar a economia da vila. Use três empresas fictícias e rodadas com eventos narrativos reproduzíveis. Apresente escolhas sobre reserva, concentração e diversificação e explique seus efeitos. Registre decisões e ofereça uma reflexão ao final. Separe saldo simulado, participação e recompensas do herói. Inclua valorização e perda com possibilidade de recuperação. Preserve carteira e missões. Não conecte dinheiro real nem preços de ativos reais.
```

<!-- pagebreak -->

## 7 Experimentar combate e colecionar criaturas

### Etapa 6 Primeiro calabouço solo

**Objetivo:** testar se aplicar habilidades em uma aventura é divertido e compreensível.

**Entrega proposta:** um calabouço com três encontros e um chefe, combate curto por turnos e seleção de até três habilidades conquistadas. Esses valores são parâmetros de protótipo, a revisar depois de observar jogadores.

**Concluída quando:** é possível entrar, escolher habilidades, combater, vencer ou perder e retornar ao mundo; interrupções têm comportamento definido; a recompensa é concedida uma única vez; as ações funcionam por toque e teclado.

As habilidades podem revelar intenções, preparar uma defesa ou combinar efeitos. Documente cada adaptação de combate, preservando a conquista original da carta.

**Prompt para implementação**

```text
Implemente somente um protótipo de calabouço solo em Althea. Proponha três encontros e um chefe com combate por turnos. Permita selecionar até três habilidades realmente conquistadas e documente seus efeitos. Defina vitória, derrota, saída e interrupção. Preserve habilidades e progresso originais, conceda a recompensa uma única vez e use as cartas 3D existentes onde fizer sentido. Evite combate em tempo real, cooperação, eventos e geração infinita de conteúdo nesta etapa. Entregue um ciclo jogável e verificações das regras.
```

### Etapa 7 Monstruário

**Objetivo:** transformar encontros e vitórias em descoberta e coleção.

**Entrega:** cartas das criaturas do primeiro calabouço com habitat, história, habilidades e registro dos encontros. Defina o que é revelado ao encontrar, investigar ou derrotar uma criatura.

**Concluída quando:** a condição de descoberta libera a carta correta; revisitar uma criatura atualiza o registro sem duplicar a coleção; frente, verso e rotação funcionam; criaturas desconhecidas têm uma apresentação própria.

**Prompt para implementação**

```text
Crie o Monstruário para as criaturas existentes no primeiro calabouço. Defina os critérios de encontro, descoberta e liberação da carta. Organize habitat, história, efeitos e registro dos encontros e reutilize o visor 3D com frente e verso. Preserve os identificadores das criaturas e evite cartas duplicadas por repetir uma batalha. Garanta apresentação própria para informações ainda não descobertas. Não acrescente novos calabouços nem uma economia de troca de cartas nesta tarefa.
```

<!-- pagebreak -->

## 8 Preparar o progresso compartilhado e as guildas

### Etapa 8 Contas e sincronização do progresso

**Objetivo:** permitir que uma pessoa recupere seu personagem em dispositivos diferentes.

**Entrega:** identidade do jogador, armazenamento associado à conta, regras de acesso e tratamento de conflitos entre salvamento local e remoto. Escolha a tecnologia a partir do diagnóstico dos serviços existentes.

**Concluída quando:** a mesma conta recupera o progresso em dois dispositivos; uma conta não acessa os dados de outra; perda de conexão e conflitos têm recuperação; importar o progresso antigo mantém as recompensas corretas.

O funcionamento offline e a escolha entre duas versões do progresso precisam de regras explícitas. Economia e recompensas compartilhadas também precisam de validação no servidor.

**Prompt para planejar a implementação**

```text
Planeje contas e progresso entre dispositivos em Althea. Inspecione o armazenamento e os serviços existentes. Proponha identidade, controle de acesso, importação do salvamento local, cópias de segurança e regra de conflito entre versões. Explique o funcionamento com perda de conexão e quais recompensas precisam de validação no servidor. Divida a implementação em entregas pequenas com testes de duas contas e dois dispositivos. Nesta tarefa apresente o plano e as decisões necessárias, sem migrar dados reais nem ativar serviços externos.
```

### Etapa 9 Guildas e colaboração

**Objetivo:** testar uma atividade cooperativa com progresso compartilhado verdadeiro.

**Entrega inicial:** uma guilda com poucos membros, regras de entrada e saída, funções simples e uma missão cooperativa. Cada participante contribui com ações identificadas e vê o estado compartilhado da atividade.

**Concluída quando:** a missão funciona com duas contas; ações simultâneas são tratadas; saída e desconexão têm comportamento definido; permissões e recompensas são verificadas no servidor.

**Prompt para implementação**

```text
Após validar contas e progresso compartilhado, implemente uma guilda funcional e uma missão cooperativa simples. Defina entrada, saída, funções e contribuições individuais para o objetivo comum. Teste com duas contas, ações simultâneas, desconexão e repetição de pedidos. As permissões e recompensas devem ser validadas no servidor. Preserve o conteúdo solo e não simule colaboração com dados apenas locais. Não acrescente chat, mercado entre jogadores nem grandes expedições com chefes nesta entrega.
```

<!-- pagebreak -->

## 9 Expandir depois de validar os primeiros ciclos

### Etapa 10 Missões raras e eventos

**Entrega inicial:** um evento que reutiliza um ciclo validado, com início, fim, participação e recompensa definidos. Classifique duração, objetivo, disponibilidade e participação solo ou em grupo.

**Concluída quando:** início e fim são testáveis; recarregar não renova a recompensa; expiração durante a atividade tem tratamento; a participação é clara. Grandes expedições cooperativas exigem a etapa 9.

**Prompt para implementação**

```text
Crie um único evento em Althea reutilizando uma atividade validada. Defina objetivo, duração, acesso, comportamento após o término e recompensa única. Permita testar início e encerramento sem esperar uma data real. Trate recarga e expiração durante a sessão. Preserve as atividades permanentes. Não implemente vários tipos de evento nem uma grande expedição cooperativa antes de validar a missão de guilda.
```

### Etapa 11 Liderança equipe e oratória

**Entrega inicial:** uma única próxima jornada, escolhida por prioridade. Defina a habilidade praticada, as ações do jogador e o feedback de evolução. Um novo planeta depende da identidade e do volume de conteúdo necessários.

**Concluída quando:** um capítulo completo demonstra a proposta; progresso e recompensas têm regras próprias; sair e retornar funciona; a mecânica foi testada com jogadores.

**Prompt para concepção**

```text
Defina a próxima jornada de Althea sobre [liderança, trabalho em equipe ou oratória]. Proponha um capítulo pequeno com objetivo de aprendizagem, cenário, ações, consequências, feedback e recompensas. Avalie se um território existente atende à proposta. Considere os serviços e as mecânicas validados e explicite novas dependências. Entregue duas opções e um recorte recomendado. Faça somente o planejamento, sem alterar o jogo.
```

### Etapa 12 Primeiro pet

**Entrega inicial:** um companheiro com papel narrativo, presença visual e algumas reações às conquistas. Decida primeiro como ele contribui para a experiência.

**Concluída quando:** aquisição, vínculo e evolução são compreensíveis; as mudanças são salvas; o pet acompanha as telas previstas; é possível reduzir suas animações.

**Prompt para concepção**

```text
Planeje o primeiro pet de Althea como companheiro do herói. Defina personalidade, aquisição, vínculo com as jornadas e uma pequena progressão por conquistas. Proponha sua presença nas telas e reações acessíveis com movimento reduzido. Foque a primeira versão em companhia e expressão visual. Reserve combate, reprodução, comércio e múltiplas espécies para decisões posteriores. Entregue um conceito e o escopo de um protótipo, sem implementar.
```

<!-- pagebreak -->

## 10 O prompt base para tarefas de implementação

Cole este texto antes do prompt da etapa e acrescente a ficha de tarefa. Para pedidos de concepção, mantenha explícita a orientação de apenas planejar.

### Prompt base

```text
Você está trabalhando no jogo Althea. A tarefa desta entrega é [descrever um único resultado]. Leia o AGENTS.md e inspecione o código. Confira a branch e o estado local e remoto, preservando alterações ainda não integradas. Trabalhe somente no escopo desta tarefa e reaproveite componentes existentes.

Preserve personagem, XP, atributos, desafios, respostas, imagens, cartas, medalhas, histórias e retomada. Não altere identificadores persistidos sem uma migração definida e testada. Mudanças no salvamento precisam de cópia recuperável e compatibilidade com dados antigos. Separe progresso dos mundos e moedas de cada simulação.

As artes devem seguir journeyAssets.ts e o processo de geração existente. Mantenha navegação por toque e teclado, movimento reduzido e uma apresentação legível no celular. Verifique também rotas antigas e abertura sem personagem.

Implemente a menor entrega completa que atende aos critérios. Faça verificações proporcionais ao risco; progressão, persistência, permissões e recompensas precisam de testes de comportamento. Não publique nem envie alterações a serviços externos nesta tarefa, a menos que isso esteja no pedido.

Ao terminar, explique o resultado, os arquivos principais, o que foi verificado, os limites conhecidos e o próximo passo pequeno. Se uma verificação não puder ser executada, registre isso sem afirmar que passou.
```

### Como formular um pedido pequeno

**Pedido amplo:** criar o mundo financeiro com banco, bolsa, guilda, missões e pets.

**Pedido delimitado:** criar a primeira missão da vila dos gnomos, com uma escolha de compra, atualização do saldo fictício e retomada da missão após recarregar.

### O que anexar ao pedido

Inclua objetivo, etapa, telas envolvidas, critérios de conclusão e o que ficará para depois. Em mudanças visuais, indique qual imagem controla composição, cores ou interação. Em mudanças de regras, apresente exemplos do estado antes e depois da ação.

Uma decisão nova deve atualizar este plano antes de orientar outras tarefas. Evite copiar todo o backlog para um único pedido de implementação.

<!-- pagebreak -->

## 11 Prompts para revisar sincronizar e corrigir

### Revisar uma entrega

```text
Revise somente a entrega [nome da tarefa] em Althea. Compare com os critérios de conclusão. Verifique navegação, celular, teclado, movimento reduzido, persistência e compatibilidade com o progresso anterior quando forem afetados. Rode compilação e testes relevantes. Liste problemas reproduzíveis com impacto e evidência; separe os problemas desta entrega dos que já existiam. Não reescreva outras funcionalidades nem publique alterações. Entregue a avaliação e a próxima correção recomendada.
```

### Sincronizar Lovable GitHub e computador

```text
Sincronize a versão validada de Althea entre o projeto Lovable, https://github.com/itallocunha/althea-inner-quest e C:\Users\itall\Desktop\althea-inner-quest. Primeiro compare branch, commits e alterações locais. Confirme qual lado contém a entrega mais recente e preserve trabalho divergente. Envie somente o que foi validado, traga a versão resultante para a pasta e confira a sincronização no Lovable. Não force o envio nem descarte arquivos para resolver conflitos. Informe o commit comum, as verificações e diferenças preservadas. Esta tarefa trata do código; publicação do site e transferência de personagens são operações separadas.
```

### Corrigir um problema delimitado

```text
Corrija somente o problema [descrição] em Althea. O comportamento observado é [o que acontece], ao seguir [passos]. O esperado é [resultado]. Reproduza o problema, identifique a causa e faça uma correção pequena. Preserve o restante do fluxo e o progresso. Acrescente uma verificação de regressão quando necessária para proteger o comportamento. Entregue resultado e verificações; não aproveite a tarefa para redesenhar telas ou implementar o backlog.
```

### Recuperar uma versão com problemas

```text
Uma atualização de Althea apresentou [problema]. Identifique o commit atual, a última versão estável e o trabalho ainda não salvo. Preserve cópias recuperáveis e proponha a recuperação mais limitada possível. Não use exclusão de dados, reset destrutivo ou envio forçado como atalho. Se precisar desfazer uma mudança compartilhada, apresente uma correção ou reversão rastreável que preserve alterações posteriores relevantes. Valide o salvamento e o fluxo afetado antes de sincronizar novamente.
```

<!-- pagebreak -->

## 12 Quadro de trabalho e fichas preenchíveis

### Quadro de acompanhamento

Mova uma tarefa conforme houver evidência de avanço. Mantenha no máximo uma tarefa Em implementação. Ideias novas entram no backlog e são discutidas antes de alterar a tarefa atual.

| Situação | Significado | Condição para avançar |
| --- | --- | --- |
| Ideias | Possibilidades abertas | Explicar o valor para o jogador |
| Em definição | Escopo em análise | Preencher a ficha de tarefa |
| Pronta | Resultado e critérios claros | Confirmar a base e iniciar |
| Em implementação | Uma mudança em execução | Completar o ciclo previsto |
| Em revisão | Entrega em teste | Registrar evidências e corrigir problemas |
| Concluída | Critérios atendidos | Registrar versão e sincronização |

### Ficha de ideia

**Nome da ideia:** _______________________________________________

**O que o jogador poderá fazer:** _________________________________

**Conhecimento ou habilidade trabalhada:** ________________________

**Mundo ou território relacionado:** ______________________________

**O que já existe e pode ser reutilizado:** _________________________

**Menor experiência que permite testar a ideia:** ___________________

### Ficha de tarefa

**Título e etapa:** ______________________________________________

**Resultado único esperado:** ____________________________________

**Dependências prontas:** ________________________________________

**Critérios observáveis de conclusão:** ____________________________

**O que ficará para depois:** _____________________________________

**Responsável e ambiente de edição:** _____________________________

**Versão de partida e forma de recuperação:** ______________________

**Resultado dos testes e versão entregue:** ________________________

<!-- pagebreak -->

## 13 Revisão de uma versão e próximos passos

### Checklist para encerrar uma entrega

- [ ] O resultado pedido funciona e seu limite está documentado.
- [ ] O jogador consegue iniciar, entender a ação, concluir e retornar.
- [ ] A navegação antiga funciona nas partes afetadas.
- [ ] Um personagem novo e um salvamento anterior foram considerados.
- [ ] Mudanças em dados têm cópia recuperável e migração testada.
- [ ] XP, moedas, itens e conquistas são preservados e não duplicam por repetição indevida.
- [ ] A apresentação foi conferida em celular e computador quando a interface mudou.
- [ ] Teclado, legibilidade e movimento reduzido foram considerados.
- [ ] Compilação e testes relevantes têm resultados registrados.
- [ ] A sincronização solicitada foi confirmada na branch correta.

### Registro de decisão

Registre proposta, alternativas consideradas, motivo, consequência para o jogador e o que permitiria revisar cada decisão importante. Isso mantém os próximos prompts coerentes.

**Primeiras decisões a fechar:** nome da entrada do Atlas; nome de apresentação do primeiro mundo; quais dados são globais; objetivo do primeiro capítulo dos gnomos; prioridade entre Bolsa Gnomágica e primeiro calabouço; função inicial dos pets.

### Registro de sessão

**Data e tarefa:** _______________________________________________

**O que foi alterado ou decidido:** _______________________________

**O que foi validado e o que ficou pendente:** _____________________

**Commit ou referência da versão:** _______________________________

**Próxima ação pequena:** ________________________________________

### Sequência recomendada para as primeiras sessões

1. Diagnosticar a base e registrar bloqueios de navegação ou preservação do progresso.
2. Resolver o primeiro bloqueio em uma tarefa própria e validar o fluxo afetado.
3. Definir o Atlas e integrar o mundo atual usando a navegação existente.
4. Preparar o progresso por mundo com cópia, recuperação e migração verificadas.
5. Escrever e implementar a primeira missão da vila dos gnomos; validar antes de produzir o restante do capítulo.

Ao encerrar cada sessão, registre uma próxima ação executável. Mantenha as demais ideias como reserva para futuras etapas, deixando o trabalho atual delimitado.

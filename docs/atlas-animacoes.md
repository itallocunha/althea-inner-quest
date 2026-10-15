# Atlas de Althea — animações e destaque visual

Revisão de 15/10/2026 no projeto existente.

## Mudanças

- Planetas com rotação suave das superfícies no próprio lugar. Sombras, iluminação e áreas de seleção permanecem estáveis.
- Fundo com galáxia espiral em rotação, duas nebulosas animadas, 156 estrelas em três camadas de profundidade, cintilação, deslocamentos e três estrelas cadentes.
- Título, nomes dos planetas, jornada e conhecimentos com fontes maiores, mais peso e contraste.
- Duplo clique no computador ou dois toques próximos, em até 340 ms, iniciam a aproximação ao mundo disponível. O botão Entrar no mundo usa a mesma transição.
- A aproximação amplia o planeta, mostra uma mensagem de entrada e só então abre o mapa. Sem herói, segue para a criação. Mundos futuros continuam apenas selecionáveis e não iniciam entrada.
- O controle Animações do Atlas permite ativar os efeitos ou reduzir os movimentos. A preferência do sistema é o padrão inicial. A escolha explícita do jogador fica na chave visual althea-atlas-motion, separada do salvamento da aventura.

## Preservação e limites

O formato de althea-game-state, os identificadores persistidos, getJourneyResume, personagem, respostas, imagens, XP, cartas, medalhas, histórias e progresso não foram alterados nesta revisão. As cartas 3D e seus efeitos permanecem preservados. Apenas o Mundo das Cinco Orbes é jogável.

Nenhuma biblioteca ou nova arte raster foi adicionada. A superfície do planeta atual continua usando o mapa centralizado em src/lib/journeyAssets.ts. As demais superfícies e os efeitos de galáxia são CSS. Não foi necessário executar npm run art.

## Verificação

| Verificação | Resultado |
| --- | --- |
| npm test | 44 testes passaram em 4 arquivos; 28 casos no arquivo do Atlas |
| npm run build | Passou |
| TypeScript, tsconfig.app.json, sem emissão de arquivos | Passou |
| ESLint nos 11 arquivos TypeScript da entrega completa | Passou, sem erros e sem avisos |
| git diff --check | Passou |

Os três erros gerais anteriores, registrados na entrega inicial do Atlas, não foram alterados. A compilação ainda avisa sobre Browserslist antigo e o tamanho do arquivo JavaScript principal; são avisos e não impedem a compilação.

No navegador, foram conferidos 1280 × 900 e 390 × 844, sem rolagem horizontal. Os valores de posição da textura e da matriz da galáxia mudaram ao longo do tempo, confirmando animações em execução. O navegador estava com movimento reduzido ativo; o controle do Atlas foi usado para ativar os efeitos solicitados sem alterar o sistema.

Entrada por duplo clique e pelo botão conferidas no navegador, incluindo mensagem de aproximação e chegada ao mapa. Duplo toque, ativações repetidas, movimento reduzido e persistência da escolha visual são cobertos pelos testes. O progresso existente permaneceu em 13 de 50 desafios (26%), com retomada para g4.

## Como conferir

1. Abra http://127.0.0.1:8080/atlas e confira Animações ativas no controle do cabeçalho.
2. Observe a rotação das superfícies e o movimento do fundo. Os planetas mantêm suas posições de seleção.
3. Dê duplo clique ou dois toques rápidos em Cinco Orbes. A câmera se aproxima e o mapa abre.
4. Volte ao Atlas e repita pelo botão Entrar no mundo. No celular, Ver mundo selecionado leva ao painel de informações.
5. Experimente o controle de movimento reduzido. A entrada permanece funcional, sem aproximação animada.

## Git

O envio solicitado inclui a implementação inicial do Atlas, esta revisão, os documentos e as artes originais que estavam pendentes. As 204 artes originais e os dois documentos de planejamento foram agrupados em um commit próprio; o Atlas e seus relatórios formam outro commit. Arquivos ignorados, como node_modules, dist, logs e o executável gerado, não são versionados.

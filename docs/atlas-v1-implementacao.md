# Atlas de Althea — primeira versão

Entrega local: 15/10/2026. Projeto: C:\Users\itall\Desktop\althea-inner-quest.

## Mudanças

- Atlas reúne Mundo e Jornadas em uma única entrada da navegação inferior e no atalho da Casa. Casa, Coleções, Guilda e Herói permanecem disponíveis.
- Cinco planetas selecionáveis exibem suas propostas e disponibilidade. As áreas de toque permanecem fixas; estrelas, superfícies, profundidade e luzes orbitais compõem o cenário com CSS e arte existente.
- Mundo das Cinco Orbes apresenta a Jornada do Autoconhecimento, conhecimentos, progresso, Entrar no mundo e Continuar aventura.
- Mundo dos Gnomos apresenta a futura Jornada da Educação Financeira e a Bolsa Gnomágica. Liderança, Trabalho em Equipe e Oratória mostram mundos em desenvolvimento, com nomes ainda em definição. Nenhum mundo futuro oferece entrada ou desafios.
- Entrar no mundo abre o mapa artístico atual, com seus cinco continentes, orbes, caminhos e desbloqueios. O mapa ganhou retorno explícito ao Atlas e um seletor de continentes acessível ao teclado.
- A cena do continente contém o foco, fecha com Escape e devolve o foco ao controle de origem. A preferência por movimento reduzido desliga as animações do Atlas e reduz as transições do mapa e da cena.
- Sem personagem, o Atlas pode ser consultado e a entrada leva à criação do herói. Acesso direto ao mapa, continente ou desafio também conduz à criação.

## Rotas e salvamento

| Rota | Comportamento |
| --- | --- |
| /atlas | Nova entrada dos mundos |
| /journeys | Redireciona para /atlas |
| /world | Mapa artístico do Mundo das Cinco Orbes |
| /orbs | Redireciona para /world |
| /orb/:orbId | Trilha existente |
| /challenge/:challengeId | Desafio existente |

Os redirecionamentos usam replace. BrowserRouter e HashRouter permanecem no código. Ver mundo selecionado desloca o foco e a rolagem sem modificar o fragmento do endereço.

GameContext, chave althea-game-state, formato do salvamento e identificadores persistidos não foram alterados. A retomada continua usando getJourneyResume, sem modificar sua lógica. Os testes conferem a preservação integral de personagem, XP, atributos, respostas, imagens, cartas, favoritos, medalhas, histórias e progresso.

As cartas 3D, suas faces, rotação e partículas não foram alteradas; seus sete testes existentes passaram. A arte do planeta atual é referenciada por src/lib/journeyAssets.ts. Não foram adicionadas artes ou dependências, nem editado public/art/. Por reutilizar apenas recursos existentes e CSS, esta entrega não precisou executar npm run art.

## Verificações finais

| Verificação | Resultado |
| --- | --- |
| npm run build | Passou |
| node node_modules/typescript/bin/tsc -p tsconfig.app.json --noEmit | Passou |
| npm test | 36 testes passaram em 4 arquivos |
| Casos do Atlas | 20 testes passaram |
| ESLint nos nove arquivos TypeScript desta entrega | Passou, sem erros e sem avisos |
| git diff --check | Passou |
| npm run lint, projeto completo | 3 erros e 9 avisos, iguais à verificação anterior às mudanças |

Os três erros anteriores estão em src/components/ui/command.tsx:24 e src/components/ui/textarea.tsx:5 (interfaces vazias), e tailwind.config.ts:111 (require). Esses arquivos não foram modificados.

A compilação avisa sobre a base Browserslist antiga e um arquivo JavaScript minificado maior que 500 kB, mas termina com sucesso. Atualizações de dependências e otimizações globais ficaram fora desta tarefa.

Os testes cobrem seleção, disponibilidade, progresso, preservação do estado completo, compatibilidade das rotas, abertura sem herói, retomada inicial/intermediária/final e retorno do foco com e sem movimento reduzido.

Conferência no navegador em 1280 × 900, 390 × 844 e 320 × 740. O Atlas compacto não apresentou rolagem horizontal. Seleção por Enter, foco nos detalhes, entrada no mapa, caminho de volta por continente e Escape foram conferidos. O movimento reduzido foi simulado nos testes; as preferências do computador permaneceram intactas.

Com o progresso existente, o Atlas exibiu 13 de 50 desafios concluídos (26%) e Continuar aventura abriu /challenge/g4, Herói da Infância. Nenhum desafio foi concluído e nenhuma resposta foi editada durante a conferência.

Os logs completos estão em verificacoes, junto deste relatório. Capturas: atlas-computador.jpg e atlas-celular.jpg.

## Como testar

1. Acesse http://127.0.0.1:8080/atlas com o iniciador habitual aberto.
2. Selecione cada planeta: apenas Cinco Orbes oferece entrada e retomada; os demais mostram Em breve.
3. Entre no mundo, abra um continente e uma ilha para chegar ao desafio. Confira arte, desbloqueios e desafios anteriores.
4. Volte pela trilha ao mapa e ao Atlas. Use Continuar aventura e confira o ponto retomado.
5. Confira /journeys, /world e /orbs. Use Tab, Enter e Espaço para navegar e Escape para sair da cena de um continente.
6. Ative a preferência de movimento reduzido do navegador ou do sistema para conferir a apresentação sem animações orbitais.
7. Para conferir a abertura sem herói, use um perfil separado de navegador ou os testes automatizados. O salvamento do perfil principal pode permanecer intacto.

## Limitações

Apenas o Mundo das Cinco Orbes é jogável. Os planetas usam composição 2D; não há motor 3D ou câmera livre no Atlas. Preparação de dados para múltiplos mundos, novas jornadas e novas mecânicas continuam para etapas posteriores. Não houve publicação nem envio ao GitHub.

## Arquivos e reversibilidade

Alterados: src/App.tsx; src/components/BottomNav.tsx; src/components/world/ContinentScene.tsx; src/lib/journeyAssets.ts; src/pages/HomeSocial.tsx; src/pages/World.tsx.

Criados: src/data/atlasWorlds.ts; src/pages/Atlas.tsx; src/pages/Atlas.css; src/test/atlas.test.tsx; docs/atlas-v1-implementacao.md.

O estado inicial tinha apenas docs/ e imagens/ não rastreados; seus conteúdos existentes foram preservados. Os seis originais foram guardados antes das edições em C:\Users\itall\Documents\Codex\2026-10-15\crie-um-novo-site-com-sites\work\atlas-original, com hashes em work/atlas-original-manifest.json. Uma reversão deve restaurar somente esses seis originais e remover somente os novos arquivos desta lista, após conferir possíveis edições posteriores. O salvamento do navegador não participa dessa reversão.

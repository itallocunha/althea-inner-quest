# Mapa visual da Jornada do Autoconhecimento

## Objetivo
Usar as cinco artes de Orbes e as duas artes do personagem para tornar a progressão mais imersiva, preservando o progresso e as regras atuais.

## Alterações
- Adicionar na Home um destaque “Continuar jornada” que identifica a Orbe atual e leva diretamente ao primeiro desafio ainda não concluído; quando a Orbe estiver concluída, leva ao próximo ponto disponível.
- Substituir as representações genéricas das Orbes pelas artes enviadas no mapa principal e nas telas internas.
- Reformular a Jornada do Autoconhecimento como um mapa vertical mágico: cinco regiões conectadas, cores próprias, estado bloqueado/atual/concluído, porcentagem e contagem de desafios.
- Dentro de cada Orbe, transformar os 10 desafios em um caminho sinuoso com nós numerados, trilha conectada, personagem marcando a posição atual e estados visuais claros para bloqueado, disponível e concluído.
- Manter acesso aos detalhes, respostas e portfólio já existentes.
- Ajustar a apresentação para celular e web, com animações leves e redução de movimento respeitada.

## Detalhes técnicos
- As imagens enviadas serão armazenadas como assets do projeto e importadas pelas telas.
- A posição de retomada será calculada a partir de `currentOrbIndex` e `challengeProgress`, sem alterar as regras de progressão.
- Serão ajustadas as telas Home, mapa das Orbes, Jornada e detalhe da Orbe; nenhuma mudança de backend será feita.
- Ao final, serão verificados o estado visual, a navegação do botão e o funcionamento em larguras móvel e desktop.

# Registro de Testes de Usabilidade

O registro de testes de usabilidade reúne as informações observadas durante a interação dos usuários com a aplicação. Para esta etapa, foram avaliadas as interfaces mock das funcionalidades RF-003 e RF-004, executadas no emulador Android com Expo/React Native. O objetivo foi verificar se os usuários conseguem compreender a navegação, preencher os campos principais e concluir tarefas ligadas à organização do plano de treino e ao registro rápido da execução dos exercícios.

## Perfil dos usuários que participaram do teste

- Usuário 1: 45 anos, ensino médio completo, conhecimento básico em tecnologia, pratica musculação ocasionalmente.
- Usuário 2: 18 anos, ensino superior incompleto, conhecimento avançado em tecnologia, utiliza aplicativos fitness.
- Usuário 3: 70 anos, ensino fundamental incompleto, conhecimento básico em tecnologia, possui pouca familiaridade com apps móveis.
- Usuário 4: 25 anos, ensino superior completo, conhecimento avançado em tecnologia, treina regularmente.
- Usuário 5: 28 anos, ensino superior completo, conhecimento intermediário em tecnologia, pratica atividades físicas semanalmente.
- Usuário 6: 41 anos, ensino superior completo, conhecimento avançado em tecnologia, treina 4 vezes por semana e utiliza app fitness.

## Cenários avaliados

**Cenário 1: Acessar a tela de Plano de Treino**

O usuário deve abrir o aplicativo e usar a navegação inferior para acessar a tela **Plano**. O cenário avalia se a navegação é compreensível e se o usuário identifica onde está a funcionalidade relacionada à RF-003.

| **Usuário** | **Tempo Total (seg)** | **Quantidade de cliques/toques** | **Tarefa foi concluída?** | **Erros Cometidos** | **Feedback do Usuário** |
|-------------|------------------------|----------------------------------|----------------------------|----------------------|--------------------------|
| Usuário 1 | 12 | 2 | Sim | Nenhum | A opção Plano foi entendida como local para editar treino. |
| Usuário 2 | 7 | 1 | Sim | Nenhum | Navegação inferior foi direta e familiar. |
| Usuário 3 | 22 | 3 | Sim | Tocou primeiro em Registro | Entendeu após observar os rótulos da barra inferior. |
| Usuário 4 | 6 | 1 | Sim | Nenhum | Fluxo considerado simples. |
| Usuário 5 | 9 | 1 | Sim | Nenhum | A barra inferior ajudou a localizar a tela rapidamente. |

**Cenário 2: Editar dados gerais do plano de treino**

O usuário deve alterar o **Nome do plano** e o **Profissional responsável** na tela **Plano de Treino**. O cenário avalia se os campos são claros e se a interface comunica que o plano vem de orientação profissional, conforme RF-003.

| **Usuário** | **Tempo Total (seg)** | **Quantidade de cliques/toques** | **Tarefa foi concluída?** | **Erros Cometidos** | **Feedback do Usuário** |
|-------------|------------------------|----------------------------------|----------------------------|----------------------|--------------------------|
| Usuário 1 | 38 | 5 | Sim | Nenhum | Campos foram compreendidos sem ajuda. |
| Usuário 2 | 24 | 4 | Sim | Nenhum | Achou útil ter o campo do profissional responsável. |
| Usuário 3 | 58 | 6 | Sim | Dificuldade inicial com teclado virtual | Pediu campos com fonte um pouco maior. |
| Usuário 4 | 21 | 4 | Sim | Nenhum | Interface considerada objetiva. |
| Usuário 5 | 29 | 4 | Sim | Nenhum | A separação por seção facilitou o preenchimento. |

**Cenário 3: Adicionar exercício com séries e repetições**

O usuário deve tocar em **Adicionar exercício**, preencher o nome do exercício, informar séries e repetições. O cenário avalia o fluxo principal da RF-003.

| **Usuário** | **Tempo Total (seg)** | **Quantidade de cliques/toques** | **Tarefa foi concluída?** | **Erros Cometidos** | **Feedback do Usuário** |
|-------------|------------------------|----------------------------------|----------------------------|----------------------|--------------------------|
| Usuário 1 | 52 | 7 | Sim | Nenhum | Entendeu que cada card representa um exercício. |
| Usuário 2 | 31 | 6 | Sim | Nenhum | Preenchimento foi rápido. |
| Usuário 3 | 74 | 9 | Sim | Tentou salvar antes de preencher repetições | Sugeriu destacar melhor os campos obrigatórios. |
| Usuário 4 | 28 | 6 | Sim | Nenhum | Achou o resumo do card útil. |
| Usuário 5 | 36 | 6 | Sim | Nenhum | Considerou clara a relação entre exercício, séries e repetições. |

**Cenário 4: Registrar uma série durante o treino**

O usuário deve acessar **Registro**, informar carga e repetições e tocar em **Registrar série**. O cenário avalia o fluxo principal da RF-004, especialmente a rapidez do registro.

| **Usuário** | **Tempo Total (seg)** | **Quantidade de cliques/toques** | **Tarefa foi concluída?** | **Erros Cometidos** | **Feedback do Usuário** |
|-------------|------------------------|----------------------------------|----------------------------|----------------------|--------------------------|
| Usuário 1 | 18 | 4 | Sim | Nenhum | A ação de registrar série ficou clara. |
| Usuário 2 | 8 | 3 | Sim | Nenhum | Botões e campos foram fáceis de entender. |
| Usuário 3 | 31 | 5 | Sim | Demorou para identificar carga em kg | Sugeriu manter o rótulo sempre visível. |
| Usuário 4 | 6 | 3 | Sim | Nenhum | Conseguiu registrar em tempo próximo ao objetivo de 5 segundos. |
| Usuário 5 | 11 | 3 | Sim | Nenhum | Gostou da confirmação após registrar. |

**Cenário 5: Ajustar carga e repetições pelos botões rápidos**

O usuário deve alterar os valores usando os botões **-5**, **+5**, **-1** e **+1**, depois registrar a série. O cenário avalia se os atalhos reduzem esforço e favorecem o requisito de registro rápido da RF-004.

| **Usuário** | **Tempo Total (seg)** | **Quantidade de cliques/toques** | **Tarefa foi concluída?** | **Erros Cometidos** | **Feedback do Usuário** |
|-------------|------------------------|----------------------------------|----------------------------|----------------------|--------------------------|
| Usuário 1 | 20 | 6 | Sim | Nenhum | Entendeu os botões após primeira tentativa. |
| Usuário 2 | 9 | 5 | Sim | Nenhum | Considerou os atalhos mais rápidos que digitar. |
| Usuário 3 | 36 | 7 | Sim | Tocou duas vezes no botão errado | Sugeriu botões maiores para uso na academia. |
| Usuário 4 | 7 | 5 | Sim | Nenhum | Registro ficou muito rápido. |
| Usuário 5 | 12 | 5 | Sim | Nenhum | Achou o ajuste de carga prático. |

**Cenário 6: Editar ou substituir exercício durante o treino (RF-009)**

O usuário deve selecionar um exercício na tela **Treino em execução**, alterar a seleção para outro exercício do plano e registrar uma série normalmente. O cenário avalia se o sistema permite substituir rapidamente o exercício atual sem interromper o fluxo do treino.

| **Usuário** | **Tempo Total (seg)** | **Quantidade de cliques/toques** | **Tarefa foi concluída?** | **Erros Cometidos** | **Feedback do Usuário** |
|-------------|------------------------|----------------------------------|----------------------------|----------------------|--------------------------|
| Usuário 1 | 24 | 5 | Sim | Nenhum | Entendeu que podia trocar o exercício tocando em outro card. |
| Usuário 2 | 13 | 4 | Sim | Nenhum | Fluxo foi considerado rápido e intuitivo. |
| Usuário 3 | 41 | 6 | Sim | Tentou editar o nome manualmente | Compreendeu após selecionar outro exercício da lista. |
| Usuário 4 | 11 | 4 | Sim | Nenhum | Achou prática a troca sem precisar sair da tela. |
| Usuário 5 | 18 | 4 | Sim | Nenhum | Gostou do feedback exibido ao selecionar novo exercício. |

**Cenário 7: Utilizar cronômetro de descanso com alerta sonoro (RF-010)**

O usuário deve registrar uma série, iniciar o descanso utilizando uma das opções disponíveis e aguardar o término do cronômetro. O cenário avalia se o temporizador é compreensível, se a contagem regressiva é visível e se a notificação sonora auxilia o retorno ao treino.

| **Usuário** | **Tempo Total (seg)** | **Quantidade de cliques/toques** | **Tarefa foi concluída?** | **Erros Cometidos** | **Feedback do Usuário** |
|-------------|------------------------|----------------------------------|----------------------------|----------------------|--------------------------|
| Usuário 1 | 19 | 4 | Sim | Nenhum | O aviso sonoro ajudou a perceber o fim do descanso. |
| Usuário 2 | 9 | 3 | Sim | Nenhum | Cronômetro foi considerado simples e útil. |
| Usuário 3 | 33 | 5 | Sim | Demorou para entender pausa do descanso | Gostou do número grande do contador. |
| Usuário 4 | 7 | 3 | Sim | Nenhum | Fluxo rápido e adequado para uso durante treino intenso. |
| Usuário 5 | 12 | 4 | Sim | Nenhum | Considerou úteis as opções rápidas de tempo. |

**Cenário 8: Analisar o Gráfico da Progressão de Carga por Exercício**

O usuário deve selecionar a  **Lista Suspensa** em seguida o **Tipo de Exercício** na tela visual do gráfico aparecerá os dados das cargas registradas pelo personal trainer ao longo do treino. O cenário avalia se os dados são consistentes e claros e a interface de fácil interpretação, conforme RF-007.

| **Usuário** | **Tempo Total (seg)** | **Quantidade de cliques/toques** | **Tarefa foi concluída?** | **Erros Cometidos** | **Feedback do Usuário** |
|-------------|------------------------|----------------------------------|----------------------------|----------------------|--------------------------|
| Usuário 1 | 20 | 3 | Sim | Nenhum | Dados foram compreendidos sem ajuda. |
| Usuário 2 | 18 | 3 | Sim | Nenhum | Fácil de acompanhar a evolução da carga utilizada em cada exercício ao longo dos meses. |
| Usuário 3 | 11 | 5 | Sim | Nenhum | O acesso para a navegação até a tela Ver Progresso foi fácil e fluída. | 
| Usuário 4 | 19 | 6 | Sim | Nenhum | Interface considerada objetiva. |
| Usuário 5 | 09 | 3 | Sim | Nenhum | Simples e objetivo, ótimo para acompanhar a evolução. |

**Cenário 9: Acompanhar o Histórico de Registro do Peso do Usuário**

O usuário deve preencher o card  **Registro de Peso** em seguida clicar no botão **Salvar** na tela aparecerá a lista com o histórico do peso corporal do usuário (aluno). Apresentando a data do registro e o seu peso. O cenário avalia se os dados foram gravados de acordo com o interesse do usuário, conforme RF-008.

| **Usuário** | **Tempo Total (seg)** | **Quantidade de cliques/toques** | **Tarefa foi concluída?** | **Erros Cometidos** | **Feedback do Usuário** |
|-------------|------------------------|----------------------------------|----------------------------|----------------------|--------------------------|
| Usuário 1 | 20 | 4 | Sim | Nenhum | DInterface considerada objetiva. |
| Usuário 2 | 18 | 4 | Sim | Nenhum | Fácil de acompanhar o histórico dos registros do peso. |
| Usuário 3 | 11 | 4 | Sim | Nenhum | Legal poder registrar o meu peso e já acompanhar o histórico dos resgistros de forma online. | 
| Usuário 4 | 19 | 4 | Sim | Nenhum | Dados foram compreendidos sem ajuda. |

**Cenário 10: Visualizar tutorial de exercício (RF-011)**

O usuário deve acessar a tela **Guia de Exercícios**, selecionar um exercício disponível e visualizar as instruções em texto relacionadas à execução correta do movimento. O cenário avalia se as orientações são compreensíveis, legíveis e fáceis de localizar durante o uso do aplicativo.

| **Usuário** | **Tempo Total (seg)** | **Quantidade de cliques/toques** | **Tarefa foi concluída?** | **Erros Cometidos** | **Feedback do Usuário** |
|-------------|------------------------|----------------------------------|----------------------------|----------------------|--------------------------|
| Usuário 1 | 17 | 3 | Sim | Nenhum | As instruções foram claras e fáceis de entender. |
| Usuário 2 | 8 | 2 | Sim | Nenhum | Gostou da organização das informações do exercício. |
| Usuário 3 | 29 | 4 | Sim | Precisou reler parte do texto | Sugeriu aumentar o tamanho da fonte das instruções. |
| Usuário 4 | 10 | 2 | Sim | Nenhum | Navegação rápida e objetiva até o tutorial. |
| Usuário 5 | 13 | 3 | Sim | Nenhum | Achou útil consultar a execução correta antes do treino. |
| Usuário 6 | 9 | 2 | Sim | Nenhum | Considerou o guia prático para consultar durante os exercícios. |

## Indicadores consolidados

| **Cenário** | **Taxa de sucesso** | **Tempo médio (seg)** | **Média de cliques/toques** | **Média de erros** | **Taxa de abandono** |
|-------------|---------------------|------------------------|-----------------------------|--------------------|----------------------|
| Cenário 1 - Acessar Plano | 100% | 11,2 | 1,6 | 0,2 | 0% |
| Cenário 2 - Editar dados do plano | 100% | 34,0 | 4,6 | 0,2 | 0% |
| Cenário 3 - Adicionar exercício | 100% | 44,2 | 6,8 | 0,2 | 0% |
| Cenário 4 - Registrar série | 100% | 14,8 | 3,6 | 0,2 | 0% |
| Cenário 5 - Usar botões rápidos | 100% | 16,8 | 5,6 | 0,2 | 0% |
| Cenário 6 - Editar/substituir exercício | 100% | 21,4 | 4,6 | 0,2 | 0% |
| Cenário 7 - Cronômetro de descanso | 100% | 16,0 | 3,8 | 0,2 | 0% |
| Cenário 8 - Gráfico da Progressão de Carga por Exercício | 100% | 15,0 | 4,0 | 0,0 | 0% |
| Cenário 9 - Histórico de Registro do Peso do Usuário | 100% | 16,0 | 4,0 | 0,2 | 0% |
| Cenário 10 - Visualizar tutorial de exercício | 100% | 14,3 | 2,7 | 0,2 | 0% |

## Relatório dos testes de usabilidade

Os testes indicaram que as interfaces mock das funcionalidades RF-003 e RF-004 são compreensíveis para usuários com diferentes níveis de familiaridade tecnológica. Todos os participantes concluíram as tarefas propostas, resultando em taxa de sucesso de 100% nos cinco cenários avaliados.

Na RF-003, os usuários compreenderam que a tela **Plano de Treino** serve para organizar um plano com exercícios, séries e repetições. A separação entre dados gerais do plano e lista de exercícios facilitou a navegação. O principal ponto de atenção foi a dificuldade de usuários menos experientes ao lidar com campos de texto e teclado virtual, especialmente em telas menores.

Na RF-004, a tela **Treino em execução** foi percebida como objetiva. Os participantes entenderam a finalidade dos campos de carga e repetições, e os botões rápidos ajudaram a reduzir o esforço de digitação. O requisito de registrar a execução em até 5 segundos ainda não foi atingido por todos os perfis, mas usuários com maior familiaridade tecnológica chegaram perto ou abaixo desse tempo quando os campos já estavam preenchidos.

No RF-007, a visualização da progressão de carga através do gráfico foi validada com sucesso por todos os participantes, apresentando um tempo médio de conclusão bastante ágil. A interação com a lista suspensa para selecionar o tipo de exercício mostrou-se intuitiva, com os usuários 1, 2 e 5 realizando a tarefa com apenas 3 cliques. O Usuário 2 destacou a facilidade em acompanhar a evolução cronológica das cargas, reforçando que a interface cumpre seu papel informativo de forma clara. Embora os usuários 3 e 4 tenham realizado mais cliques (5 e 6, respectivamente), a tarefa foi concluída sem erros, e o Usuário 3 ressaltou que a navegação até a tela "Ver Progresso" foi fluida. O feedback geral consolidou a interface como objetiva e de fácil interpretação para o acompanhamento da evolução nos treinos.

RF-008: Histórico de Registro de Peso
Para o RF-008, o processo de registro e acompanhamento do histórico de peso corporal foi executado de maneira uniforme e eficiente. Todos os participantes concluíram a tarefa utilizando exatamente 4 cliques (com exceção do registro de tempo, que variou conforme a agilidade de digitação), o que indica um fluxo de navegação consistente e previsível. O Usuário 3 demonstrou entusiasmo com a natureza imediata e online do histórico, enquanto o Usuário 2 enfatizou a praticidade na leitura dos dados retroativos. A interface foi classificada como objetiva por participantes como os usuários 1 e 4, confirmando que a apresentação da data e do peso atende plenamente às expectativas de monitoramento do aluno sem a necessidade de suporte externo para compreensão.

Na RF-009, a substituição de exercícios durante o treino foi concluída por todos os participantes sem abandono. A interação via cards expansíveis do plano mostrou-se intuitiva para a maioria, mas o Usuário 3 tentou editar o nome do exercício diretamente no campo, indicando que a distinção entre selecionar um exercício do plano e editá-lo manualmente ainda pode não estar clara para usuários com menor familiaridade. O feedback visual exibido ao selecionar um novo exercício foi bem recebido e contribuiu para a compreensão da troca. O tempo médio de 21,4 segundos é compatível com o uso durante o treino.
 
Na RF-010, o cronômetro de descanso foi compreendido por todos os participantes. A exibição do tempo em formato grande e centralizado foi especialmente valorizada pelo Usuário 3, que tem menor acuidade visual. As opções de duração (30s, 1min, 1,5min e 2min) foram consideradas práticas pelos participantes que treinam regularmente. O único ponto de atenção foi a dificuldade do Usuário 3 em identificar o botão de pausa, sugerindo que o controle pode estar visualmente menos destacado em relação ao restante do modal. A notificação ao fim do descanso foi percebida positivamente: a vibração do dispositivo funcionou como reforço suficiente para os testes realizados no emulador, e o Usuário 1 relatou que o aviso sonoro ajudou a perceber o fim do tempo mesmo sem olhar para a tela.
 
De forma geral, a média de erros de 0,2 por cenário e a ausência de abandonos indicam que as interfaces atendem ao critério básico de usabilidade para os perfis testados. Os cenários com maior tempo médio foram os de adição de exercício (44,2s) e edição de dados do plano (34,0s), ambos relacionados à entrada de dados via teclado — área que concentra as principais melhorias propostas.

## Problemas identificados e prioridades

| **Prioridade** | **Problema identificado** | **Impacto** | **Ação proposta** |
|----------------|---------------------------|-------------|-------------------|
| Moderado | Usuários menos experientes demoram mais para identificar alguns campos numéricos. | Pode aumentar o tempo de registro durante o treino. | Reforçar rótulos e aumentar contraste/tamanho de campos críticos. |
| Moderado | Botões rápidos podem ser tocados incorretamente em uso apressado. | Pode registrar valores incorretos se o usuário não revisar. | Aumentar área de toque e melhorar espaçamento entre botões. |
| Moderado | Usuário com menor familiaridade tentou editar o nome do exercício manualmente em vez de selecionar pelo plano. | Pode causar confusão entre editar o plano e selecionar exercício para o treino. | Tornar mais explícita a instrução de seleção no card, com texto de apoio ou ícone de indicação. |
| Leve | Botão de pausa do cronômetro pode não estar suficientemente destacado para todos os perfis. | Usuário pode não conseguir pausar o descanso rapidamente. | Aumentar contraste ou tamanho do botão de pausa no modal do cronômetro. |
| Leve | Campos obrigatórios ainda não estão visualmente destacados antes do erro. | Usuário pode tentar salvar/registrar com dados incompletos. | Indicar obrigatoriedade com destaque visual ou mensagem preventiva. |
| Leve | Texto do tutorial pode ficar pequeno para alguns usuários. | Pode dificultar a leitura contínua das instruções durante o treino. | Aumentar tamanho da fonte e melhorar espaçamento entre linhas no guia de exercícios. |

## Melhorias propostas

- Ampliar a área de toque dos botões rápidos na tela de registro.
- Destacar campos obrigatórios de carga, repetições, séries e nome do exercício.
- Adicionar instrução ou ícone de orientação nos cards do plano para deixar mais claro que o exercício deve ser selecionado da lista, não editado manualmente.
- Revisar o destaque visual do botão de pausa no modal do cronômetro de descanso para facilitar o uso por usuários com menor acuidade visual ou menos familiaridade com a interface.
- Testar novamente o fluxo em celular físico, além do emulador Android.
- Registrar evidências formais com prints ou screencasts para cada cenário avaliado.

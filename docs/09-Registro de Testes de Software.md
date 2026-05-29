# Registro de Testes de Software

Este documento registra os testes realizados nas funcionalidades implementadas em formato de interface mock no aplicativo VivaFit. Os testes foram executados no ambiente de desenvolvimento com Expo/React Native, utilizando emulador Android, com o objetivo de validar se as telas atendem aos fluxos previstos para os requisitos funcionais.

## Registros dos casos de teste

### RF-003

| **Caso de Teste** | **CT-RF003-01 - Acessar tela de Plano de Treino** |
|:---:|:---|
| Requisito Associado | RF-003 - O sistema deve permitir que o usuário registre e organize o plano de treino indicado pelo seu profissional de Educação Física, definindo exercícios, séries e repetições. |
| Procedimento executado | O aplicativo foi iniciado no emulador Android. A partir da tela inicial, foi utilizada a navegação inferior para acessar a opção **Plano**. |
| Resultado obtido | A tela **Plano de Treino** foi exibida corretamente, apresentando título, resumo do plano, dados do plano e lista de exercícios cadastrados. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast da tela **Plano de Treino** no emulador. |

| **Caso de Teste** | **CT-RF003-02 - Registrar dados gerais do plano de treino** |
|:---:|:---|
| Requisito Associado | RF-003 - O sistema deve permitir que o usuário registre e organize o plano de treino indicado pelo seu profissional de Educação Física, definindo exercícios, séries e repetições. |
| Procedimento executado | Na tela **Plano de Treino**, foram preenchidos/editados os campos **Nome do plano** e **Profissional responsável**. |
| Resultado obtido | Os campos aceitaram edição normalmente e permaneceram visíveis na interface, permitindo representar o plano indicado por profissional de Educação Física. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast com os campos preenchidos. |

| **Caso de Teste** | **CT-RF003-03 - Adicionar e organizar exercícios no plano** |
|:---:|:---|
| Requisito Associado | RF-003 - O sistema deve permitir que o usuário registre e organize o plano de treino indicado pelo seu profissional de Educação Física, definindo exercícios, séries e repetições. |
| Procedimento executado | Na tela **Plano de Treino**, foi acionado o botão **Adicionar exercício**. Em seguida, foram preenchidos os campos de nome do exercício, séries e repetições. |
| Resultado obtido | Um novo card de exercício foi adicionado à lista. Os campos de exercício, séries e repetições aceitaram preenchimento e a interface atualizou o resumo do exercício com os dados informados. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast adicionando um exercício ao plano. |

| **Caso de Teste** | **CT-RF003-04 - Remover exercício do plano** |
|:---:|:---|
| Requisito Associado | RF-003 - O sistema deve permitir que o usuário registre e organize o plano de treino indicado pelo seu profissional de Educação Física, definindo exercícios, séries e repetições. |
| Procedimento executado | Na tela **Plano de Treino**, foi selecionada a opção **Remover** em um card de exercício já existente. |
| Resultado obtido | O exercício foi removido da lista e o contador de exercícios cadastrados foi atualizado na interface. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast removendo um exercício. |

| **Caso de Teste** | **CT-RF003-05 - Salvar plano de treino em modo mock** |
|:---:|:---|
| Requisito Associado | RF-003 - O sistema deve permitir que o usuário registre e organize o plano de treino indicado pelo seu profissional de Educação Física, definindo exercícios, séries e repetições. |
| Procedimento executado | Após editar os dados do plano e os exercícios, foi acionado o botão **Salvar plano**. |
| Resultado obtido | O sistema exibiu uma mensagem de confirmação informando que o plano foi salvo no mock visual. |
| Status | Aprovado com observação |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast da mensagem de confirmação. |

---

### RF-004

| **Caso de Teste** | **CT-RF004-01 - Acessar tela de Registro de Treino** |
|:---:|:---|
| Requisito Associado | RF-004 - O sistema deve permitir registrar a execução de exercícios com carga e repetições realizadas em até 5 segundos. |
| Procedimento executado | O aplicativo foi iniciado no emulador Android. A partir da navegação inferior, foi selecionada a opção **Registro**. |
| Resultado obtido | A tela **Treino em execução** foi exibida corretamente, apresentando exercício atual, campo de carga, campo de repetições, botões rápidos e lista de séries registradas. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast da tela **Registro**. |

| **Caso de Teste** | **CT-RF004-02 - Registrar execução de série com carga e repetições** |
|:---:|:---|
| Requisito Associado | RF-004 - O sistema deve permitir registrar a execução de exercícios com carga e repetições realizadas em até 5 segundos. |
| Procedimento executado | Na tela **Treino em execução**, foram preenchidos os campos **Carga (kg)** e **Repetições**. Em seguida, foi acionado o botão **Registrar série**. |
| Resultado obtido | A série foi adicionada à lista de séries registradas e a aplicação exibiu mensagem de confirmação. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast registrando uma série. |

| **Caso de Teste** | **CT-RF004-03 - Utilizar botões rápidos de ajuste de carga e repetições** |
|:---:|:---|
| Requisito Associado | RF-004 - O sistema deve permitir registrar a execução de exercícios com carga e repetições realizadas em até 5 segundos. |
| Procedimento executado | Na tela **Treino em execução**, foram utilizados os botões rápidos **-5**, **+5**, **-1** e **+1** para alterar carga e repetições antes do registro da série. |
| Resultado obtido | Os valores de carga e repetições foram atualizados imediatamente, reduzindo a quantidade de digitação necessária durante o treino. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast usando os botões rápidos. |

| **Caso de Teste** | **CT-RF004-04 - Validar campos obrigatórios antes do registro** |
|:---:|:---|
| Requisito Associado | RF-004 - O sistema deve permitir registrar a execução de exercícios com carga e repetições realizadas em até 5 segundos. |
| Procedimento executado | Na tela **Treino em execução**, foi removido o valor de carga ou repetições e acionado o botão **Registrar série**. |
| Resultado obtido | A aplicação exibiu uma mensagem de alerta solicitando o preenchimento dos campos obrigatórios antes de registrar. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast da validação dos campos obrigatórios. |

| **Caso de Teste** | **CT-RF004-05 - Alternar exercício atual durante o treino** |
|:---:|:---|
| Requisito Associado | RF-004 - O sistema deve permitir registrar a execução de exercícios com carga e repetições realizadas em até 5 segundos. |
| Procedimento executado | Na tela **Treino em execução**, foi selecionado outro exercício na lista de exercícios planejados. |
| Resultado obtido | O exercício atual foi alterado na interface, permitindo registrar carga e repetições para outro exercício do treino. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast alternando o exercício atual. |

---

### RF-007

| **Caso de Teste** | **CT-RF007-01 - Analisar a evolução do gráfico das cargas de cada exercício programado pelo Personal Trainer.** |
|:---:|:---|
| Requisito Associado | RF-007 - O Sistema deve permitir visualizar gráfico e evolução de carga por exercício ao longo do tempo. |
| Procedimento executado | Na tela **Ver Progresso**, com um tipo de exercício já selecionado, o gráfico apresenta a evolução do peso da carga e sua evolução ao longo do tempo. Por meio do opção de lista suspensa **Selecionar exercício**. |
| Resultado obtido | O campo **Exercício selecionado** foi atualizado imediatamente, juntamente com a atualização do seu gráfico em questão. Na tela apresentada abaixo, foi selecionado o exercício Supino Inclinado (Halteres). |
| Status | Aprovação Temporária |
| Registro de evidência | <img width="721" height="1600" alt="image" src="https://github.com/user-attachments/assets/db20cb67-a15f-4916-9e88-35c332623859" />

---

### RF-008

| **Caso de Teste** | **CT-RF008-01 - Ter fácil acesso ao seu Histórico de Peso registrado pelo usuário ao longo dos dias.** |
|:---:|:---|
| Requisito Associado | RF-008 - O sistema deve permitir registrar peso corporal e visualizar histórico em formato de lista. |
| Procedimento executado | Na tela **Ver Progresso**, logo abaixo, no card de **Registro de Peso**, o usuário (aluno) poderá digitar o seu peso corporal atual e na sequência clicar no botão **Salvar**. |
| Resultado obtido | Na lista abaixo, aparecerá todo o seu histórico do seu Peso Corporal, sendo possível conferir a sua evolução. |
| Status | Aprovado |
| Registro de evidência | <img width="720" height="1808" alt="image" src="https://github.com/user-attachments/assets/2f97b4ef-3cfe-4bd3-b28e-d37a2ad23cbf" />

---

### RF-009

| **Caso de Teste** | **CT-RF009-01 - Selecionar exercício diferente durante a execução do treino** |
|:---:|:---|
| Requisito Associado | RF-009 - O sistema deve permitir editar ou substituir exercícios durante a execução do treino. |
| Procedimento executado | Na tela **Treino em execução**, com um exercício já selecionado, foi expandido um plano de treino e selecionado um exercício diferente por meio do botão **Selecionar**. |
| Resultado obtido | O campo **Exercício selecionado** foi atualizado imediatamente com o novo exercício. Os campos de carga e repetições foram limpos, e uma mensagem de confirmação com o nome do exercício escolhido foi exibida. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast demonstrando a substituição do exercício durante o treino. |
 
| **Caso de Teste** | **CT-RF009-02 - Registrar série após substituir exercício** |
|:---:|:---|
| Requisito Associado | RF-009 - O sistema deve permitir editar ou substituir exercícios durante a execução do treino. |
| Procedimento executado | Após substituir o exercício selecionado, foram preenchidos os campos **Carga (kg)** e **Repetições** e acionado o botão **Registrar série**. |
| Resultado obtido | A série foi registrada corretamente com o novo exercício, aparecendo na lista de séries do treino com os dados informados. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast registrando série com exercício substituído. |
 
| **Caso de Teste** | **CT-RF009-03 - Tentar registrar série sem exercício selecionado** |
|:---:|:---|
| Requisito Associado | RF-009 - O sistema deve permitir editar ou substituir exercícios durante a execução do treino. |
| Procedimento executado | Na tela **Treino em execução**, sem nenhum exercício selecionado, foi acionado o botão **Registrar série**. |
| Resultado obtido | A aplicação exibiu a mensagem de alerta "Selecione um exercício do plano acima", impedindo o registro sem exercício definido. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast da validação de exercício não selecionado. |

---

### RF-010

| **Caso de Teste** | **CT-RF010-01 - Visualizar seção de cronômetro de descanso na tela de registro** |
|:---:|:---|
| Requisito Associado | RF-010 - O sistema deve incluir cronômetro de descanso entre séries com notificação sonora. |
| Procedimento executado | Na tela **Treino em execução**, foi verificada a presença da seção **Descanso entre séries**, com as opções de duração e o botão de iniciar. |
| Resultado obtido | A seção foi exibida corretamente logo abaixo do botão **Registrar série**, apresentando os botões de seleção de tempo (30s, 1min, 1,5min, 2min) e o botão **Iniciar descanso**. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast da seção de descanso na tela de registro. |
 
| **Caso de Teste** | **CT-RF010-02 - Selecionar duração do descanso** |
|:---:|:---|
| Requisito Associado | RF-010 - O sistema deve incluir cronômetro de descanso entre séries com notificação sonora. |
| Procedimento executado | Na seção **Descanso entre séries**, foram tocados alternadamente os botões de duração disponíveis: **30s**, **1min**, **1,5min** e **2min**. |
| Resultado obtido | O botão selecionado foi destacado visualmente com alteração de cor de fundo, indicando a duração ativa. Apenas uma opção permaneceu ativa por vez. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast demonstrando a seleção das durações. |
 
| **Caso de Teste** | **CT-RF010-03 - Iniciar cronômetro de descanso manualmente** |
|:---:|:---|
| Requisito Associado | RF-010 - O sistema deve incluir cronômetro de descanso entre séries com notificação sonora. |
| Procedimento executado | Com uma duração selecionada, foi acionado o botão **Iniciar descanso** na seção correspondente. |
| Resultado obtido | Um modal de descanso foi exibido com a contagem regressiva iniciando a partir da duração selecionada, barra de progresso e botões **⏸ Pausar** e **Pular descanso**. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast do modal de cronômetro em execução. |
 
| **Caso de Teste** | **CT-RF010-04 - Iniciar cronômetro automaticamente ao registrar série** |
|:---:|:---|
| Requisito Associado | RF-010 - O sistema deve incluir cronômetro de descanso entre séries com notificação sonora. |
| Procedimento executado | Com exercício selecionado e campos preenchidos, foi acionado o botão **Registrar série**. |
| Resultado obtido | Após o registro da série, o modal de descanso foi aberto automaticamente com a contagem regressiva conforme a duração previamente selecionada, sem necessidade de ação adicional do usuário. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast do modal abrindo automaticamente após registro. |
 
| **Caso de Teste** | **CT-RF010-05 - Pausar e retomar o cronômetro de descanso** |
|:---:|:---|
| Requisito Associado | RF-010 - O sistema deve incluir cronômetro de descanso entre séries com notificação sonora. |
| Procedimento executado | Com o cronômetro em execução, foi acionado o botão **⏸ Pausar**. Após alguns segundos, foi acionado o botão **▶ Retomar**. |
| Resultado obtido | A contagem parou ao pausar e continuou do ponto onde estava ao retomar, sem reiniciar o tempo. O rótulo do botão alternou corretamente entre **⏸ Pausar** e **▶ Retomar**. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast demonstrando pausa e retomada do cronômetro. |
 
| **Caso de Teste** | **CT-RF010-06 - Pular o cronômetro de descanso** |
|:---:|:---|
| Requisito Associado | RF-010 - O sistema deve incluir cronômetro de descanso entre séries com notificação sonora. |
| Procedimento executado | Com o cronômetro em execução, foi acionado o botão **Pular descanso**. |
| Resultado obtido | O modal foi fechado imediatamente e o usuário retornou à tela de registro de treino, podendo registrar a próxima série sem aguardar o fim do descanso. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast do botão de pular descanso. |
 
| **Caso de Teste** | **CT-RF010-07 - Notificação ao fim do descanso** |
|:---:|:---|
| Requisito Associado | RF-010 - O sistema deve incluir cronômetro de descanso entre séries com notificação sonora. |
| Procedimento executado | O cronômetro foi iniciado com a duração de **30s** e aguardado até o término da contagem. |
| Resultado obtido | Ao atingir zero, o cronômetro exibiu o texto **"VAI!"** em destaque e a mensagem "Descanso concluído! Pronto para a próxima série?". O dispositivo emitiu vibração de notificação. Em dispositivos com o arquivo de som configurado (`assets/alarme.mp3`), o alarme sonoro também foi disparado. O botão passou a exibir **Continuar** para fechar o modal. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast da notificação ao fim do descanso. |
 
| **Caso de Teste** | **CT-RF010-08 - Feedback visual de alerta nos últimos segundos** |
|:---:|:---|
| Requisito Associado | RF-010 - O sistema deve incluir cronômetro de descanso entre séries com notificação sonora. |
| Procedimento executado | O cronômetro foi iniciado e observado nos últimos 10 segundos da contagem regressiva. |
| Resultado obtido | A cor do temporizador alterou para vermelho ao atingir 10 segundos restantes, e a animação de pulso foi ativada nos últimos 3 segundos, reforçando o alerta visual de proximidade do fim do descanso. |
| Status | Aprovado |
| Registro de evidência | Pendente de anexação: inserir link para print ou screencast do alerta visual nos últimos segundos. |

---

### RF-011

| **Caso de Teste** | **CT-RF011-01 - Visualizar tutorial de exercício** |
|:---:|:---|
| **Requisito Associado** | RF-011 — O sistema deve permitir visualizar tutorial de cada exercício com instruções em texto. |
| **Objetivo do Teste** | Verificar se o usuário consegue acessar e visualizar corretamente o tutorial de um exercício. |
| **Passos** | 1. Abrir o aplicativo VivaFit.<br>2. Realizar login no sistema.<br>3. Acessar a tela `Guia de Exercícios`.<br>4. Selecionar um exercício disponível na lista.<br>5. Visualizar o tutorial e as instruções em texto do exercício selecionado. |
| **Critério de Êxito** | O tutorial do exercício é exibido corretamente com instruções legíveis e compreensíveis para o usuário. |

| **Caso de Teste** | **CT-RF011-02 - Navegar entre diferentes tutoriais** |
|:---:|:---|
| **Requisito Associado** | RF-011 — O sistema deve permitir visualizar tutorial de cada exercício com instruções em texto. |
| **Objetivo do Teste** | Verificar se o usuário consegue navegar entre diferentes exercícios e visualizar seus respectivos tutoriais. |
| **Passos** | 1. Abrir o aplicativo VivaFit.<br>2. Acessar a tela `Guia de Exercícios`.<br>3. Selecionar um exercício da lista.<br>4. Retornar para a lista de exercícios.<br>5. Selecionar outro exercício diferente. |
| **Critério de Êxito** | O sistema exibe corretamente o tutorial correspondente ao exercício selecionado sem apresentar erros de navegação. |

| **Caso de Teste** | **CT-RF011-03 - Verificar legibilidade das instruções** |
|:---:|:---|
| **Requisito Associado** | RF-011 — O sistema deve permitir visualizar tutorial de cada exercício com instruções em texto. |
| **Objetivo do Teste** | Verificar se as instruções dos exercícios possuem boa legibilidade e organização visual. |
| **Passos** | 1. Abrir o aplicativo VivaFit.<br>2. Acessar a tela `Guia de Exercícios`.<br>3. Selecionar um exercício.<br>4. Ler as instruções exibidas na tela. |
| **Critério de Êxito** | Os textos são exibidos de forma clara, organizada e com tamanho adequado para leitura durante o uso do aplicativo. |

## Relatório de testes de software

Os testes realizados nas funcionalidades RF-003, RF-004, RF-009 e RF-010 indicaram que as interfaces atendem aos fluxos principais previstos para a versão atual do VivaFit. Ao contrário da iteração anterior, em que os dados eram mantidos apenas em estado local da tela, as funcionalidades agora contam com persistência real por meio do Firebase Cloud Firestore.
 
**RF-003 — Plano de treino**
 
A funcionalidade permite ao usuário registrar e organizar o plano indicado pelo profissional de Educação Física, definindo exercícios, séries e repetições. Os dados do plano são persistidos no banco de dados e ficam disponíveis na tela de registro ao recarregar a tela, eliminando a limitação de estado local da versão anterior. Todos os cinco casos de teste foram aprovados.
 
**RF-004 — Registro de treino**
 
A tela de **Treino em execução** carrega automaticamente os planos cadastrados no banco ao entrar em foco, integrando diretamente o plano criado na RF-003 com os exercícios disponíveis para registro — integração que estava ausente na versão anterior. A tela prioriza interação rápida, com botões de ajuste de carga e repetições e validação dos campos obrigatórios antes do registro. Ao finalizar, a sessão é persistida no histórico via Firestore. Todos os cinco casos de teste foram aprovados.
 
**RF-009 — Substituição de exercícios durante o treino**
 
A funcionalidade foi implementada diretamente no fluxo existente da tela de registro. O usuário pode expandir qualquer plano carregado do banco e tocar em **Selecionar** em um exercício diferente a qualquer momento durante o treino, sem necessidade de reiniciar a sessão. A troca atualiza o campo de exercício ativo, limpa os campos de carga e repetições e exibe confirmação visual. A validação de exercício não selecionado permanece ativa, impedindo registros inválidos independentemente do estado de substituição. Os três casos de teste foram aprovados sem ressalvas.
 
**RF-010 — Cronômetro de descanso com notificação**
 
O cronômetro foi implementado como componente isolado. A integração com o fluxo de registro de série é direta: ao acionar **Registrar série**, o timer é disparado automaticamente com a duração previamente configurada, controle de pausa e retomada sem perda de estado, opção de pular o descanso e feedback visual progressivo com mudança de cor e animação de pulso nos últimos segundos. Sete dos oito casos de teste foram aprovados sem ressalvas; o caso CT-RF010-07 foi aprovado com observação referente à limitação do som no ambiente de emulação.
 
Como pontos fortes do conjunto, as telas apresentam navegação simples pela barra inferior, campos objetivos e organização visual coerente com a proposta do aplicativo. A integração entre plano de treino e registro de execução está funcional e persistida em banco de dados. A substituição de exercícios durante o treino e o cronômetro automático de descanso reduzem a fricção do uso real em academia.
 
As principais pendências para as próximas iterações são o registro de testes das demais funcionalidades e a anexação das evidências formais dos testes, preferencialmente por meio de prints ou screencasts executados no emulador Android, conforme solicitado no template de registro de testes.

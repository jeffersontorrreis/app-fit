# Plano de Testes de Usabilidade — VivaFit

Este documento descreve a estratégia de testes de usabilidade do aplicativo móvel **VivaFit**, com foco na experiência do usuário, acessibilidade e validação das principais funcionalidades do sistema.

## 1. Objetivos dos Testes

* **Objetivo Geral:** Verificar se os usuários conseguem utilizar as principais funcionalidades do aplicativo, como planos de treino e registros de exercícios, de forma intuitiva e sem dificuldades.

* **Objetivos Específicos:**
    * Avaliar a navegação entre as telas principais do aplicativo.
    * Identificar dificuldades no preenchimento de dados durante o treino.
    * Verificar a facilidade de uso dos atalhos rápidos de registro e do cronômetro de descanso.
    * Avaliar a compreensão da organização dos exercícios dentro do plano de treino.

---

## 2. Seleção dos Participantes

O teste será realizado com **5 participantes**, representando diferentes níveis de familiaridade com tecnologia e prática de atividades físicas.

| Perfil | Características |
| :--- | :--- |
| **Perfil 1** | Usuário iniciante em musculação, com conhecimento básico em tecnologia e pouca experiência com aplicativos fitness. |
| **Perfil 2** | Jovem adulto com alta familiaridade tecnológica e costume de utilizar aplicativos móveis no dia a dia. |
| **Perfil 3** | Usuário com pouca familiaridade com smartphones e dificuldade moderada em navegação digital. |
| **Perfil 4** | Frequentador regular de academia que acompanha cargas, repetições e desempenho nos treinos. |
| **Perfil 5** | Usuário com experiência intermediária em tecnologia e prática frequente de atividades físicas, buscando praticidade para registrar treinos. |

---

## 3. Cenários de Teste

### Cenário 1 — Acessar Plano de Treino

* **Objetivo:** Avaliar se a navegação até a tela de plano de treino é clara e intuitiva.

* **Contexto:** O usuário deseja acessar o plano de treino utilizando a navegação principal do aplicativo.

* **Tarefa:** Abrir o aplicativo e acessar a tela `Plano`.

* **Critério de Sucesso:** O usuário consegue localizar a tela sem dificuldades ou ajuda externa.

---

### Cenário 2 — Editar Dados do Plano de Treino

* **Objetivo:** Avaliar a clareza dos campos de edição do plano de treino.

* **Contexto:** O usuário deseja atualizar informações gerais do plano.

* **Tarefa:** Alterar o nome do plano e o profissional responsável.

* **Critério de Sucesso:** O usuário consegue editar os campos corretamente sem dificuldades no preenchimento.

---

### Cenário 3 — Adicionar Exercício ao Plano

* **Objetivo:** Verificar a facilidade de adicionar exercícios com séries e repetições.

* **Contexto:** O usuário deseja incluir um novo exercício no plano de treino.

* **Tarefa:** Adicionar um exercício, preencher séries e repetições e salvar o card do exercício.

* **Critério de Sucesso:** O usuário consegue concluir o preenchimento sem confusão na interface.

---

### Cenário 4 — Registrar Série Durante o Treino

* **Objetivo:** Avaliar a rapidez e clareza do registro de séries durante a execução do treino.

* **Contexto:** Durante o treino, o usuário deseja registrar carga e repetições realizadas.

* **Tarefa:** Informar carga, repetições e registrar a série.

* **Critério de Sucesso:** O usuário consegue registrar a série corretamente sem necessidade de orientação adicional.

---

### Cenário 5 — Utilizar Botões Rápidos de Ajuste

* **Objetivo:** Verificar se os atalhos rápidos facilitam o ajuste de carga e repetições.

* **Contexto:** O usuário deseja alterar rapidamente os valores do exercício durante o treino.

* **Tarefa:** Utilizar os botões de ajuste rápido (`+5`, `-5`, `+1` e `-1`) antes de registrar a série.

* **Critério de Sucesso:** O usuário consegue utilizar os atalhos corretamente sem erros frequentes.

---

### Cenário 6 — Substituir Exercício Durante o Treino

* **Objetivo:** Avaliar a facilidade de troca de exercícios durante a execução do treino.

* **Contexto:** O usuário deseja substituir um exercício atual por outro exercício disponível no plano.

* **Tarefa:** Selecionar outro exercício do plano e registrar uma nova série.

* **Critério de Sucesso:** O usuário consegue trocar o exercício sem interromper o fluxo do treino.

---

### Cenário 7 — Utilizar Cronômetro de Descanso

* **Objetivo:** Verificar a compreensão e usabilidade do cronômetro de descanso.

* **Contexto:** Após registrar uma série, o usuário deseja iniciar o descanso entre exercícios.

* **Tarefa:** Iniciar o cronômetro utilizando uma das opções rápidas disponíveis e aguardar o término da contagem.

* **Critério de Sucesso:** O usuário consegue iniciar e compreender o funcionamento do cronômetro sem dificuldades.

---

## 4. Métricas de Avaliação

### Métricas Quantitativas

* **Tempo de Registro:** Será medido o tempo entre a seleção do exercício e a confirmação do salvamento do treino. A meta é que o processo seja concluído em até 40 segundos. Tempos superiores podem indicar dificuldade de navegação ou excesso de etapas no fluxo.

* **Taxa de Conclusão:** Será verificado se os participantes conseguem concluir os cenários de teste sem dificuldades ou necessidade de auxílio externo.

* **Erros de Navegação:** Será registrada a quantidade de vezes em que o usuário acessa telas incorretas, seleciona botões errados ou retorna etapas do fluxo por confusão na interface. Um número elevado de erros pode indicar problemas de organização visual ou navegação.

* **Uso das Funcionalidades:** Será avaliado se o usuário consegue utilizar corretamente funcionalidades como edição do plano de treino, registro de séries, troca de exercícios, atalhos rápidos e cronômetro de descanso sem necessidade de orientação adicional.

### Métricas Qualitativas

* **Comentários e Dificuldades:** Registro das opiniões e dificuldades relatadas pelos participantes.

* **Observação de Comportamento:** Análise de dúvidas, hesitação ou facilidade durante o uso.

* **Nível de Satisfação:** Nota de 1 a 5 atribuída pelos participantes para a experiência de uso do sistema.

---

## 5. Acessibilidade e Interface

Será avaliado se botões, campos numéricos e elementos de navegação possuem tamanho e contraste adequados para uso durante os treinos, especialmente para usuários com menor familiaridade tecnológica. Também será observado se mensagens e feedbacks visuais são claros durante a interação.

---

## 6. Registro de Resultados

As falhas e oportunidades de melhoria identificadas durante os testes serão registradas no repositório do projeto no **GitHub** para acompanhar correções e ajustes realizados na aplicação. Capturas de tela e observações feitas pelos avaliadores também serão registradas.

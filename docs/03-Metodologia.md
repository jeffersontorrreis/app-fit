
# Metodologia

A metodologia do projeto VivaFit foi definida para orientar o desenvolvimento de uma aplicação móvel voltada à organização de treinos, ao registro de cargas e repetições e ao acompanhamento da evolução física dos usuários, em alinhamento com o problema apresentado na Documentação de Contexto e com os requisitos descritos na Especificação do Projeto. Considerando o objetivo de oferecer uma solução simples, intuitiva e acessível, capaz de incentivar hábitos saudáveis e contribuir para a promoção da saúde e do bem-estar, a equipe adotou uma abordagem organizada e incremental, com planejamento das atividades, definição de responsabilidades e validação contínua dos artefatos produzidos.

Além da construção da solução, esta seção apresenta os ambientes de trabalho utilizados pela equipe, a forma de organização do repositório e do código-fonte, bem como o processo de gestão das tarefas e da colaboração entre os integrantes. Dessa forma, a metodologia busca garantir coerência entre as necessidades dos usuários identificadas nas personas e histórias de usuário, as restrições do projeto e as decisões práticas que orientam o desenvolvimento da proposta.

## Relação de Ambientes de Trabalho

Os artefatos do projeto são desenvolvidos a partir de diversas plataformas e a relação dos ambientes com seu respectivo propósito é apresentada na tabela abaixo:

| Ambiente                            | Plataforma                         | Link de Acesso                                                                        |
|-------------------------------------|------------------------------------|--------------------------------------------------------------------------------------|
| Repositório de código fonte         | GitHub                             | [Link do Repositório](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-01-e3-projvivafit) |
| Documentação do projeto             | GitHub Docs (Markdown)             | [Pasta de Documentação](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-01-e3-projvivafit/tree/main/docs) |
| Projeto de Interface (Wireframes)   | Figma                 | [Link do Protótipo](https://www.figma.com/site/xJWuKaO8lkaTJJ6DJuYqWn/Wireframes-VivaFit?node-id=0-1&t=vRKdGTpXIe00TMGI-1)                                                               |
| Gerenciamento do Projeto (Kanban)   | GitHub Projects                    | [Quadro de Tarefas](https://github.com/orgs/ICEI-PUC-Minas-PMV-ADS/projects/2598/views/1)                                                               |
| Comunicação da Equipe               | Microsoft Teams / WhatsApp         | N/A (Grupo Privado)                                                                  |
| Ferramenta de Modelagem (UML)       | Lucidchart                         | [Diagrama de Classes](#)                                                             |
| Editor de Código                    | Visual Studio Code (VS Code)       | N/A (Ferramenta Local)                                                               |
| Ferramentas de SDK e Emulação       | Android Studio                     | N/A (Ferramenta Local)                                                               |


## Controle de Versão

A ferramenta de controle de versão adotada no projeto foi o
[Git](https://git-scm.com/), sendo que o [Github](https://github.com)
foi utilizado para hospedagem do repositório.

O projeto segue a seguinte convenção para o nome de branches:

- `main`: versão estável já testada do software
- `testing`: versão em testes do software
- `dev`: versão de desenvolvimento do software

Quanto à gerência de issues, o projeto adota a seguinte convenção para
etiquetas:

- `documentation`: melhorias ou acréscimos à documentação
- `bug`: uma funcionalidade encontra-se com problemas
- `enhancement`: uma funcionalidade precisa ser melhorada
- `feature`: uma nova funcionalidade precisa ser introduzida

O projeto utiliza o GitHub como ferramenta de versionamento. O fluxo de trabalho é feito por meio de pull requests abertos sempre ao desenvolvimento de novas funcionalidades, correções e alterações, passando por revisão antes de serem integrados à branch principal. As novas funcionalidades e correções são desenvolvidas em uma branch derivada de `dev`, integradas via pull request.

## Gerenciamento de Projeto

### Divisão de Papéis

Para o desenvolvimento do projeto VivaFit, a equipe adotou a metodologia ágil Scrum. Essa escolha ajudou a organizar melhor as tarefas e manter um fluxo de trabalho mais eficiente.
A equipe foi organizada da seguinte forma:

•	Scrum Master: Maria Luisa, responsável por acompanhar o andamento do projeto, organizar as reuniões e ajudar a resolver impedimentos que surgirem durante o desenvolvimento.

•	Product Owner: Jefferson, responsável por definir e priorizar as funcionalidades do aplicativo, sempre pensando na experiência do usuário. 

•	Equipe de Desenvolvimento: Erick, Dairly e José, responsáveis por construir as telas, componentes e funcionalidades do aplicativo. 

•	Equipe de Design: Alyne, responsável pela parte visual do aplicativo, incluindo layout, organização das informações e usabilidade.



### Processo

O projeto VivaFit será desenvolvido com base no framework Scrum, permitindo uma organização em etapas e melhor acompanhamento do progresso ao longo do desenvolvimento.
Inicialmente, será criado um backlog do projeto, que reunirá as principais etapas e funcionalidades do aplicativo. 

O desenvolvimento será dividido em sprints, nas quais as tarefas serão distribuídas entre os integrantes da equipe. Ao longo do processo, serão realizadas reuniões para alinhamento das atividades, acompanhamento do andamento do projeto e identificação de possíveis dificuldades.

O gerenciamento será feito por meio do GitHub, utilizando issues para registro das tarefas, labels para organização e associação entre commits e issues, garantindo maior controle e rastreabilidade.

Ao final de cada etapa, serão realizadas revisões do que foi desenvolvido e discussões para identificar melhorias, contribuindo para a evolução contínua do projeto.


### Ferramentas

As ferramentas utilizadas ao longo do projeto são:

- Editor de código;
- Ferramentas de comunicação;
- Ferramentas de design;
- Ferramentas de diagramação.

A definição das ferramentas de desenvolvimento levou em conta o impacto direto no controle de versionamento e na organização geral do projeto. As plataformas de comunicação adotadas, tanto para comunicação de forma instantâneas quanto para a realização de reuniões diárias, mostraram-se fundamentais para manter a integração e o alinhamento contínuo entre os membros da equipe. Na etapa de design, foram empregadas ferramentas especializadas na prototipagem, que possibilitaram a edição simultânea por um ou mais integrantes, favorecendo a colaboração e a agilidade ao longo do processo criativo. Por fim, optou-se por uma ferramenta de diagramação capaz de mapear as necessidades do produto de forma clara e estruturada, oferecendo uma visão abrangente do que está sendo desenvolvido.

 
| CATEGORIA | FERRAMENTA | JUSTIFICATIVA | 
|------------|---------------| ----------- |
| Editor de Código | VS Code | Selecionado pela capacidade de personalização, extensões que melhoram a produtividade, incluindo integração nativa com Git, ferramentas de depuração e intuitiva. |
| Framework | Expo | Adotado para o desenvolvimento de aplicações mobile com React Native, é didatico para ambientes controlados, oferece um ambiente simplificado e acesso a APIs nativas sem exigir configurações complexas. |
| Comunicação| WhatsApp, Microsoft Teams | Ideal e eficiente na colaboração em tempo real entre os membros da equipe. |
| Controle de Versão | Git e Github | Padrão e integra bem com o nosso ambiente. |
| Gerenciamento de Projeto | Github Project | Padrão e eficiente no gerenciamento de tarefas nas etapas do proejto. |
| Wireframing | Figma | Padrão e eficiente na criação de prototipos. |
| Diagrama | Astah | Simples e eficiente. |
| Diagrama | Draw.io | Simples, eficiente, recursos avançados e open source. |

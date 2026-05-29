# Plano de Testes de Software - VivaFit

Este documento descreve os cenários de testes utilizados para validar os requisitos funcionais da aplicação VivaFit, garantindo que as funcionalidades atendam às necessidades dos usuários e administradores.

---

## RF-001 — Cadastro de Usuário
**Requisito:** O sistema deve permitir que o usuário realize cadastro com e-mail e senha.

| Caso de Teste | CT-RF001-01 – Realizar cadastro de usuário |
|:---|:---|
| **Objetivo** | Verificar se o usuário consegue criar uma conta utilizando e-mail e senha. |
| **Passos** | 1. Abrir o aplicativo VivaFit.<br>2. Selecionar a opção "Criar conta".<br>3. Preencher e-mail e senha.<br>4. Confirmar senha.<br>5. Clicar em "Cadastrar". |
| **Critério de Êxito** | O cadastro é realizado com sucesso e o usuário é redirecionado para a tela principal. |

| Caso de Teste | CT-RF001-02 – Validar campos obrigatórios no cadastro |
|:---|:---|
| **Objetivo** | Verificar se o sistema valida campos obrigatórios. |
| **Passos** | 1. Abrir a tela de cadastro.<br>2. Deixar campos vazios.<br>3. Clicar em "Cadastrar". |
| **Critério de Êxito** | O sistema exibe mensagens de validação solicitando o preenchimento dos campos. |

---

## RF-002 — Login e Logout
**Requisito:** O sistema deve permitir que o usuário administrador/educador físico faça login e logout da aplicação.

| Caso de Teste | CT-RF002-01 – Realizar login |
|:---|:---|
| **Objetivo** | Verificar se o usuário consegue acessar o sistema. |
| **Passos** | 1. Abrir o aplicativo.<br>2. Informar e-mail e senha válidos.<br>3. Clicar em "Entrar". |
| **Critério de Êxito** | O usuário é autenticado e direcionado para a tela principal. |

| Caso de Teste | CT-RF002-02 – Realizar logout |
|:---|:---|
| **Objetivo** | Verificar se o usuário consegue sair da aplicação. |
| **Passos** | 1. Estar autenticado.<br>2. Acessar o menu do usuário.<br>3. Selecionar "Sair". |
| **Critério de Êxito** | O sistema encerra a sessão e retorna à tela de login. |

---

## RF-007 — Evolução de Carga
**Requisito:** O sistema deve permitir visualizar gráfico de evolução de carga por exercício ao longo do tempo.

| Caso de Teste | CT-RF007-01 – Visualizar gráfico de evolução |
|:---|:---|
| **Objetivo** | Verificar se o gráfico de evolução é exibido corretamente. |
| **Passos** | 1. Acessar a tela "Ver Progresso".<br>2. Selecionar um exercício. |
| **Critério de Êxito** | O gráfico é exibido e atualizado conforme o exercício selecionado. |

---

## RF-008 — Registro de Peso Corporal
**Requisito:** O sistema deve permitir registrar peso corporal e visualizar histórico em formato de lista.

| Caso de Teste | CT-RF008-01 – Registrar peso corporal |
|:---|:---|
| **Objetivo** | Verificar se o usuário consegue registrar o peso corporal. |
| **Passos** | 1. Acessar a tela "Ver Progresso".<br>2. Informar o peso corporal no campo correspondente.<br>3. Clicar em "Salvar". |
| **Critério de Êxito** | O peso é salvo e exibido corretamente no histórico de pesos em formato de lista. |

| Caso de Teste | CT-RF008-02 – Visualizar histórico de peso |
|:---|:---|
| **Objetivo** | Verificar se o histórico de peso é exibido corretamente. |
| **Passos** | 1. Registrar diferentes pesos ao longo do tempo.<br>2. Visualizar a lista de histórico na tela de progresso. |
| **Critério de Êxito** | O sistema exibe todos os registros realizados em uma lista cronológica. |

---

## RF-010 — Cronômetro de Descanso
**Requisito:** O sistema deve incluir cronômetro de descanso entre séries com notificação sonora.

| Caso de Teste | CT-RF010-01 – Iniciar cronômetro de descanso |
|:---|:---|
| **Objetivo** | Verificar funcionamento do cronômetro de descanso. |
| **Passos** | 1. Selecionar a duração do descanso.<br>2. Clicar em "Iniciar descanso". |
| **Critério de Êxito** | O cronômetro inicia corretamente com contagem regressiva visível. |

| Caso de Teste | CT-RF010-02 – Finalizar descanso com alerta |
|:---|:---|
| **Objetivo** | Verificar alerta sonoro e visual ao término do descanso. |
| **Passos** | 1. Iniciar o cronômetro.<br>2. Aguardar a finalização do tempo. |
| **Critério de Êxito** | O sistema emite vibração, alerta visual e som de notificação ao chegar em zero. |

---

## RF-014 — Relatórios Administrativos
**Requisito:** O sistema deve permitir visualizar relatório básico com total de usuários e treinos registrados.

| Caso de Teste | CT-RF014-01 – Visualizar relatório administrativo |
|:---|:---|
| **Objetivo** | Verificar visualização dos relatórios administrativos. |
| **Passos** | 1. Realizar login como administrador.<br>2. Acessar a tela "Relatórios". |
| **Critério de Êxito** | O sistema exibe corretamente o total de usuários e treinos cadastrados no sistema. |

---
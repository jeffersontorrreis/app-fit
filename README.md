# VivaFit

`Análise e Desenvolvimento de Sistemas` · `Projeto: Desenvolvimento de uma Aplicação Interativa`

## Estrutura do Monorepo

```
/
├── mobile/          # App React Native / Expo (iOS + Android)
├── admin-web/       # Painel Next.js para aprovação de professores
├── shared/          # Tipos TypeScript compartilhados
└── firebase/        # Regras do Firestore (firestore.rules)
```

## Como executar

### App Mobile
```bash
cd mobile && npm install && npx expo start
```

### Painel Admin Web
```bash
cd admin-web && npm install && npm run dev
# Acesse http://localhost:3000
```

## Sistema de Roles

| Role      | Status inicial | Acesso                                           |
|-----------|---------------|--------------------------------------------------|
| ALUNO     | ATIVO         | App mobile — treinos, histórico, progresso       |
| PROFESSOR | PENDENTE      | App mobile após aprovação — planos, alunos       |
| ADMIN     | ATIVO         | Painel web — aprovação/bloqueio de professores   |

### Fluxo de aprovação de professor
1. Professor se cadastra no app → `status: PENDENTE`, login bloqueado
2. Admin acessa `admin-web` → aba "Aguardando Aprovação"
3. Admin aprova → Firestore: `status: ATIVO`
4. Professor consegue logar normalmente

## Variáveis de ambiente

Copie `admin-web/.env.local.example` → `admin-web/.env.local` e preencha com as credenciais Firebase.

## Firestore Rules

```bash
firebase deploy --only firestore:rules
```

---

`Turma 06 - 2026/1 (3º Eixo)`

O VivaFit se destina a ajudar os praticantes de academia a organizar seus treinos e monitorar seu progresso físico. A aplicação possibilitará o planejamento de rotinas de exercícios, o registro de cargas e repetições, bem como a visualização do progresso ao longo do tempo, proporcionando maior controle, motivação e regularidade na prática de atividades físicas. O projeto, em consonância com a ODS 3 - Saúde e Bem-Estar, visa promover hábitos saudáveis por meio do uso acessível da tecnologia.

## Integrantes

* Aline Cristina Braz de Oliveira
* Darly Ribeiro Paim
* Erick Alexandre Mariano Lopes da Costa
* Jefferson Torres do Patrocinio
* José Carlos Miranda Leite
* Maria Luisa Resende Greco Madeira Silva

## Orientador

* Cristiano de Macêdo Neto

## Instruções de utilização

Assim que a primeira versão do sistema estiver disponível, deverá complementar com as instruções de utilização. Descreva como instalar eventuais dependências e como executar a aplicação.

# Documentação

<ol>
<li><a href="docs/01-Documentação de Contexto.md"> Documentação de Contexto</a></li>
<li><a href="docs/02-Especificação do Projeto.md"> Especificação do Projeto</a></li>
<li><a href="docs/03-Metodologia.md"> Metodologia</a></li>
<li><a href="docs/04-Projeto de Interface.md"> Projeto de Interface</a></li>
<li><a href="docs/05-Arquitetura da Solução.md"> Arquitetura da Solução</a></li>
<li><a href="docs/06-Template Padrão da Aplicação.md"> Template Padrão da Aplicação</a></li>
<li><a href="docs/07-Programação de Funcionalidades.md"> Programação de Funcionalidades</a></li>
<li><a href="docs/08-Plano de Testes de Software.md"> Plano de Testes de Software</a></li>
<li><a href="docs/09-Registro de Testes de Software.md"> Registro de Testes de Software</a></li>
<li><a href="docs/10-Plano de Testes de Usabilidade.md"> Plano de Testes de Usabilidade</a></li>
<li><a href="docs/11-Registro de Testes de Usabilidade.md"> Registro de Testes de Usabilidade</a></li>
<li><a href="docs/12-Apresentação do Projeto.md"> Apresentação do Projeto</a></li>
<li><a href="docs/13-Referências.md"> Referências</a></li>
</ol>

# Código

<li><a href="src/README.md"> Código Fonte</a></li>

# Apresentação

<li><a href="presentation/README.md"> Apresentação da solução</a></li>

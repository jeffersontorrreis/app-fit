# Integração com Firebase

Este documento descreve como a integração com `Firebase` foi estruturada no projeto, como configurar o ambiente e como reutilizar o padrão em outras funcionalidades.

## Objetivo

O projeto usa Firebase como base de autenticação e persistência remota:

- `Firebase Auth`: autenticação e sessão
- `Firebase Cloud Firestore`: dados do aplicativo

## O que foi implementado

Os repositórios do app mobile gravam e leem dados diretamente no Firestore.

Atualmente, as coleções principais usadas pelo app incluem:

- `users`
- `professorDocuments`
- `professorRequests`
- `studentEvaluations`
- `trainingPlans`
- `workoutSessions`
- `exercises`
- `bodyWeightEntries`

## Estrutura

| Caminho | Responsabilidade |
|---|---|
| `src/integrations/firebase/firebaseConfig.ts` | Lê variáveis de ambiente e valida a configuração do Firebase |
| `src/integrations/firebase/firebaseApp.ts` | Inicializa o app Firebase e retorna a instância do Firestore |
| `src/integrations/firebase/*.ts` | Integrações Firebase por domínio (auth, perfis, planos, solicitações etc.) |
| `src/database/repositories/*.ts` | Repositórios consumidos pelas telas, com persistência no Firestore |

## Por que essa estrutura é desacoplada

A tela não fala direto com `firebase/firestore`.

Ela conhece apenas o caso de uso:

```ts
syncCompletedWorkoutToCloud(...)
```

Isso ajuda em três pontos:

- facilita manutenção
- evita espalhar código de infraestrutura nas telas
- permite trocar o provedor no futuro com impacto menor

## Configuração do ambiente

### 1. Instalar a dependência

O projeto usa a SDK modular oficial:

```bash
npx expo install firebase
```

### 2. Criar o projeto no Firebase

No console do Firebase:

1. crie um projeto
2. registre um app do tipo `Web`
3. ative o `Cloud Firestore`

Referências oficiais:

- Expo: https://docs.expo.dev/guides/using-firebase
- Firebase setup: https://firebase.google.com/docs/web/setup
- Firestore: https://firebase.google.com/docs/firestore/quickstart

### 3. Configurar as variáveis

Use o arquivo `.env.example` como base e crie um `.env` na raiz do projeto.

Exemplo:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyEXAMPLE1234567890abcdefghijklmnop
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcd12
EXPO_PUBLIC_FIREBASE_WORKOUT_COLLECTION=workoutSessions
```

Observações:

- no Expo, variáveis usadas no app precisam do prefixo `EXPO_PUBLIC_`
- esses valores de configuração do Firebase Web App não são segredo de servidor, mas mesmo assim vale manter fora do código para organização
- se o `.env` mudar, faça um reload completo do app

## Fluxo atual do WorkoutLog

Hoje o fluxo funciona assim:

1. a tela monta as séries em memória
2. ao clicar em `Finalizar Treino`, o app salva o treino diretamente no Firestore (`workoutSessions`)
3. a tela de histórico consulta os dados no Firestore para exibir as sessões

## Modelo salvo no Firestore

Cada treino concluído é salvo como um documento em uma coleção, por padrão:

```text
workoutSessions
```

Estrutura do documento:

```json
{
  "performedAt": "2026-05-24T18:20:00.000Z",
  "createdAt": "2026-05-24T18:20:01.000Z",
  "user_uid": "firebase-auth-uid",
  "user": {
    "uid": "firebase-auth-uid"
  },
  "entries": [
    {
      "exercise_name": "Supino Reto",
      "load": 40,
      "reps": 10,
      "set_number": 1
    }
  ]
}
```

## Como reutilizar em outra funcionalidade

Se a equipe quiser enviar outra entidade para o Firebase, o padrão recomendado é:

1. criar um módulo novo em `src/modules/<feature>`
2. definir os contratos em um arquivo `contracts.ts`
3. criar a implementação do repositório Firebase no módulo
4. expor um caso de uso simples para a tela consumir
5. evitar importar `firebase/firestore` direto na UI

Exemplo de estrutura:

```text
src/modules/bodyWeightSync/
  contracts.ts
  firebaseBodyWeightCloudRepository.ts
  syncBodyWeightToCloud.ts
```

## Como trocar o provedor no futuro

Se no futuro vocês quiserem usar outro backend NoSQL, a ideia é manter:

- os contratos do módulo
- o caso de uso consumido pela tela

E trocar apenas a implementação da infraestrutura.

Na prática, a maior parte da mudança ficaria concentrada em arquivos como:

- `firebaseWorkoutCloudRepository.ts`
- `firebaseApp.ts`
- `firebaseConfig.ts`

## Boas práticas para a equipe

- manter a tela responsável só por entrada de dados e feedback visual
- centralizar configuração do Firebase em `src/integrations/firebase`
- não duplicar leitura de `process.env` em várias telas
- documentar o payload de cada coleção criada no Firestore
- sempre tratar falha da nuvem sem quebrar o fluxo local

## Situação atual

O app mobile está operando com persistência no Firebase (Auth + Firestore), com regras de acesso configuradas em `firebase/firestore.rules`.

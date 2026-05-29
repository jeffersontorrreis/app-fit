# InstruÃ§Ãµes de utilizaÃ§Ã£o

Este diretÃ³rio contÃ©m o cÃ³digo-fonte do aplicativo VivaFit, desenvolvido com React Native, Expo e Firebase.

## ExecuÃ§Ã£o do aplicativo

Para instalar as dependÃªncias do projeto, execute na raiz do repositÃ³rio:

```bash
npm install
```

Para iniciar o aplicativo com Expo:

```bash
npm start
```

TambÃ©m Ã© possÃ­vel executar diretamente em uma plataforma especÃ­fica:

```bash
npm run android
npm run ios
npm run web
```

## PersistÃªncia de dados

As operaÃ§Ãµes de dados do aplicativo sÃ£o persistidas no Firebase (Auth + Firestore).

Os repositÃ³rios de acesso a dados ficam em:

- `src/database/repositories`

## Estrutura principal

| Pasta | Finalidade |
|---|---|
| `bd` | Script SQL fÃ­sico do banco de dados |
| `components` | Componentes reutilizÃ¡veis da interface |
| `config` | ConfiguraÃ§Ãµes visuais, como cores e estilos |
| `context` | Contextos globais da aplicaÃ§Ã£o |
| `database` | RepositÃ³rios de acesso a dados (Firestore) |
| `navigation` | NavegaÃ§Ã£o principal do aplicativo |
| `screens` | Telas e fluxos da aplicaÃ§Ã£o |

## HistÃ³rico de versÃµes

### [1.0.0]

#### Adicionado

- Estrutura inicial do aplicativo VivaFit.
- ConfiguraÃ§Ã£o de navegaÃ§Ã£o, autenticaÃ§Ã£o e telas principais.
- IntegraÃ§Ã£o com Firebase Auth e Firestore para autenticaÃ§Ã£o e persistÃªncia.
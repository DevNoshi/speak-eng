# Speak Daily

App web (PWA) para estudar inglês no dia a dia, organizado como uma plataforma de cursos: trilhas, lições em etapas, quiz, XP, sequência de dias e metas diárias. Funciona no celular e no computador, abre offline depois do primeiro acesso e pode ser instalado na tela inicial.

## Funcionalidades

**Trilha de aprendizado**
- 3 módulos com 12 lições, cada um com barra de progresso:
  - **Fundamentos:** dias da semana, meses, anos e datas, números, horas.
  - **Vocabulário:** cores, família, verbos.
  - **Comunicação:** frases do dia a dia e 3 conversas (no café, pedindo direção, conhecendo alguém).
- Botão "Continuar" que leva à próxima lição ainda não concluída.

**Lições em 2 etapas**
1. **Aprender:** toque em cada frase para ouvir. Nas conversas, é possível ouvir frase por frase ou o diálogo inteiro.
2. **Praticar:** quiz de 5 perguntas ("Como se diz em inglês?") com feedback imediato. A lição é concluída com 60% ou mais, e a melhor nota fica salva.

**Praticar (revisão geral):** quiz com frases de todas as lições.

**Gamificação e metas**
- XP: 10 por acerto, mais 20 ao terminar um quiz.
- Sequência de dias seguidos de estudo.
- Metas diárias, que reiniciam todo dia: ouvir 10 frases, concluir 1 lição, acertar 10 perguntas.

**Pronúncia**
- Voz em inglês americano (en-US) do próprio aparelho, via Web Speech API, com modo "voz devagar".
- Não são gravações de pessoas nativas. A qualidade depende das vozes instaladas no dispositivo.

**Tema:** claro e escuro, com botão no cabeçalho. Sem escolha manual, o app segue o tema do sistema.

**PWA e offline:** manifest e service worker; instalável na tela inicial e disponível sem internet depois do primeiro acesso. Um cartão na Trilha orienta a instalação (botão "Instalar" no Android, passo a passo no iPhone).

**Progresso salvo no aparelho**
- Usa `localStorage` e pede armazenamento persistente ao navegador (`navigator.storage.persist()`).
- Aba **Metas → Backup do progresso:** exportar para um arquivo `.json` e importar em outro aparelho ou navegador.

## Estrutura do projeto

```
speak-daily/
├── index.html          # página única: cabeçalho, área do app e menu inferior
├── manifest.json       # configuração do PWA (nome, cores, ícones)
├── sw.js               # service worker: cache offline (versão em "V")
├── css/
│   └── style.css       # estilos, tema claro/escuro, layout mobile
├── js/
│   ├── theme.js        # botão de tema e preferência salva
│   ├── extra.js        # lições extras: horas, cores, família, verbos
│   ├── data.js         # lições base (dias, meses, anos, números, dia a dia) e conversas
│   └── app.js          # trilha, lições, quiz, voz, XP, metas, backup, instalação
├── imgs/
│   ├── icon.svg
│   ├── icon-180.png
│   └── icon-512.png
├── README.md
└── CHANGELOG.md
```

Ordem de carregamento dos scripts: `theme.js` → `extra.js` → `data.js` → `app.js`.

## Como publicar no GitHub Pages
1. Envie o conteúdo da pasta para um repositório, com `index.html` na raiz.
2. Em *Settings → Pages*, escolha a branch `main` e a pasta `/ (root)`.
3. Abra `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/` e, no celular, instale na tela inicial.

## Como adicionar conteúdo
- **Nova lição:** inclua um objeto `{id, n, i:[["inglês","português"], ...]}` em `js/extra.js` e coloque o `id` na lista `l` de um módulo em `M`, dentro de `js/app.js`.
- **Nova conversa:** inclua um item em `C` no `js/data.js` (`n` e `l:[["A","inglês","português"], ...]`) e adicione `"c3"`, `"c4"`… à lista de um módulo (o número segue a posição em `C`).
- **Depois de qualquer alteração:** troque a versão do cache em `sw.js` (por exemplo, `speakdaily-v5`). Sem isso, quem já visitou pode continuar vendo a versão antiga.

## Dados salvos no navegador

| Chave | Conteúdo |
|---|---|
| `sd2` | lições concluídas e melhor nota, XP, sequência, contadores do dia |
| `sd-theme` | tema escolhido (`light` ou `dark`) |
| `sd-hint` | se o aviso de instalação foi dispensado |

## Limitações conhecidas
- O progresso não sincroniza entre aparelhos; use exportar e importar. Não há login nem servidor.
- A pronúncia usa a voz do aparelho. Para áudio de nativos, seria preciso incluir gravações ou usar uma API de voz neural.
- O Safari no iPhone pode apagar dados de sites usados pouco; instalar na tela inicial reduz esse risco.
- O app não foi testado em todos os navegadores e aparelhos.

## Próximos passos possíveis
Revisão das frases mais erradas, mais lições por módulo, áudios gravados por nativos, login com sincronização na nuvem e empacotamento com Capacitor para as lojas Android e iOS.

# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [0.6.0] - 2026-11-12
### Adicionado
- Áudio com vozes neurais em MP3 (`audio/` e `audio/slow/`), gerado por `tools/gerar-audio.py`.
- Nas conversas, a pessoa A e a pessoa B têm vozes diferentes.
- Pré-carregamento dos áudios da lição aberta e cache offline dos MP3 (`speakdaily-audio-v1`).

### Alterado
- Voz de reserva do navegador: escolhe a melhor voz en-US disponível (Natural, Premium, Google), espera a lista de vozes carregar e troca o apóstrofo curvo por reto.
- "Voz devagar" da reserva de .65 para .75.
- Cache do service worker: `speakdaily-v5`.

### Corrigido
- "Ouvir tudo" continuava tocando depois de sair da lição.
- Realce da frase sumia ao tocar outra frase durante o áudio.

## [0.5.0] - 2026-11-10
### Adicionado
- Pedido de armazenamento persistente ao navegador para proteger o progresso.
- Exportar e importar progresso em arquivo `.json` (aba Metas), com validação do arquivo importado.
- Cartão de instalação na Trilha: botão "Instalar" no Android e instruções para o Safari no iPhone.

### Alterado
- Cache do service worker: `speakdaily-v4`.

## [0.4.0] - 2026-11-10
### Adicionado
- Interface no estilo plataforma de cursos: trilha com 3 módulos, 12 lições e barras de progresso.
- Lições em 2 etapas (Aprender e Praticar), com quiz de 5 perguntas e conclusão com 60% ou mais.
- Revisão geral (aba Praticar), XP, sequência de dias e metas diárias (aba Metas).
- Botão "Continuar" para a próxima lição pendente.
- Cabeçalho fixo com sequência e XP.

### Alterado
- Dados das lições separados em `js/data.js`.
- Formato do progresso salvo (chave `sd2`). O progresso da versão anterior não é aproveitado.
- Cache do service worker: `speakdaily-v3`.

## [0.3.0] - 2026-11-10
### Adicionado
- Botão de tema claro/escuro com preferência salva; sem escolha manual, segue o tema do sistema.

### Alterado
- Cache do service worker: `speakdaily-v2`.

## [0.2.0] - 2026-11-10
### Adicionado
- Projeto separado em pastas (`css/`, `js/`, `imgs/`) para publicação no GitHub Pages.
- PWA: `manifest.json`, service worker com cache offline e ícones.
- Novas lições: horas, cores, família e verbos.
- README com instruções de publicação.

## [0.1.0] - 2026-11-10
### Adicionado
- Primeira versão em arquivo único.
- Lições de dias, meses, anos e datas, números e frases do dia a dia, mais 3 conversas.
- Pronúncia em inglês americano (en-US) com modo devagar.
- Tarefas diárias e quiz de vocabulário.

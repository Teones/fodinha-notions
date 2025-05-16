# Fodinha - O Jogo (Site de Apoio)

Este é um site de apoio desenvolvido para auxiliar na contagem e gerenciamento de partidas do jogo de cartas "Fodinha". Ele permite registrar jogadores, controlar vidas, turnos, rodadas e um sistema de troféus para múltiplas etapas de jogo.

## 📜 Sumário

- [Visão Geral](#-visão-geral)
- [Recursos](#-recursos)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Como Executar Localmente](#-como-executar-localmente)
- [Como Usar o Site de Apoio](#-como-usar-o-site-de-apoio)
  - [1. Configuração Inicial](#1-configuração-inicial)
  - [2. Sorteio do Jogador Inicial](#2-sorteio-do-jogador-inicial)
  - [3. Durante o Jogo](#3-durante-o-jogo)
  - [4. Fim de uma Etapa](#4-fim-de-uma-etapa)
  - [5. Fim do Jogo Completo](#5-fim-do-jogo-completo)
- [Regras Básicas do Fodinha (Contexto)](#-regras-básicas-do-fodinha-contexto)
- [Funcionalidades Futuras (To-Do)](#-funcionalidades-futuras-to-do)
- [Contribuições](#-contribuições)

## 🎯 Visão Geral

O jogo "Fodinha" é um jogo de vaza onde os jogadores tentam adivinhar quantas vazas (rodadas) farão. Este site não implementa a lógica de cartas do jogo, mas serve como uma ferramenta para:

- Manter a contagem de vidas dos jogadores.
- Controlar o número de cartas/rodadas por turno.
- Indicar quem começa o turno e a rodada.
- Gerenciar um sistema de troféus para partidas mais longas com múltiplas "etapas".

## ✨ Recursos

- **Configuração de Jogadores:** Adicione de 3 a 10 jogadores com seus nomes.
- **Sorteio:** Sorteio animado para definir quem começa o primeiro turno.
- **Controle de Vidas:**
  - Cada jogador começa com 5 vidas (representadas por corações).
  - Interface visual para marcar vidas como "temporariamente perdidas" na rodada atual.
  - Possibilidade de restaurar vidas temporariamente perdidas antes de finalizar a rodada.
  - Confirmação da perda de vidas ao avançar para a próxima rodada.
- **Gerenciamento de Turnos e Rodadas:**
  - Exibição clara do turno atual, rodada atual e total de rodadas no turno.
  - Cálculo automático do número de cartas/rodadas por turno seguindo o ciclo do Fodinha (1 -> 5 -> 1 -> ciclo 2-5-1).
- **Marcadores Visuais:**
  - Indicação de qual jogador "começa o turno" (dealer).
  - Indicação de qual jogador "começa a rodada".
- **Sistema de Troféus e Etapas:**
  - Ao final de uma "etapa" (quando apenas um jogador resta com vidas), este jogador ganha um troféu.
  - Opção de "Continuar Jogo (Nova Etapa)", resetando as vidas e o jogo para uma nova disputa, mantendo os troféus.
  - Opção de "Declarar Vencedor Final" baseado em quem acumulou mais troféus.
  - Exibição de troféus (🏆) ao lado do nome dos jogadores.
- **Interface Intuitiva:** Design simples e focado na funcionalidade.

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura do site.
- **CSS3:** Estilização e layout.
- **JavaScript (Vanilla):** Lógica do jogo, manipulação do DOM e interatividade.
- **Ion Icons:** Ícones de coração e troféu.

## 🚀 Como Executar Localmente

1.  Clone este repositório ou baixe os arquivos.
    ```bash
    git clone https://[URL_DO_SEU_REPOSITORIO_SE_TIVER_NO_GIT]
    cd [NOME_DA_PASTA_DO_PROJETO]
    ```
2.  Abra o arquivo `index.html` em seu navegador de preferência.

Não há necessidade de instalação de dependências ou servidor, pois é um site estático.

## 🎲 Como Usar o Site de Apoio

### 1. Configuração Inicial

- Ao abrir o site, clique em **"Novo Jogo"**.
- Selecione a **quantidade de jogadores** (entre 3 e 10).
- Digite os **nomes dos jogadores** na ordem em que estão sentados à mesa (sentido horário).
- Clique em **"Sortear Jogador Inicial!"**.

### 2. Sorteio do Jogador Inicial

- Uma tela de sorteio aparecerá com os nomes dos jogadores.
- Clique em **"Sortear!"**.
- Após uma animação, o jogador que iniciará o primeiro turno será destacado.
- O jogo começará automaticamente.

### 3. Durante o Jogo

- **Informações do Turno:** No topo, você verá o Turno atual, a Rodada atual dentro do turno, e o número de cartas que cada jogador teria na mão (que também define o número de rodadas do turno).
- **Jogadores:** Cada jogador é exibido com:
  - Seu nome e troféus acumulados (se houver).
  - Marcadores "👑 Turno" (quem distribui/inicia o turno) e "➡️ Rodada" (quem joga primeiro na rodada).
  - Suas vidas restantes (❤️).
- **Perdendo Vidas:**
  - Se um jogador errar o palpite e precisar perder uma vida, clique em um dos seus ícones de coração vermelho (❤️). Ele se tornará um contorno (♡). Isso marca uma vida como "temporariamente perdida".
  - Se clicar por engano, clique novamente no coração com contorno (♡) para restaurá-lo para vermelho (❤️), desde que a rodada não tenha sido avançada.
- **Avançando:**
  - Após todos os palpites serem feitos e as vidas temporariamente marcadas, clique em **"Próxima Rodada"**. As vidas marcadas como "temporariamente perdidas" serão confirmadas como perdidas permanentemente.
  - O marcador "➡️ Rodada" passará para o próximo jogador vivo.
  - Se for a última rodada do turno, o botão mudará para **"Iniciar Próximo Turno"**. Ao clicar, o turno avança, o número de cartas/rodadas é atualizado, e o marcador "👑 Turno" (e "➡️ Rodada") passa para o próximo jogador vivo.

### 4. Fim de uma Etapa

- Uma "etapa" do jogo termina quando apenas um jogador sobra com vidas.
- Este jogador ganha **1 troféu** (🏆).
- Aparecerão duas opções:
  - **"Continuar Jogo (Nova Etapa)"**: Todos os jogadores voltam com 5 vidas, os troféus são mantidos, e uma nova etapa do jogo começa (Turno 1, Rodada 1). O vencedor da etapa anterior geralmente começa como o dealer da nova etapa.
  - **"Declarar Vencedor Final"**: O jogo é interrompido para verificar quem tem mais troféus e declarar o campeão geral.
- Se todos os jogadores forem eliminados simultaneamente, ninguém ganha troféu na etapa, mas as mesmas opções de continuar ou declarar o vencedor (baseado nos troféus já acumulados) aparecem.

### 5. Fim do Jogo Completo

- Ao clicar em **"Declarar Vencedor Final"**, o sistema verifica qual jogador possui mais troféus.
- Uma mensagem é exibida com o nome do(s) Grande(s) Campeão(ões).
- Para iniciar um jogo completamente novo do zero, clique em **"Encerrar Jogo (Menu)"** e depois em "Novo Jogo".

## 룰 Regras Básicas do Fodinha (Contexto)

- O número de cartas distribuídas aos jogadores varia a cada turno (e consequentemente o número de rodadas/vazas nesse turno).
  - O ciclo típico é: 1 carta, depois 2, 3, 4, 5 (máximo).
  - Depois desce: 4, 3, 2, 1.
  - Após chegar em 1 descendo, o ciclo recomeça subindo a partir de 2 cartas (2, 3, 4, 5), depois desce (4, 3, 2, 1), e assim por diante.
- Jogadores fazem "palpites" de quantas vazas acham que vão fazer.
- Quem erra o palpite, perde 1 vida.
- O jogo continua até que as condições de vitória da "etapa" ou do "jogo completo" (definidas pelo grupo) sejam alcançadas.

## 🔮 Funcionalidades Futuras (To-Do)

- [ ] **Salvar/Continuar Jogo:** Implementar `localStorage` para salvar o estado do jogo e permitir continuar partidas interrompidas.
- [ ] **Ranking Persistente:** Salvar pontuações e vencedores para um ranking histórico.
- [ ] **Entrada de Palpites:** Permitir que os jogadores insiram seus palpites e o número de vazas feitas para automatizar a perda de vidas.
- [ ] **Melhorias de UI/UX:**
  - Modais mais elegantes em vez de `alert()`.
  - Animações mais fluidas.
  - Feedback visual aprimorado.
- [ ] **Configurações Avançadas:** Opção para personalizar número de vidas iniciais, etc.
- [ ] **Modo escuro/claro alternável (se fizer sentido para o design).**

## 🤝 Contribuições

Contribuições, issues e sugestões de recursos são bem-vindas! Sinta-se à vontade para fazer um fork do projeto e submeter um pull request.

---

Feito com ❤️ para os amantes de Fodinha!

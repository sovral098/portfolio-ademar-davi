# Portfólio Pessoal — Ademar Davi

Portfólio pessoal desenvolvido com HTML5, CSS3 e JavaScript puro, com visual minimalista inspirado na paleta de cores da Aston Martin.

## Objetivo

Apresentar quem sou, minhas habilidades técnicas e meus projetos, além de servir como prática dos fundamentos do desenvolvimento Front-End: estrutura semântica, estilização, responsividade e interatividade básica.

## Tecnologias utilizadas

- **HTML5**: estrutura e conteúdo da página.
- **CSS3**: estilo, Flexbox, variáveis CSS, animações e media queries.
- **JavaScript puro**: animações controladas pela rolagem e comportamento da página.
- **Google Fonts**: fonte Inter.

Não foram utilizados frameworks nem bibliotecas.

## Estrutura de arquivos

```
portfolio/
├── index.html   # Estrutura e conteúdo da página (inclui o JavaScript)
├── style.css    # Estilos e animações
└── README.md    # Documentação do projeto
```

## Principais funcionalidades

- **Cabeçalho** com o nome Ademar Davi e menu (Início, Sobre, Habilidades, Projetos e Contato). Ele rola junto com a página e não fica fixo.
- **Navegação suave** entre as seções, feita com `scroll-behavior: smooth`.
- **Animação Clip Reveal** no título do Hero.
- **Fade-in das seções**: cada seção aparece suavemente ao entrar na tela.
- **Cards de projetos** e **tags de habilidades** com efeito hover.
- **Retorno ao topo ao atualizar** a página (F5).
- **Formulário de contato** com os campos Nome, E-mail e Mensagem. O envio ainda não existe e será implementado futuramente com backend; por isso o botão está desativado.

## Funcionamento da animação Clip Reveal

1. Cada linha do título fica dentro de uma "janela" (`overflow: hidden`).
2. O texto começa deslocado para baixo (`translateY(110%)`), fora da janela, e por isso fica invisível.
3. Quando o Hero aparece na tela, o JavaScript adiciona a classe `animate` ao título.
4. A classe `animate` ativa a animação `clipReveal` (840 ms), que leva o texto de baixo para cima.
5. A segunda e a terceira linha usam `animation-delay` de 90 ms e 180 ms, e assim aparecem em sequência.
6. Quando o Hero sai totalmente da tela, o `IntersectionObserver` remove a classe `animate`. O texto volta ao estado escondido, e a animação acontece de novo ao retornar ao topo.

## Responsividade

O site usa **Flexbox** e **media queries**:

- **Até 768 px (tablets e celulares)**: o cabeçalho passa a ser em coluna, o menu quebra linha e fica centralizado, o título diminui e os cards ficam um embaixo do outro.
- **Até 480 px (celulares pequenos)**: o título e os espaçamentos diminuem mais, e o botão do formulário ocupa toda a largura.
- As habilidades usam `flex-wrap` e quebram de linha sozinhas quando não cabem.

## Como executar o projeto

1. Baixe ou clone o repositório.
2. Abra o arquivo `index.html` em qualquer navegador.

Não é necessário instalar nada. Uma conexão com a internet é necessária apenas para carregar a fonte Inter.

## Possíveis melhorias futuras

- Implementar o envio do formulário de contato com backend.
- Adicionar imagens e links reais aos projetos.
- Incluir novas habilidades e projetos conforme os estudos avançarem.
- Adicionar JavaScript para outras interações.

## Autor

Ademar Davi, estudante de Engenharia de Software.

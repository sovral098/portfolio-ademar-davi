(() => {
    const cabecalho = document.querySelector(".cabecalho");
    const menu = document.querySelector(".controle-menu");
    const navegacao = document.querySelector("#navegacao");
    const telaEstreita = matchMedia("(max-width: 48rem)");
    const reduzirMovimento = matchMedia("(prefers-reduced-motion: reduce)");

    function ouvirPreferencia(consulta, atualizar) {
        if (consulta.addEventListener) consulta.addEventListener("change", atualizar);
        else consulta.addListener(atualizar);
    }

    function mostrarMenu(aberto) {
        cabecalho.classList.toggle("aberto", aberto);
        menu.setAttribute("aria-expanded", String(aberto));
        menu.querySelector(".rotulo-menu").textContent = aberto ? "Fechar" : "Menu";
    }

    function ajustarMenu() {
        mostrarMenu(false);
        menu.hidden = !telaEstreita.matches;
    }

    cabecalho.classList.add("com-menu");
    ajustarMenu();
    ouvirPreferencia(telaEstreita, ajustarMenu);
    menu.addEventListener("click", () => mostrarMenu(menu.getAttribute("aria-expanded") === "false"));
    navegacao.addEventListener("click", (evento) => {
        const link = evento.target.closest("a");
        if (!link || !cabecalho.classList.contains("aberto")) return;
        mostrarMenu(false);
        const destino = document.getElementById(link.hash.slice(1));
        if (destino) {
            destino.setAttribute("tabindex", "-1");
            destino.focus({ preventScroll: true });
        }
    });
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && cabecalho.classList.contains("aberto")) {
            mostrarMenu(false);
            menu.focus();
        }
    });
    document.addEventListener("click", (evento) => {
        if (cabecalho.classList.contains("aberto") && !cabecalho.contains(evento.target)) mostrarMenu(false);
    });

    const abertura = document.querySelector(".abertura");
    const controle = document.querySelector(".controle-movimento");
    const rotuloMovimento = controle.querySelector(".rotulo-movimento");
    let escolhaMovimento = null;
    let movimentoAtivo = false;
    let quadro = 0;
    let progressoAnterior = -1;

    function desenharCristal() {
        quadro = 0;
        if (!movimentoAtivo || abertura.classList.contains("fora-de-vista")) return;
        const area = abertura.getBoundingClientRect();
        const progresso = Math.min(1, Math.max(0, -area.top / (area.height * .47)));
        if (Math.abs(progresso - progressoAnterior) < .001) return;
        progressoAnterior = progresso;
        abertura.style.setProperty("--luz", (.9 + progresso * .1).toFixed(3));
        abertura.style.setProperty("--paralaxe", (progresso * 12).toFixed(1) + "px");
        abertura.style.setProperty("--desvio", (progresso * -22).toFixed(1) + "px");
        abertura.style.setProperty("--vidro", (progresso * 88).toFixed(1) + "px");
    }

    function agendarCristal() {
        if (quadro || !movimentoAtivo || abertura.classList.contains("fora-de-vista")) return;
        quadro = requestAnimationFrame(desenharCristal);
    }

    function ajustarMovimento() {
        movimentoAtivo = escolhaMovimento ?? !reduzirMovimento.matches;
        abertura.classList.toggle("pausada", !movimentoAtivo);
        rotuloMovimento.textContent = movimentoAtivo ? "Pausar movimento" : "Ativar movimento";
        agendarCristal();
    }

    controle.addEventListener("click", () => {
        escolhaMovimento = !movimentoAtivo;
        ajustarMovimento();
    });
    ouvirPreferencia(reduzirMovimento, ajustarMovimento);
    window.addEventListener("scroll", agendarCristal, { passive: true });
    window.addEventListener("resize", agendarCristal);
    ajustarMovimento();
    controle.disabled = false;

    if ("IntersectionObserver" in window) {
        const chegada = new IntersectionObserver((entradas, observador) => {
            for (const entrada of entradas) {
                if (!entrada.isIntersecting) continue;
                if (!reduzirMovimento.matches) entrada.target.classList.add("aparecendo");
                observador.unobserve(entrada.target);
            }
        }, { threshold: .07 });
        document.querySelectorAll(".revelar").forEach(elemento => chegada.observe(elemento));

        const luzVisivel = new IntersectionObserver(([entrada]) => {
            abertura.classList.toggle("fora-de-vista", !entrada.isIntersecting);
            if (entrada.isIntersecting) agendarCristal();
        });
        luzVisivel.observe(abertura);
    }

    const colecao = document.getElementById("cartoes");
    const projetos = Array.from(colecao.querySelectorAll("details"));
    const controles = document.querySelector(".folhear");
    const botoes = Array.from(controles.querySelectorAll("button"));
    const posicao = document.getElementById("posicao");
    let atual = 0;

    function folhear(indice) {
        atual = Math.max(0, Math.min(projetos.length - 1, indice));
        projetos.forEach((projeto, i) => {
            const visivel = i === atual;
            projeto.classList.toggle("atual", visivel);
            projeto.classList.toggle("ao-lado", !visivel);
            projeto.classList.toggle("antes", i < atual);
            projeto.classList.toggle("depois", i > atual);
            projeto.querySelector("summary").tabIndex = visivel ? 0 : -1;
            if (visivel) projeto.removeAttribute("aria-hidden");
            else {
                projeto.open = false;
                projeto.setAttribute("aria-hidden", "true");
            }
        });
        botoes.forEach(botao => {
            const alvo = atual + Number(botao.dataset.passo);
            botao.disabled = alvo < 0 || alvo >= projetos.length;
        });
        posicao.textContent = (atual + 1) + " / " + projetos.length;
    }

    function abrirProjetoDoLink() {
        const i = projetos.findIndex(projeto => "#" + projeto.id === location.hash);
        if (i >= 0) {
            folhear(i);
            projetos[i].open = true;
        }
    }

    colecao.classList.add("pronta");
    controles.hidden = projetos.length < 2;
    botoes.forEach(botao => botao.addEventListener("click", () => {
        folhear(atual + Number(botao.dataset.passo));
        if (botao.disabled) projetos[atual].querySelector("summary").focus({ preventScroll: true });
    }));
    projetos.forEach((projeto, i) => {
        projeto.querySelector("summary").addEventListener("click", evento => {
            if (atual === i) return;
            evento.preventDefault();
            folhear(i);
            projeto.querySelector("summary").focus({ preventScroll: true });
        });
    });
    colecao.addEventListener("keydown", evento => {
        if (!["ArrowLeft", "ArrowRight"].includes(evento.key)) return;
        evento.preventDefault();
        folhear(atual + (evento.key === "ArrowRight" ? 1 : -1));
        projetos[atual].querySelector("summary").focus({ preventScroll: true });
    });

    let inicioGesto = null;
    let ignorarClique = false;
    colecao.addEventListener("dragstart", evento => evento.preventDefault());
    colecao.addEventListener("pointerdown", evento => {
        ignorarClique = false;
        inicioGesto = evento.isPrimary && evento.button === 0 && evento.target.closest("summary")
            ? { id: evento.pointerId, x: evento.clientX, y: evento.clientY } : null;
    });
    window.addEventListener("pointercancel", () => { inicioGesto = null; });
    window.addEventListener("pointerup", evento => {
        if (!inicioGesto || evento.pointerId !== inicioGesto.id) return;
        const dx = evento.clientX - inicioGesto.x;
        const dy = evento.clientY - inicioGesto.y;
        inicioGesto = null;
        if (Math.abs(dx) < 35 || Math.abs(dx) < 1.4 * Math.abs(dy)) return;
        ignorarClique = true;
        folhear(atual + (dx < 0 ? 1 : -1));
    });
    colecao.addEventListener("click", evento => {
        if (ignorarClique && evento.detail > 0) {
            evento.preventDefault();
            evento.stopImmediatePropagation();
        }
        ignorarClique = false;
    }, true);
    folhear(0);
    abrirProjetoDoLink();
    window.addEventListener("hashchange", abrirProjetoDoLink);

    const formulario = document.querySelector(".form-contato");
    const nome = formulario.elements.nome;
    const email = formulario.elements.email;
    const assunto = formulario.elements.assunto;
    const estado = document.querySelector("#estado-contato");
    formulario.querySelector("button[type=submit]").disabled = false;

    function mostrarErro(campo, mensagem) {
        document.getElementById("erro-" + campo.id).textContent = mensagem;
        campo.setAttribute("aria-invalid", String(Boolean(mensagem)));
    }

    formulario.addEventListener("input", (evento) => {
        if (evento.target === nome || evento.target === email || evento.target === assunto) {
            mostrarErro(evento.target, "");
        }
        estado.textContent = "";
    });

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const erroNome = nome.value.trim() ? "" : "Informe seu nome.";
        let erroEmail = "";
        if (!email.value.trim()) erroEmail = "Informe seu e-mail.";
        else if (email.validity.typeMismatch) erroEmail = "Digite um e-mail válido, como nome@exemplo.com.";
        const erroAssunto = assunto.value.trim() ? "" : "Informe o assunto.";
        mostrarErro(nome, erroNome);
        mostrarErro(email, erroEmail);
        mostrarErro(assunto, erroAssunto);
        const primeiroInvalido = [[nome, erroNome], [email, erroEmail], [assunto, erroAssunto]]
            .find(([, mensagem]) => mensagem);
        if (primeiroInvalido) {
            estado.textContent = "";
            primeiroInvalido[0].focus();
            return;
        }
        estado.textContent = "Dados válidos. Esta demonstração não envia mensagens.";
    });
})();

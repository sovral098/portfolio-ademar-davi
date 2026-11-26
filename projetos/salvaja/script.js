(() => {
    const texto = document.getElementById("cert-text-input");
    const previa = document.getElementById("cert-preview-text");
    const arquivo = document.getElementById("cert-bg-upload");
    const quadro = document.getElementById("cert-preview-frame");
    const erro = document.getElementById("erro-imagem");
    let modeloAtual = "";
    let selecao = 0;

    function mostrarTexto() {
        previa.textContent = texto.value
            .split("{NOME}").join("Aluno de exemplo")
            .split("{PALESTRA}").join("Interfaces para a Web");
    }

    function trocarModelo(novo) {
        quadro.style.backgroundImage = novo ? 'url("' + novo + '")' : "";
        if (modeloAtual) URL.revokeObjectURL(modeloAtual);
        modeloAtual = novo;
    }

    arquivo.addEventListener("change", () => {
        const versao = ++selecao;
        const imagem = arquivo.files[0];
        erro.textContent = "";
        if (!imagem) {
            trocarModelo("");
            return;
        }
        if (!["image/png", "image/jpeg"].includes(imagem.type)) {
            erro.textContent = "Escolha uma imagem PNG ou JPG.";
            return;
        }
        const endereco = URL.createObjectURL(imagem);
        const teste = new Image();
        teste.onload = () => {
            if (versao === selecao) trocarModelo(endereco);
            else URL.revokeObjectURL(endereco);
        };
        teste.onerror = () => {
            URL.revokeObjectURL(endereco);
            if (versao === selecao) erro.textContent = "Não foi possível abrir essa imagem. Tente outro PNG ou JPG.";
        };
        teste.src = endereco;
    });
    texto.addEventListener("input", mostrarTexto);
    mostrarTexto();
})();

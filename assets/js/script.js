const inputCheck = document.querySelector('#modo-claro');
const elemento = document.querySelector('body');

inputCheck.addEventListener('click', () => {
    const modo = inputCheck.checked ? 'dark' : 'light';
    elemento.setAttribute("data-bs-theme", modo);
})


document.querySelector("#formulario__envio").addEventListener("click", function () {
    const nome = document.getElementById("floatingNome").value;
    const preferencia = document.getElementById("preferencia-contato").value;
    const satisfacao = document.getElementById("nivel-satisfacao").value;

    if (preferencia === "1") {
        // WhatsApp
        const mensagem = `Olá! Meu nome é ${nome}.
        Nível de satisfação: ${satisfacao}`;

        const numeroDestino = "5511946400631"; // seu número com DDI e DDD
        const url = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, "_blank");
    }
    else if (preferencia === "2") {
        // E-mail
        const assunto = "Formulário de contato do site";
        const corpo = `Bom dia, meu Nome: ${nome}
        Nível de satisfação: ${satisfacao}`;

        const mailto = `mailto:felyped03@gmail.com?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
        window.location.href = mailto;
    }
    else {
        alert("Por favor, escolha uma forma de contato!");
    }
});
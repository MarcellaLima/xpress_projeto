document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const plano = params.get("plano") || "Não selecionado";
  document.getElementById("plano").value = plano;

  const form = document.getElementById("formCadastro");
  const loadingMessage = document.getElementById("loadingMessage");
  const cpfInput = document.getElementById("cpf");
  const senhaInput = document.getElementById("senha");

  const togglePasswordButton = document.createElement("button");
  togglePasswordButton.type = "button";
  togglePasswordButton.textContent = "Mostrar Senha";
  togglePasswordButton.style.marginTop = "5px";

  senhaInput.parentNode.insertBefore(togglePasswordButton, senhaInput.nextSibling);

  togglePasswordButton.addEventListener("click", () => {
    if (senhaInput.type === "password") {
      senhaInput.type = "text";
      togglePasswordButton.textContent = "Esconder Senha";
    } else {
      senhaInput.type = "password";
      togglePasswordButton.textContent = "Mostrar Senha";
    }
  });

  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ""); 
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.charAt(10));
  }

  function senhaEhAlfanumerica(senha) {
    return /^[a-zA-Z0-9]+$/.test(senha);
  }

  function temSequenciaNumerica(senha) {
    const numeros = senha.replace(/\D/g, ""); 
    if (numeros.length < 3) return false; 

    for (let i = 0; i < numeros.length - 2; i++) {
      const a = parseInt(numeros[i]);
      const b = parseInt(numeros[i + 1]);
      const c = parseInt(numeros[i + 2]);

      if ((b === a + 1 && c === b + 1) || (b === a - 1 && c === b - 1)) {
        return true;
      }
    }
    return false;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    const cpf = cpfInput.value.trim();
    const senha = senhaInput.value.trim();

    // Validação do CPF
    if (!/^\d+$/.test(cpf)) {
      alert("O CPF deve conter apenas números.");
      cpfInput.focus();
      return;
    }
    if (!validarCPF(cpf)) {
      alert("CPF inválido. Verifique e tente novamente.");
      cpfInput.focus();
      return;
    }

    if (!senhaEhAlfanumerica(senha)) {
      alert("A senha deve conter apenas letras e números (sem símbolos).");
      senhaInput.focus();
      return;
    }

    if (temSequenciaNumerica(senha)) {
      alert("A senha não pode conter números sequenciais (ex: 123, 456, 987).");
      senhaInput.focus();
      return;
    }

    loadingMessage.style.display = "block";

    setTimeout(() => {
      loadingMessage.style.display = "none";
      alert("Cadastro realizado com sucesso!");
      form.reset();
      document.getElementById("plano").value = plano; 
    }, 2200);
  });
});

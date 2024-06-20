var listaElementos = [];

$(document).ready(function () {
    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val().replace(".", "").replace(".", "").replace(".", "").replace("-", ""),
                "ListaElementos": listaElementos
            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    ModalDialog("Sucesso!", r)
                    $("#formCadastro")[0].reset();
                }
        });
    });

    $('#cpf').on('input', function (e) {
        var cpf = e.target.value.replace(/\D/g, '');
        cpf = cpf.substring(0, 11);
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = cpf;
    });



    $('#idModal').on('shown.bs.modal', function () {
        popularTabela();
    });
});

document.getElementById('CPF').addEventListener('blur', function (e) {
    if (!validarCPF(e.target.value)) {
        e.target.classList.add('error');
        alert('CPF inválido.');
        e.target.value = '';
    } else {
        e.target.classList.remove('error');
    }
});


function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    if (cpf.length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(cpf.substring(10, 11))) return false;
    return true;
}

function popularTabela() {
    const tabelaBody = document.querySelector('#TabelaDados tbody');
    tabelaBody.innerHTML = '';

    listaElementos.forEach(dado => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dado.cpf}</td>
            <td>${dado.nome}</td>
            <td>
                <button class="btn btn-warning" onclick="editarLinha(this)">Editar</button>
                <button class="btn btn-danger" onclick="removerLinha(this)">Remover</button>
            </td>
        `;
        tabelaBody.appendChild(row);
    });
}

function removerLinha(button) {
    const row = button.closest('tr');
    const cpf = row.children[0].textContent;
    row.remove();
    listaElementos = listaElementos.filter(dado => dado.cpf !== cpf);
}

function editarLinha(button) {
    const row = button.closest('tr');
    const cpf = row.children[0].textContent;
    const nome = row.children[1].textContent;

    document.getElementById('cpf').value = cpf;
    document.getElementById('nome').value = nome;

    removerLinha(button);  
}

function Adicionar() {
    const cpf = document.getElementById('cpf').value;
    const nome = document.getElementById('nome').value;

    if (!validarCPF(cpf)) {
        alert('CPF inválido. Por favor, insira um CPF válido.');
        return;
    }

    const cpfsExistentes = listaElementos.map(dado => dado.cpf);

    if (cpfsExistentes.includes(cpf)) {
        alert('CPF duplicado. Por favor, insira um CPF diferente.');
        return;
    }

    listaElementos.push({ cpf, nome });

    popularTabela();

    document.getElementById('cpf').value = '';
    document.getElementById('nome').value = '';
}

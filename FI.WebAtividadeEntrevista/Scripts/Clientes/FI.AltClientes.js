var listaElementos = [];
$(document).ready(function () {
    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(obj.CPF);

        console.log('ListaElementos:', obj.ListaBeneficiario); // Verifique se ListaElementos está definido e contém os dados esperados
        // Verificar se ListaElementos está definido e não é vazio
        if (obj.ListaElementos && obj.ListaElementos.length > 0) {
            // Mapear os elementos de obj.ListaElementos para listaElementos
            listaElementos = obj.ListaBeneficiario.map(elemento => ({
                cpf: elemento.CPF || '', // Verificar se CPF está definido, senão definir como vazio
                nome: elemento.Nome || '' // Verificar se Nome está definido, senão definir como vazio
            }));
        }
        
    }

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
                window.location.href = urlRetorno;
            }
        });
    })


    $('#idModal').on('shown.bs.modal', function () {
        popularTabela();
    });
    
})
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length != 11) return false;


    if (cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" ||
        cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" ||
        cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" ||
        cpf == "99999999999")
        return false;


    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(9))) return false;


    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(10))) return false;
    return true;
}

document.getElementById('CPF').addEventListener('blur', function (e) {
    if (!validarCPF(e.target.value)) {
        e.target.classList.add('error');
        alert('CPF inválido.');
        e.target.value = '';
    } else {
        e.target.classList.remove('error');
    }
});



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

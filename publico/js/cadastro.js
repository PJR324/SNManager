//Espera o formulário ser enviado
//Ao ser enviado, ativa a função para registrar o usuário
document.getElementById('form-cadastro').addEventListener('submit', async function(event) {

    event.preventDefault();  //Impede a página de dar refresh (por causa do submit do form)

    console.log('cadastro ativado');

    const email = document.getElementById('inEmail').value;
    const senha = document.getElementById('inSenha').value;
    const senha2 = document.getElementById('inConfirmSenha').value;

    //Verifica se todos os dados tão preenchidos certinho
    if (!email || !senha || !senha2) {
        alert('Preencha os campos corretamente!');
        return;
    }

    //Vê se as senha e a confirmação tão iguais
    if (senha !== senha2) {
        document.getElementById('alertSenha').innerHTML = 'As senhas não coincidem.';
        return;
    }

    //Tenta executar o cadastro
    try {

        //Faz um fetch do tipo POST em /Cadastrar enviando o email e a senha, recebendo a resposta caso dê tudo certo
        const resposta = await fetch('/Cadastrar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, senha})
        });

        const resultado = await resposta.json();

        if (resposta.ok) {

            if (!resultado.sucesso) {

                alert('Este email já está cadastrado!');
                return;
            }

            window.location.href = '../entrar.html';
        }
        else {
            alert('Algo deu errado, tente novamente.');
        }
    }
    //Tentou e deu ruim? Retorna mensagem com erro
    catch (error) {
        console.error('Não deu pra logar: ', error);
    }
})
//Espera o formulário ser enviado
//Ao ser enviado, ativa a função para logar na conta do usuário
document.getElementById('form-login').addEventListener('submit', async function(event) {

    event.preventDefault();  //Impede a página de dar refresh (por causa do submit do form)

    console.log('login ativado');

    const email = document.getElementById('inEmail').value;
    const senha = document.getElementById('inSenha').value;

    //Verifica se todos os dados tão preenchidos certinho
    if (!email || !senha) {
        alert('Preencha os campos corretamente!');
        return;
    }

    //Tenta executar o login
    try {

        const resposta = await fetch('/Logar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha})
        });

        resultado = await resposta.json();

        if (resposta.ok) {

            //resposta.sucesso é igual a false caso o email ou a senha não forem encontrados no json
            if (!resultado.sucesso) {

                alert('Email ou senha incorretos!');
                return;
            }
            
            //Deu tudo certo? redireciona pro menu
            window.location.href = '../menu.html';
            
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
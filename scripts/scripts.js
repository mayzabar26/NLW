//1: CRIAR VARIÁVEIS
//Dê para as variáveis o mesmo nome dos ID ou classes que serão trabalhadas
const apiKeyInput = document.getElementById("apiKey")
const gameSelect = document.getElementById("gameSelect")
const questionInput = document.getElementById("questionInput")
const askButton = document.getElementById("askButton")
const aiResponse = document.getElementById("aiResponse")
const form = document.getElementById("form")
//Teste de verificar se o seletor das variáveis está correto: console.log(apiKeyInput)

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

//2: CRIAR FUNÇÕES
//2.1 Função: Perguntar AI
// Chave api: AIzaSyD03L0-jQK0KWWXSpDYMHu0aaUhj-e3eEg (NÃO PODE SER COMPARTILHADA, APAGAR DEPOIS)
const perguntarAI = async (question, game, apiKey) => {
    const model = "gemini-2.5-flash"
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const pergunta = `
    Olha, eu tenho esse jogo lol, queria saber melhor build para Joyce Top.
    `

    //Esse é o JSON
    const contents = [{
        parts: [{
            text: pergunta
        }]
    }]

    //1º Chamada API
    const response = await fetch(geminiUrl, { //iSSO É UMA PROMESSA
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ //stringify é uma função do JSON que pega um objeto do JS e transforma em JSON
            contents
        })
    })

    //2º Chamada API
    //Preciso esperar novamente pois o 1º await é resultado do fetch e ainda não é o arquivo JSON 
    const data = await response.json() //iSSO É UMA PROMESSA
    return data.candidates[0].content.parts[0].text
}


//2.2 Função: Enviar formulário
// - event para não atualizar form
// - Pegar valores do form
// - Condição para verificar se campos do form estão vazios
// - Desabilitar butão "Perguntar"
// - Manipular DOM: Mudar nome e criar classe
// - Habilitar butão novamente usanfo TRY | CATCH | FINALLY

const submitForm = async (event) => {
    event.preventDefault() //Não vai atualizar o formulário

    //Pegando valores do form (API KEY, Selecionar o game, perguntar)
    const apiKey = apiKeyInput.value 
    const game = gameSelect.value 
    const question = questionInput.value 


    //Condição: Verifica se campos do form estão vazios,
    //caso esteja, vai lançar msg de alerta. Caso não esteja, código continua
    if(apiKey == "" || game == "" || question == "") { //Verifica se tem campos vazios no form
        alert("Por favor, preencha todos os campos")
        return 
    }

    //Desabilita botão depois que o form for enviado
    askButton.disabled = true

    //Manipulação do DOM: 
    //1: Mudando o texto do butão
    //2: Criando uma classe "loading"
    askButton.textContent = "Perguntando..." //Muda texto "PERGUNTAR" para "PERGUNTANDO..."
    askButton.classList.add("loading") //Cria uma classe .loading

    //Habilita butão que estava desabilitado
    //Lógica para testar: TRY (tentar) / CATCH (pegar) / FINALLY (finalmente)
    try {
        const text = await perguntarAI(question, game, apiKey)
        aiResponse.querySelector(".response-content").innerHTML = markdownToHTML(text)

    //Se der problema o Catch pega
    } catch(error) {
        console.log('Erro: ', error)

    } finally { //Depois de tudo (dando certo ou errado) ele faz alguma coisa no finally.
        askButton.disabled = false
        askButton.textContent = "Perguntar"
        askButton.classList.remove("loading")
    }
}

form.addEventListener("submit", submitForm)


//1º RELEMBRAR:
//Uma função assíncrona é uma função que pode ser executada 
//sem bloquear a execução do restante do código, permitindo 
//que outras tarefas sejam realizadas enquanto ela aguarda o 
//resultado de operações potencialmente demoradas.


//2º RELEMBRAR:
//async é usado para definir uma função assíncrona, indicando
//que ela pode conter operações que não serão executadas 
//imediatamente, como chamadas de API ou leitura de arquivos.

//Uma função declarada com async sempre retornará uma Promise, 
//mesmo que não tenha explicitamente a palavra-chave return.


//3º RELEMBRAR:
//await só pode ser usado dentro de funções declaradas como async. 

//await pausa a execução da função async até que a Promise à sua direita seja resolvida. 
//Se a Promise for resolvida com sucesso, o valor da Promise é retornado. 
//Se a Promise for rejeitada, o erro é lançado e tratado com try...catch. 
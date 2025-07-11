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

//2.2: CRIAR FUNÇÕES
//2.2.1 Função: Perguntar AI
const perguntarAI = async (question, game, apiKey) => {
    const model = "gemini-2.5-flash"
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    
    //Variável com o modelo do prompt de resposta da AI
    const pergunta = `
      ## Especialidade
      Você é um especialista assistente de meta para o jogo ${game}

      ## Tarefa
      Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas

      ## Regras
      - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
      - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
      - Considere a data atual ${new Date().toLocaleDateString()}
      - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
      - Nunca responsda itens que vc não tenha certeza de que existe no patch atual.

      ## Resposta
      - Economize na resposta, seja direto e responda no máximo 500 caracteres
      - Responda em markdown
      - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

      ## Exemplo de resposta
      pergunta do usuário: Melhor build rengar jungle
      resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\nexemplo de runas\n\n
      
      ---
      Aqui está a pergunta do usuário: ${question}
    `

    //Esse é o JSON 
    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]

    //1º Chamada API
    const response = await fetch(geminiUrl, { //iSSO É UMA PROMESSA
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ //stringify é uma função do JSON que pega um objeto do JS e transforma em JSON
            contents,
            tools
        })
    })

    //2º Chamada API
    //Preciso esperar novamente pois o 1º await é resultado do fetch e ainda não é o arquivo JSON 
    const data = await response.json() //iSSO É UMA PROMESSA
    return data.candidates[0].content.parts[0].text
}


//2.1 FUNÇÃO: ENVIAR FORMULÁRIO
// - event para não atualizar form
// - Pegar valores do form
// - Condição para verificar se campos do form estão vazios
// - Desabilitar butão "Perguntar"
// - Manipular DOM: Mudar nome e criar classe
// - Habilitar butão novamente usando TRY | CATCH | FINALLY
const submitForm = async (event) => {
    event.preventDefault() //Não vai atualizar o formulário

    //2.1.1 Pegando valores do form (API KEY, Selecionar o game, perguntar)
    const apiKey = apiKeyInput.value 
    const game = gameSelect.value 
    const question = questionInput.value 

    //2.1.2 Condição > Verifica se campos do form estão vazios,
    if(apiKey == "" || game == "" || question == "") { 
        alert("Por favor, preencha todos os campos")
        return 
    }

    //2.1.3 Desabilita botão depois que o form for enviado
    askButton.disabled = true

    //2.1.4 Manipulação do DOM > Mudando o texto do butão | Criando uma classe "loading"
    askButton.textContent = "Perguntando..." //Muda texto "PERGUNTAR" > "PERGUNTANDO..."
    askButton.classList.add("loading") //Cria uma classe .loading

    //Habilita butão que estava desabilitado
    //Lógica para testar: TRY (tentar) / CATCH (pegar) / FINALLY (finalmente)
    try {
        const text = await perguntarAI(question, game, apiKey)
        aiResponse.querySelector(".response-content").innerHTML = markdownToHTML(text)
        aiResponse.classList.remove("hidden")

    //Se der problema o Catch pega
    } catch(error) {
        console.log('Erro: ', error)

    } finally { //Depois de tudo (dando certo ou errado) ele faz alguma coisa no finally.
        askButton.disabled = false
        askButton.textContent = "Perguntar"
        askButton.classList.remove("loading")
    }
}

//3 ADICIONAR EVENTO
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
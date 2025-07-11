//Criando as variáveis
//Dê para as variáveis o mesmo nome dos ID ou classes que serão trabalhadas
const apiKeyInput = document.getElementById("apiKey")
const gameSelect = document.getElementById("gameSelect")
const questionInput = document.getElementById("questionInput")
const askButton = document.getElementById("askButton")
const aiResponse = document.getElementById("aiResponse")
const form = document.getElementById("form")

//Verificar se o seletor está correto: console.log(apiKeyInput)

//Função para enviar formulário
const submitForm = (event) => {
    event.preventDefault() //Não vai atualizar o formulário
    console.log(event)
}

form.addEventListener("submit", submitForm)

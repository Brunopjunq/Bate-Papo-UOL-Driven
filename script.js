let username;

 function Login () { 
 username = prompt ("Qual o seu nome?");
 const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ',{name: username}); 
 promessa.then(InciarChat);
 promessa.catch(ReiniciarPagina);
 }

 function InciarChat () {
 CarregarMensagens();
 setInterval(CarregarMensagens, 3000);
 setInterval(ManterLogado, 5000);
 document.addEventListener("keyup", EnviarMsgEnter);
 }

 function ReiniciarPagina () {
 window.location.reload();
 }

 function CarregarMensagens () {
 const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
 promessa.then(RenderizarMensagens);
 }

 function ManterLogado () {
 axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name: username});
 }

 function EnviarMsgEnter (Enter) {
 if(Enter.keyCode === 13) {
    EnviarMensagem();
}
 }

 function RenderizarMensagens (resposta) {
 const main = document.querySelector('main');
 main.innerHTML = "";

 for (let i = 0; i < resposta.data.length ; i++) {
    if (resposta.data[i].type === "status") {
        main.innerHTML += `<ul class="Status"><p><span class="Horario">(${resposta.data[i].time})</span> <strong>${resposta.data[i].from}</strong> <span>${resposta.data[i].text}</span></p></ul>`
 }

    if (resposta.data[i].type === "message") {
        main.innerHTML += `<ul class="MensagemPub"><p><span class="Horario">(${resposta.data[i].time})</span> <strong>${resposta.data[i].from}</strong><span> para </span><strong>${resposta.data[i].to}</strong>: <span>${resposta.data[i].text}</span></p></ul>`
   }

    if (resposta.data[i].type === "private_message" && (resposta.data[i].to === username || resposta.data[i].from === username)) {
        main.innerHTML += `<ul class="MensagemPriv"><p><span class="Horario">(${resposta.data[i].time})</span> <strong>${resposta.data[i].from}</strong><span> reservadamente para </span><strong>${resposta.data[i].to}</strong>: <span>${resposta.data[i].text}</span></p></ul>`
    }
 
 }

main.lastElementChild.scrollIntoView();

}

 function EnviarMensagem() {

  if (document.querySelector("input").value !== ""){
    const Mensagem = {
        from: username,
        to: "Todos",
        text: document.querySelector("input").value,
        type: "message",
    }

    document.querySelector("input").value = "";
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", Mensagem);
    promessa.then(CarregarMensagens);
    promessa.catch(ReiniciarPagina);
  }

 }

 Login();

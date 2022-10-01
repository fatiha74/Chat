// défilement de la liste des message quand la page a fini de charger
window.addEventListener("DOMContentLoaded", () => {
  messagesList.scrollTop = messagesList.scrollHeight;
});

const messageInput = document.getElementById("message-input");
const messagesList = document.getElementById("message-list");
const form = document.getElementById("form");

// connection websocket
const socket = io();

// lors de l'envoi du formulaire
form.addEventListener("submit", function (e) {
  // envoie des données au serveur si le input n'est pas vide
  if (messageInput.value.length != 0) {
    socket.emit("message", messageInput.value);
  }
  // empêche le rechargement de la page
  e.preventDefault();
});

// s'éxecute lors de l'évènement "message"
// affiche le message envoyé par le serveur
socket.on("message", function (message, date) {
  // code HTML à insérer
  const msgHTML = `
    <div class="msg">
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">Anonymous</div>
          <div class="msg-info-time">
           ${date}
          </div>
        </div>
        <div class="msg-text">${message}</div>
      </div>
    </div>`;
  messagesList.innerHTML += msgHTML;
  // défilement vers le bas pour voir le nouveau message
  messagesList.scrollTop += 500;
  // effacement de l'input
  messageInput.value = "";
});

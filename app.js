//************* FONCTIONS ******************//

// enregistement d'un message dans la BDD
async function createMessage(content, date) {
  // connection à la bdd
  await mongoose.connect("mongodb://localhost:27017/digichat");
  // création d'un nouveau message
  // on créé un nouveau document en instanciant le model "Message"
  const message = new Message({
    content: content,
    date: date,
  });
  // enregistrement du document dans la bdd
  await message.save();
  // deconnexion de la bdd
  mongoose.disconnect();
}

// réupération des messages dans la BDD
async function getMessages() {
  await mongoose.connect("mongodb://localhost:27017/digichat");
  // récupération de tout les docs dans la collection Message
  const messages = await Message.find({}, ["content", "date"]);
  mongoose.disconnect();
  return messages;
}

//************* INIT ******************//

// creation d'une instance express
const express = require("express");
const app = express();

// le dossier public contient les fichiers statiques
const path = require("path");
app.use(express.static("public"));

// utilisation de ejs comme moteur de template
app.set("view engine", "ejs");

// routage vers la page d'accueil
app.get("/", async (req, res) => {
  // rendu du fichier index.ejs (par défaut Express cherche les fichiers dans un dossier "views")
  res.render("index", { messages: await getMessages() });
});

// création d'un serveur qui va gérer les messages de socket.io
const http = require("http");
const server = http.createServer(app);

// on écoute sur le port 3000
server.listen(3000, () => {
  console.log("server is running on port 3000");
});

// importation de socket.io dans le serveur créé
const io = require("socket.io")(server);

// création d'une instance mongoose
const mongoose = require("mongoose");
// importation du model Message (qui se trouve dans le dossiers models)
const Message = require("./models/Message");

//************* PROCESS DE SOCKET.IO ******************//

// s'execute lors de la connexion d'un client
io.on("connection", function (socket) {
  // affiche l'id du client
  console.log("A new client connected" + socket.id);

  // s'éxecute lors de l'évènement "message"
  socket.on("message", function (message) {
    // enregistrement de la date et de l'heure de l'emission du message
    const date = new Date();
    // conversion de la date en string lisible par un humain
    const dateLocaleFR = date.toLocaleString("fr-FR");
    // enregistrement du message en bbd avec la date
    createMessage(message, date);
    // envoie du message à tout les clients connectés avec la date locale
    io.emit("message", message, dateLocaleFR);
  });
});

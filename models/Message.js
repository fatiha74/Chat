const mongoose = require("mongoose");
// récupération de l'objet schema depuis mongoose.
// revient à écrire const Schema = mongoose.Schema;
const { Schema } = mongoose;

// schema d'un message
const messageShema = new Schema({
  content: String,
  date: Date,
});

// création d'une collection "Message" à partir du shéma "messageShema"
const messageCollection = mongoose.model("Message", messageShema);

// exportation du model pour qu'il soit accessible dans les autres fichiers
module.exports = messageCollection;

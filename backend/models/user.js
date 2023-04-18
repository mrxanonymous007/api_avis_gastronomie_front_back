//importation des packages
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//création du schéma de données pour le modèle UTILISATEUR de la base de donnée
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

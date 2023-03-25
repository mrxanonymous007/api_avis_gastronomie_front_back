const mongoose = require('mongoose');

//modèle de schéma : UTLISATEUR
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);

//importation des packages
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Définir les routes de l'API
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

// Connecter à la base de données MongoDB
mongoose.connect(YOUR_MONGODB_LINK_DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => { console.log('Connexion à MongoDB réussie !'); })
    .catch((err) => { console.log('Connexion à MongoDB échouée :', err); });

//appelation de Express
const app = express();

//Configuration des CORS
app.use((req, res, next) => {
    //permet l'accès à toutes les origines '*'
    res.setHeader('Access-Control-Allow-Origin', '*');
    //permet d'autoriser les en-têtes (headers)
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    //permet d'autoriser les méthodes GET, POST, PATCH...
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
});

//Parse les données en JSON
app.use(express.json());
//sert des fichiers statiques dans le dossier images lorsque l'URL commence par /images
app.use('/images', express.static(path.join(__dirname, 'images')));
//définition des routes pour l'api d'authentification
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;

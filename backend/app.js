const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');

// Définir les routes de l'API
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

// Parser les données POST en JSON
app.use(express.json());

// Connecter à la base de données MongoDB
mongoose.connect(`mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTERNAME>.olmtncp.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connexion à MongoDB réussie');
    })
    .catch((err) => {
        console.log('Connexion à MongoDB échouée :', err);
    });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

module.exports = app;

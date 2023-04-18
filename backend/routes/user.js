//importation des packages
const express = require('express');
const router = express.Router();

//importation de user depuis le dossier controllers pour l'api d'authentification
const userController = require('../controllers/user');

// Définition des routes pour les endpoints des utilisateurs pour créer un nouvel utilisateur
router.post('/signup', userController.signup);

// Définition des routes pour les endpoints des utilisateurs pour se connecter
router.post('/login', userController.login);

module.exports = router;

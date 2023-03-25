const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

//Définition des routes pour les endpoints des utilisateurs
// Créer un nouvel utilisateur
router.post('/signup', userController.signup);

// Connecter un utilisateur
router.post('/login', userController.login);

module.exports = router;

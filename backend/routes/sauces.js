//importation des packages
const express = require('express');
const router = express.Router();

//importation de sauce depuis le dossier controllers pour l'api des sauces
const sauceController = require('../controllers/sauces');

//importation de auth pour l'authentification
const auth = require('../middleware/auth');
//importation de multer-config contenant la config de multer
const multer = require('../middleware/multer-config');

//Définition des routes pour les endpoints des sauces
router.post('/', auth, multer, sauceController.createSauce);
router.get('/', auth, sauceController.getAllSauces);
router.get('/:id', auth, sauceController.getUniqueSauce);
router.put('/:id', auth, multer, sauceController.modifySauce);
router.delete('/:id', auth, sauceController.deleteSauce);
router.post('/:id/like', auth, sauceController.likeSauce);

module.exports = router;
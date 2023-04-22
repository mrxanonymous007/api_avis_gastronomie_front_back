//importation des packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//importation de user du répertoire models
const User = require('../models/user');

// Création d'un nouvel utilisateur
exports.signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Vérifier si le mot de passe satisfait les critères de la limite
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new Error('Le mot de passe doit comporter au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
        }

        const hash = await bcrypt.hash(password, 10);

        const user = new User({ email, password: hash });
        await user.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès !' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Connexion de l'utilisateur
exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            throw new Error('Utilisateur non trouvé !');
        }

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            throw new Error('Mot de passe incorrect !');
        }

        res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' })
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    // Vérifier si le mot de passe satisfait les critères de la limite
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({
            error: 'Le mot de passe doit comporter au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.'
        });
    }

    bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({
                email: email,
                password: hash
            });
            user.save()
                .then(() => {
                    res.status(201).json({
                        message: 'Utilisateur créé avec succès !'
                    });
                })
                .catch(error => {
                    res.status(400).json({
                        error: "L'adresse e-mail que vous avez entrée est déjà utilisée."
                    });
                });
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
};

//Connexion d'un utilisateur
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            const user = JSON.parse(sessionStorage.getItem('userId'));

            if (!user) {
                return res.status(401).json({
                    error: 'Adresse e-mail ou mot de passe incorrect.'
                });
            }

            bcrypt.compare(password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            message: 'Adresse e-mail ou mot de passe incorrect.'
                        });
                    }

                    const token = jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    );

                    sessionStorage.setItem('userId', user._id);
                    sessionStorage.setItem('token', token);

                    res.status(200).json({
                        userId: user._id,
                        token: token
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        error: error.message
                    });
                });
        })
        .catch(error => {
            res.status(500).json({
                error: error.message
            });
        });
};
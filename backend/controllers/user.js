//importation des packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//importation de user du répertoire models
const User = require('../models/user');

// Création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // Vérifier si le mot de passe satisfait les critères de la limite
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        // res.status(400).json({ error: 'Le mot de passe doit comporter au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.' });
        throw new Error('Le mot de passe doit comporter au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
    }

    bcrypt.hash(password, 10)
        .then(hash => {
            //récupère l'email et le password
            const user = new User({
                email: email,
                password: hash
            });
            user.save()
                .then(() => {
                    res.status(201).json({ message: 'Utilisateur créé avec succès !' });
                })
                .catch(error => {
                    // res.status(400).json({ error: "L'adresse e-mail que vous avez entrée est déjà utilisée." });
                    throw new Error("L'adresse e-mail que vous avez entrée est déjà utilisée.");
                });
        })
        .catch(error => {
            throw new Error(error);
        });
};

exports.login = (req, res, next) => {
    //permet de trouver notre seul et unique utilisateur correspont à l'email
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (!user) {
                // return res.status(401).json({ error: 'Utilisateur non trouvé !'});
                throw new Error('Utilisateur non trouvé !');
            }
            //compare le password inscrit par l'utilisateur et regarde dans la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        // return res.status(401).json({ error: 'Mot de passe incorrect !' });
                        throw new Error('Mot de passe incorrect !');
                    }
                    res.status(200).json({
                        //renvoi le userId et le token
                        userId: user._id,
                        //encodage de la fonction .sign()
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => {
                    throw new Error(error);
                });
        })
        // .catch(error => res.status(500).json({ error }));
        .catch(error => {
            throw new Error(error);
        });
};
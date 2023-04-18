const jwt = require('jsonwebtoken');

//export middleware permettant de vérifier et autoriser les utilisateurs à accéder à une ressource protégée
module.exports = (req, res, next) => {
    try {
        //récupération du token
        const token = req.headers.authorization.split(' ')[1];
        //décodage du token + vérif
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error: new Error('Requête invalide !') });
    }
};
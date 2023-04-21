//importation des packages
const http = require('http');
const app = require('./app');

//vérification du port si valide ou non pour utlisation de réseau
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

//Définition de notre port 
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//Gestion des erreurs en cas de problème de connexion, de privilèges insuffisants ou port déjà utilisé
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

//Création de notre serveur HTTP
const server = http.createServer(app);

//appelation de la fonction 'errorHandler' en cas d'erreur
server.on('error', errorHandler);
//affichage de message de confirmation dans la console (vscode) lorsque notre serveur est écouté sur un port donné
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);
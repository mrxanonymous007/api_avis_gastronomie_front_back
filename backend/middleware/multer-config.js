//importation du package
const multer = require('multer');

//Définition d'un dictionnaire des fichiers acceptés
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//Stockage des fichiers sur le serveur et renommage du nom de fichier avant de l'enregistrer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name ? '' + Date.now() + '.' + extension : name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');
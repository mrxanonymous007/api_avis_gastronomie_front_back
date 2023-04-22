//importation de sauces du répértoire models
const Sauce = require("../models/sauces");
//importation du package
const fs = require("fs");

//création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    //déclaration d'une instance d'une sauce
    const sauce = new Sauce({
        //récupération du 'name', 'description' etc avec le raccourci spread
        ...sauceObject,
        //récupération de l'url "généré" par multer
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce créé avec succès !' }))
        .catch((error) => res.status(400).json({ error }));
};

//récupérer toutes les sauces 
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

//récupération d'une sauce
exports.getUniqueSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

//modification de sauce
exports.modifySauce = async (req, res, next) => {
    try {
        const sauceObject = req.file
            ? {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            }
            : { ...req.body };
        await Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id });
        res.status(200).json({ message: 'Sauce modifiée' });
    } catch (error) {
        throw new Error(error);
    }
}

//suppression d'une sauce
exports.deleteSauce = async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id })
        if (!sauce) {
            throw new Error('Sauce non trouvée !');
        }
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, async () => {
            try {
                await Sauce.deleteOne({ _id: req.params.id });
                res.status(200).json({ message: 'Sauce supprimée' });
            } catch (error) {
                throw new Error('Suppression de la sauce échouée!');
            }
        })
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
}

//like, dislike ou retrait de like/dislike d'une sauce
exports.likeSauce = (req, res) => {
    //recherche un objet sauce dans la bdd qui correspond à l'id passé en paramètre de la requête
    Sauce.findOne({
        _id: req.params.id
    }).then(sauce => {
        //si dislike d'une sauce par un utilisateur
        if (req.body.like == -1) {
            sauce.dislikes++;
            sauce.usersDisliked.push(req.body.userId);
            sauce.save();
        }
        //gestion pour le retrait de like ou dislike d'un utlisateur sur une sauce
        if (req.body.like == 0) {
            //vérification si l'utilisateur a liké une sauce sinon décrémentation et retrait du like
            if (sauce.usersLiked.indexOf(req.body.userId) != -1) {
                sauce.likes--;
                sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);
            } else {
                sauce.dislikes--;
                sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId), 1);
            }
            sauce.save();
        }
        //si like d'une sauce par un utlisateur
        if (req.body.like == 1) {
            sauce.likes++;
            sauce.usersLiked.push(req.body.userId);
            sauce.save();
        }
        res.status(200).json({ message: 'Votre Like/Dislike a bien été pris en compte !' })
    })
        .catch(error => {
            res.status(500).json({ error })
        });

};

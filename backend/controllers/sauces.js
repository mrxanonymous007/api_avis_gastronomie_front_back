const Sauce = require("../models/sauces");
const fs = require("fs");

//création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    });
    sauce
        .save()
        .then(() => res.status(201).json({ message: "Objet enregistré" }))
        .catch((error) => res.status(400).json({ error }));
};

//récupérer toutes les sauces 
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

exports.getUniqueSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

//modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
                }`,
        }
        : { ...req.body };
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauceObject.userId !== req.auth.userId) {
                return res.status(401).send('Requête non autorisée')
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                if (req.file) {
                    fs.unlink(`images/${filename}`, () => { console.log('Image ' + filename + ' supprimée') })
                }
                Sauce.updateOne(
                    { _id: req.params.id },
                    { ...sauceObject, _id: req.params.id }
                )
                    .then(() => res.status(200).json({ message: "Objet modifié !" }))
                    .catch((error) => res.status(400).json({ error }));
            };
        });
}

//suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                return res.status(404).json({ error: new Error('Objet non trouvé!') })
            }
            if (sauce.userId !== req.auth.userId) {
                return res.status(401).json({ error: new Error('Requête non autorisée') })
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: "Objet supprimé !" }))
                        .catch((error) => res.status(400).json({ error }));
                });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        //Ajout Like
        if (req.body.like == 1) {
            let likeArray = sauce.usersLiked;
            let likeIndex = likeArray.indexOf(req.body.userId);
            if (likeIndex == -1) {
                Sauce.updateOne(
                    { _id: req.params.id },
                    { $push: { usersLiked: req.body.userId } }
                ).then(() => {
                    if (sauce.likes != null) {
                        let likedSauce = sauce.likes;
                        likedSauce++;
                        Sauce.updateOne({ _id: req.params.id }, { likes: likedSauce })
                            .then(() => res.status(200).json({ message: "Like Ajouté !" }))
                            .catch((error) => res.status(400).json({ error }));
                    } else {
                        Sauce.updateOne({ _id: req.params.id }, { $set: { likes: 1 } })
                            .then(() => res.status(200).json({ message: "Like Créé !" }))
                            .catch((error) => res.status(400).json({ error }));
                    }
                });
            }
        }
        //Ajout Dislike
        if (req.body.like == -1) {
            let dislikeArray = sauce.usersDisliked;
            let dislikeIndex = dislikeArray.indexOf(req.body.userId);
            if (dislikeIndex == -1) {
                Sauce.updateOne(
                    { _id: req.params.id },
                    { $push: { usersDisliked: req.body.userId } })
                    .then(() => {
                        if (sauce.dislikes != null) {
                            let dislikedSauce = sauce.dislikes;
                            dislikedSauce++;
                            Sauce.updateOne({ _id: req.params.id }, { dislikes: dislikedSauce })
                                .then(() => res.status(200).json({ message: "Dislike Ajouté !" }))
                                .catch((error) => res.status(400).json({ error }));
                        } else {
                            Sauce.updateOne({ _id: req.params.id }, { $set: { dislikes: 1 } })
                                .then(() => res.status(200).json({ message: "Dislike Créé !" }))
                                .catch((error) => res.status(400).json({ error }));
                        }
                    })
            }
        }
        //Retrait Like ou Dislike
        if (req.body.like == 0) {
            let sauceLike = sauce.likes;
            let sauceDislike = sauce.dislikes;

            let dislikeArray = sauce.usersDisliked;
            let dislikeIndex = dislikeArray.indexOf(req.body.userId);
            if (dislikeIndex !== -1) {
                dislikeArray.splice(dislikeIndex, 1);
                sauceDislike--;
            }

            let likeArray = sauce.usersLiked;
            let likeIndex = likeArray.indexOf(req.body.userId);
            if (likeIndex !== -1) {
                likeArray.splice(likeIndex, 1);
                sauceLike--;
            }
            Sauce.updateOne(
                { _id: req.params.id },
                { usersDisliked: dislikeArray, usersLiked: likeArray, likes: sauceLike, dislikes: sauceDislike }
            )
                .then(() => res.status(200).json({ message: "Like/Dislike retiré" }))
                .catch((error) => res.status(400).json({ error }));
        }
    })
        .catch((error) => res.status(400).json({ error }));;
};

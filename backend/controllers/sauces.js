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


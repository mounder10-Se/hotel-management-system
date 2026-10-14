const express = require("express");
const router = express.Router();
router.use(express.json());
const mysql = require("mysql2");
const cors = require("cors");
// pour uplade images =>
const path = require("path");
const Fs = require("fs");
const multer = require("multer");
const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "articles/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage: Storage });
//
const PMS = mysql.createConnection({
    host: "localhost",

    password: "",
    user: "root",
    port: "3306",
    database: "pms",
});

// Ajouter une Chambre :
router.post("/ajouterChambre", upload.single("image"), (req, res) => {
    const status = req.body.status;
    console.log(status);
    const nom_chambre = req.body.nomCh;
    const type = req.body.type;
    const image = req.file.filename;
    const capacite = req.body.capacite;
    const prix = req.body.prix;
    const description = req.body.desc;

    const numchambre = req.body.id_chambre;
    const requet =
        "insert into chambre (id_ch,status,nom_chambre,image,type,capacité,prix,description) values (?,?,?,?,?,?,?,?)";
    PMS.query(
        requet, [numchambre, status, nom_chambre, image, type, capacite, prix, description],
        (err, reslt) => {
            try {
                if (!err) {
                    res.status(200).json({ Etat: "Success" });
                } else {
                    res.status(200).json({ Etat: err.message });
                }
            } catch (error) {
                res.status(500).json({ Etat: error });
            }
        }
    );
});
//
// aficher tout les chambre :

router.get("/Chambres", (req, res) => {
    const requet = "SELECT * FROM chambre";
    try {
        PMS.query(requet, (err, reslt) => {
            if (!err) {
                console.log(reslt[0]);
                res.status(200).json({ Etat: "Success", Data: reslt });
            } else {
                res.status(200).json({ Etat: err.message });
            }
        });
    } catch (error) {
        res.status(501).json({ Etat: error });
    }
});
//
// supprimer un chambre :
router.delete("/dletechamre/:id_ch", (req, res) => {
    PMS.query(
        "SELECT *  FROM chambre WHERE id_ch = ?", [req.params.id_ch],
        (err, reslt) => {
            const image = reslt[0].image;
            const filename = `articles/${image}`;
            if (!err) {
                Fs.unlink(filename, (err) => {
                    if (!err) {
                        const requet = "DELETE FROM chambre WHERE id_ch = ?";
                        PMS.query(requet, [req.params.id_ch], (err, reslt) => {
                            if (!err) {
                                res.status(200).json({ Etat: "Success" });
                            } else {
                                res.status(200).json({ Etat: err.message });
                            }
                        });
                    } else {
                        res.status(501).json({ Etat: err.message });
                    }
                });
            } else {
                res.status(200).json({ Etat: err.message });
            }
        }
    );
});
//
// aficher les informations dun chambre
router.get("/infoChambre/:id_ch", (req, res) => {
    const Id = req.params.id_ch;
    const requet = "SELECT * FROM chambre WHERE id_ch = ?";
    try {
        PMS.query(requet, [Id], (err, reslt) => {
            if (!err) {
                res.status(200).json({ Etat: "Success", Data: reslt[0] });
            } else {
                res.status(200).json({ Etat: err.message });
            }
        });
    } catch (error) {
        res.status(501).json({ Etat: error });
    }
});
//
// metter a joure une chambre :

router.put("/modifierChambre/:id_ch", upload.single("image"), (req, res) => {
    const Id = req.params.id_ch;
    const nom_chambre = req.body.nomCh;
    const type = req.body.type;
    const capacite = req.body.capacite;
    const prix = req.body.prix;
    const description = req.body.desc;
    const numchambre = req.body.id_chambre;
    const status = req.body.status;
    const requetDelete = "DELETE FROM chambre WHERE id_ch = ? ";
    const requeteEncien = "SELECT * FROM chambre WHERE id_ch = ?";

    console.log(req.file);
    if (req.file != undefined) {
        PMS.query(requeteEncien, [Id], (err, reslt) => {
            if (!err) {
                //  console.log(reslt[0].id_ch);
                const encienId = reslt[0].id_ch;
                const encienImage = `articles/${reslt[0].image}`;
                image = reslt[0].image;
                //  console.log(encienImage);

                if (Id == encienId) {
                    Fs.unlink(encienImage, (err) => {
                        if (!err) {
                            PMS.query(requetDelete, [Id], (err, reslt) => {
                                if (!err) {
                                    PMS.query(
                                        "insert into chambre (id_ch,status,nom_chambre,type,image,capacité,prix,description) values (?,?,?,?,?,?,?,?)", [
                                            numchambre,
                                            status,
                                            nom_chambre,
                                            type,
                                            req.file.filename,
                                            capacite,
                                            prix,
                                            description,
                                        ],
                                        (err, reslt) => {
                                            if (!err) {
                                                res.status(200).json({ Etat: "Success" });
                                            } else {
                                                res.status(200).json({ Etat: err.message });
                                            }
                                        }
                                    );
                                } else {
                                    res.status(200).json({ Etat: err.message });
                                }
                            });
                        } else {
                            res.status(501).json({ Etat: err });
                        }
                    });
                } else {
                    Fs.unlink(encienImage, (err) => {
                        if (!err) {
                            PMS.query(
                                " UPDATE chambre set status = ? , nom_chambre = ? , type = ? , image = ? , capacité = ? , prix = ? , description = ? where id_ch ? ", [
                                    status,
                                    nom_chambre,
                                    type,
                                    req.file.filename,
                                    capacite,
                                    prix,
                                    description,
                                    numchambre,
                                ],
                                (err, reslt) => {
                                    if (!err) {
                                        res.status(200).json({ Etat: "Success" });
                                    } else {
                                        res.status(200).json({ Etat: err.message });
                                    }
                                }
                            );
                        } else {
                            res.status(501).json({ Etat: err });
                        }
                    });
                }
            } else {
                res.status(501).json({ Etat: err.message });
            }
        });
    } else {
        //

        PMS.query(requeteEncien, [Id], (err, reslt) => {
            if (!err) {
                //  console.log(reslt[0].id_ch);
                const encienId = reslt[0].id_ch;
                const encienImage = reslt[0].image;
                //  console.log(encienImage);

                if (Id == encienId) {
                    if (!err) {
                        PMS.query(requetDelete, [Id], (err, reslt) => {
                            if (!err) {
                                PMS.query(
                                    "insert into chambre (id_ch,status,nom_chambre,type,image,capacité,prix,description) values (?,?,?,?,?,?,?,?)", [
                                        numchambre,
                                        status,
                                        nom_chambre,
                                        type,
                                        encienImage,
                                        capacite,
                                        prix,
                                        description,
                                    ],
                                    (err, reslt) => {
                                        if (!err) {
                                            res.status(200).json({ Etat: "Success" });
                                        } else {
                                            res.status(200).json({ Etat: err.message });
                                        }
                                    }
                                );
                            } else {
                                res.status(200).json({ Etat: err.message });
                            }
                        });
                    } else {
                        res.status(501).json({ Etat: err });
                    }
                } else {
                    PMS.query(
                        " UPDATE chambre set status = ? , nom_chambre = ? , type = ?  , capacité = ? , prix = ? , description = ? where id_ch ? ", [
                            status,
                            nom_chambre,
                            type,

                            capacite,
                            prix,
                            description,
                            numchambre,
                        ],
                        (err, reslt) => {
                            if (!err) {
                                res.status(200).json({ Etat: "Success" });
                            } else {
                                res.status(200).json({ Etat: err.message });
                            }
                        }
                    );
                }
            } else {
                res.status(501).json({ Etat: err.message });
            }
        });

        //
    }
});

router.put("/updateChambre/:id_ch", upload.single("image"), (req, res) => {
    const Id = req.params.id_ch;
    const nom_chambre = req.body.nomCh;
    const type = req.body.type;
    const capacite = req.body.capacite;
    const prix = req.body.prix;
    const description = req.body.desc;
    const numchambre = req.body.id_chambre;
    const status = req.body.status;
    const OldImage = "SELECT *  FROM chambre WHERE id_ch = ? "; //pour get encient image
    const testNumerochambre = "SELECT * FROM chambre where id_ch = ?";
    console.log(req);
    PMS.query(testNumerochambre, [numchambre], (err, reslt) => {
        if (!err) {
            if (reslt.length > 0) {
                res.status(200).json({
                    Etat: "impossible d'utiliser cette numero de chambre car elle est reserver",
                });
            } else {
                if (req.file == undefined) {
                    const insert =
                        "insert into chambre (id_ch,status,nom_chambre,type,image,capacité,prix,description) values (?,?,?,?,?,?,?,?)";

                    PMS.query(OldImage, [Id], (err, reslt) => {
                        if (!err) {
                            const image = reslt[0].image;

                            const filename = `articles/${image}`;
                            PMS.query(
                                "DELETE from chambre where id_ch = ? ", [Id],
                                (err, reslt) => {
                                    if (!err) {
                                        PMS.query(
                                            insert, [
                                                numchambre,
                                                status,
                                                nom_chambre,
                                                type,
                                                image,
                                                capacite,
                                                prix,
                                                description,
                                            ],
                                            (err, reslt) => {
                                                if (!err) {
                                                    res.status(200).json({ Etat: "Success" });
                                                } else {
                                                    res.status(200).json({ Etat: err.message });
                                                }
                                            }
                                        );
                                    } else {
                                        res.status(200).json({ Etat: err.message });
                                    }
                                }
                            );
                        } else {
                            res.status(200).json({ Etat: err.message });
                        }
                    });
                } else {
                    const imageUpload = req.file.filename;
                    PMS.query(
                        "SELECT *  FROM chambre WHERE id_ch = ?", [Id],
                        (err, reslt) => {
                            const image = reslt[0].image;
                            const filename = `articles/${image}`;
                            if (!err) {
                                Fs.unlink(filename, (err) => {
                                    if (!err) {
                                        console.log("image encient est supprimer");
                                        const requet = "DELETE FROM chambre WHERE id_ch = ?";
                                        PMS.query(requet, [req.params.id_ch], (err, reslt) => {
                                            if (!err) {
                                                // res.status(200).json({ Etat: "Success" });
                                                const insert =
                                                    "insert into chambre (id_ch,status,nom_chambre,type,image,capacité,prix,description) values (?,?,?,?,?,?,?,?)";

                                                PMS.query(
                                                    insert, [
                                                        numchambre,
                                                        status,
                                                        nom_chambre,
                                                        type,
                                                        imageUpload,
                                                        capacite,
                                                        prix,
                                                        description,
                                                        Id,
                                                    ],
                                                    (err, reslt) => {
                                                        if (!err) {
                                                            res.status(200).json({ Etat: "Success" });
                                                        } else {
                                                            res.status(200).json({ Etat: err.message });
                                                        }
                                                    }
                                                );
                                            } else {
                                                res.status(200).json({ Etat: err.message });
                                            }
                                        });
                                    } else {
                                        console.log("image encient est supprimer");
                                        const requet = "DELETE FROM chambre WHERE id_ch = ?";
                                        PMS.query(requet, [req.params.id_ch], (err, reslt) => {
                                            if (!err) {
                                                // res.status(200).json({ Etat: "Success" });
                                                const insert =
                                                    "insert into chambre (id_ch,status,nom_chambre,type,image,capacité,prix,description) values (?,?,?,?,?,?,?,?)";

                                                PMS.query(
                                                    insert, [
                                                        numchambre,
                                                        status,
                                                        nom_chambre,
                                                        type,
                                                        imageUpload,
                                                        capacite,
                                                        prix,
                                                        description,
                                                        Id,
                                                    ],
                                                    (err, reslt) => {
                                                        if (!err) {
                                                            res.status(200).json({ Etat: "Success" });
                                                        } else {
                                                            res.status(200).json({ Etat: err.message });
                                                        }
                                                    }
                                                );
                                            } else {
                                                res.status(200).json({ Etat: err.message });
                                            }
                                        });
                                    }
                                });
                            } else {
                                res.status(200).json({ Etat: err.message });
                            }
                        }
                    );
                }
            }
        } else {
            res.status(200).json({ Etat: err.message });
        }
    });
});
//
exports.gestionChambre = router;
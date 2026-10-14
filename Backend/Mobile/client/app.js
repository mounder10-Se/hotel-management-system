const express = require("express");
const router = express.Router();
router.use(express.json());
const multer = require("multer");
const path = require("path");
const Fs = require("fs");
const cors = require("cors");
const bcrypt = require("bcrypt");
router.use(cors({}));
const mysql = require("mysql2");
const PMS = mysql.createConnection({
    host: "localhost",
    password: "",
    user: "root",
    port: "3306",
    database: "pms",
});

//
router.get("/users/:id", (req, res) => {
    const requet = `SELECT * FROM persson where id_user = ?`;
    const user = req.params.id;
    PMS.query(requet, [user], (err, reslt) => {
        const fetch = reslt[0];
        console.log(fetch);

        if (!err) {
            if (fetch != undefined) {
                res.status(200).json([{ Data: fetch }]);
            } else {
                res.send("Aucunne result");
            }
        } else {
            res.status(500).json([{
                Etat: err.message,
            }, ]);
        }
    });
});
// information client :
router.get("/user/:id", (req, res) => {
    const user_id = req.params.id;
    const requet = "SELECT * FROM presson WHERE id_p =?";

    PMS.query(requet, [user_id], (err, reslt) => {
        if (!err) {
            res.status(200).json([{
                Etat: "Success",
                Data: reslt[0],
            }, ]);
        } else {
            res.status(200).json([{ Etat: "Faild" }]);
        }
    });
});

//
// Modifier Profile :
// router.post("/update", (req, res) => {
//     const id_user = req.body.user_id;
//     const nom = req.body.nom;
//     const prenom = req.body.prenom;
//     const email = req.body.email;
//     const requet =
//       "UPDATE persson SET nom_persson = ? , prenom = ? , email = ? WHERE id_p = ? ";
//     PMS.query(requet, [nom, prenom, email, id_user], (err, reslt) => {
//       if (!err) {
//         console.log("Update avec success");
//         res.status(200).json({ Etat: "Success" });
//       } else {
//         console.log("Update Faild");
//         res.status(200).json({ Etat: "Faild" });
//       }
//     });
//   });
//
//mise a joure image
const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const Upload = multer({ storage: Storage });
router.use("/images", express.static(path.join(__dirname, "images")));

router.post("/uploadImage", Upload.single("image"), (req, res) => {
    const user_id = req.body.user_id;
    const fileName = req.file.filename;
    console.log(fileName);
    const pathimage = path.join(__dirname, "images", "1741092647749-6.jpg");

    Fs.access(pathimage, Fs.constants.F_OK, (err) => {
        if (err) {
            console.log("File not found");
            const requet = "UPDATE persson SET 	image_profile =  ? WHERE id_p = ?";
            PMS.query(requet, [fileName, user_id], (err, reslt) => {
                if (!err) {
                    res.status(200).json({ Etat: "Success" });
                } else {
                    res.status(200).json({ Etat: "Faild", Err: err.sqlMessage });
                }
            });
            return;
        } else {
            console.log("File existe");
            Fs.unlink(pathimage, (err) => {
                if (!err) {
                    const requet = "UPDATE persson SET 	image_profile =  ? WHERE id_p = ?";
                    PMS.query(requet, [fileName, user_id], (err, reslt) => {
                        if (!err) {
                            res.status(200).json({ Etat: "Success" });
                        } else {
                            res.status(200).json({ Etat: "Faild", Err: err.sqlMessage });
                        }
                    });
                }
            });
        }
        return;
    });
});

//

router.post("/update", Upload.single("image"), (req, res) => {
    const id_user = req.body.user_id;
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const numero = req.body.numero;
    console.log(id_user);
    if (req.file == undefined || req.file == null) {
        const requet =
            "UPDATE persson SET name = ? , prenom = ? , email = ? , numero = ? WHERE id_user = ? ";
        PMS.query(requet, [nom, prenom, email, numero, id_user], (err, reslt) => {
            if (!err) {
                console.log("Update avec success");
                res.status(200).json({ Etat: "Success" });
            } else {
                console.log("Update Faild");
                res.status(200).json({ Etat: err.message });
            }
        });
    } else {
        const requet2 =
            "UPDATE persson SET name = ? , prenom = ? , email = ? , numero = ? , image = ? WHERE id_user = ? ";
        const select = "SELECT * FROM persson WHERE id_user = ?";
        PMS.query(select, [id_user], (err, reslt) => {
            const Pathimage = reslt[0].image;

            if (Pathimage == null) {
                PMS.query(
                    requet2, [nom, prenom, email, numero, req.file.filename, id_user],
                    (err, data) => {
                        if (!err) {
                            res.status(200).json({ Etat: "Success" });
                        } else {
                            res.status(200).json({ Etat: "Faild" });
                        }
                    }
                );
            } else {
                Fs.unlink(`/images/${Pathimage}`, (eror) => {
                    if (!err) {
                        PMS.query(
                            requet2, [nom, prenom, email, numero, req.file.filename, id_user],
                            (err, data) => {
                                if (!err) {
                                    res.status(200).json({ Etat: "Success" });
                                } else {
                                    res.status(200).json({ Etat: "Faild" });
                                }
                            }
                        );
                        // res.status(200).json({ Etat: "Success" });
                    } else {
                        console.log(eror.message);
                    }
                });
            }
        });
    }
});
//

// les methode des chambre :
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

// nombre jadore sur une chambre :

router.get("/nbrJadore/:idch", (req, res) => {
    const id_chambre = req.params.idch;
    const sqlRequet =
        "SELECT COUNT(id_chambre) as total FROM `like` WHERE id_chambre = ? ";
    PMS.query(sqlRequet, [id_chambre], (err, reslt) => {
        if (!err) {
            console.log(reslt);
            res.status(200).json({ reslt });
        } else {
            console.log(err.message);
            res.status(501).json({ Etat: err.message });
        }
    });
});

//

// ajouter :
router.post("/ajouterJador", (req, res) => {
    const id_user = req.body.user_id;
    const id_ch = req.body.id_chambre;
    PMS.query(
        "INSERT INTO `like` (id_persson , id_chambre) values (?,?) ", [id_user, id_ch],
        (err, reslt) => {
            if (!err) {
                res.status(200).json({ Etat: "Success" });
            } else {
                res.status(200).json({ Etat: err.message });
            }
        }
    );
});
//

// suprimer jador :

router.post("/deleteLike", (req, res) => {
    const id_user = req.body.user_id;
    const id_ch = req.body.id_chambre;
    PMS.query(
        "DELETE FROM `like` WHERE id_chambre = ?  AND id_persson = ?", [id_ch, id_user],
        (err, reslt) => {
            if (!err) {
                res.status(200).json({ Etat: "Success" });
            } else {
                res.status(200).json({ Etat: err.message });
            }
        }
    );
});
//

// verfier like
router.get("/vrflike/:id_user/:id_chambre", (req, res) => {
    const id_user = req.params.id_user;
    const id_ch = req.params.id_chambre;
    PMS.query(
        "SELECT * FROM `like` WHERE id_chambre = ? AND id_persson = ?", [id_ch, id_user],
        (err, reslt) => {
            if (!err) {
                console.log(reslt);

                if (reslt.length != 0) {
                    res.status(200).json({ Etat: "Success" });
                } else {
                    res.status(200).json({ Etat: "Faild" });
                }
            } else {
                res.status(200).json({ Etat: err.message });
            }
        }
    );
});
//

// Etoile :

// getNombre-Etoile
router.get("/nbrEtoile/:id_user/:id_chambre", (req, res) => {
    console.log("moundzajdgzayd");
    PMS.query(
        "SELECT nbrEtoile  total FROM `etoile` WHERE id_chambre = ? AND id_persson = ?", [req.params.id_chambre, req.params.id_user],
        (err, reslt) => {
            if (!err) {
                if (reslt.length != 0) {
                    console.log(reslt);
                    res.status(200).json({ Data: reslt[0].total });
                } else {
                    res.status(200).json({ Data: 0 });
                }
            } else {
                res.status(501).json({ Etat: err.message });
            }
        }
    );
});
//

// ajouterRating
router.get("/ajouterEtoiale/:id_user/:id_chambre/:nbr", (req, res) => {
    PMS.query(
        "INSERT INTO `etoile` (id_chambre , id_persson , nbrEtoile ) values (?,?,?)", [req.params.id_chambre, req.params.id_user, req.params.nbr],
        (err, reslt) => {
            if (!err) {
                res.status(501).json({ Etat: "Success" });
            } else {
                res.status(501).json({ Etat: err.message });
            }
        }
    );
});
//

// UpdateEtoile
router.get("/UpdateEtoiale/:id_user/:id_chambre/:nbr", (req, res) => {
    PMS.query(
        "UPDATE `etoile` SET  nbrEtoile = ? WHERE id_chambre = ? AND id_persson = ?  ", [req.params.nbr, req.params.id_chambre, req.params.id_user, req.params.nbr],
        (err, reslt) => {
            if (!err) {
                res.status(501).json({ Etat: "Success" });
            } else {
                res.status(501).json({ Etat: err.message });
            }
        }
    );
});
//
// Moyenne Etoile :
router.get("/vrrAvg/:id_ch", (req, res) => {
    const id_ch = req.params.id_ch;
    PMS.query(
        "SELECT AVG(nbrEtoile) as total FROM `etoile` WHERE id_chambre = ? ", [id_ch],
        (err, reslt) => {
            if (!err) {
                console.log(reslt);
                let number = Number(reslt[0].total);

                if (reslt.length != 0) {
                    res.status(200).json({ Etat: number.toFixed(1) });
                } else {
                    res.status(200).json({ Etat: 0 });
                }
            } else {
                res.status(200).json({ Etat: err.message });
            }
        }
    );
});
//

// get les meillieur noté

router.get("/best", (req, res) => {
    const sqlRequet =
        "SELECT DISTINCT `chambre`.`id_ch`,`chambre`.`image`,`chambre`.`status`, `chambre`.`type`, `chambre`.`prix`,`chambre`.`capacité`,`chambre`.`nom_chambre`,`chambre`.`description`FROM `chambre`  JOIN `etoile` ON `chambre`.`id_ch` = `etoile`.`id_chambre`WHERE`etoile`.`nbrEtoile` BETWEEN 3.5 AND 5";
    PMS.query(sqlRequet, (err, reslt) => {
        if (!err) {
            res.status(200).json({ Etat: reslt });
        } else {
            res.status(501).json({ Etat: err.message });
        }
    });
});
//

// returne une chmabre [Categorie]:
router.post("/categorie", (req, res) => {
    const type = req.body.type;
    const sqlRequet = "SELECT *  FROM `chambre` WHERE `type` = ?";
    try {
        PMS.query(sqlRequet, [type], (err, reslt) => {
            if (!err) {
                console.log(reslt);

                res
                    .status(200)
                    .json({ Etat: "Success", Data: reslt, Nombre: reslt.length });
            } else {
                res.status(200).json({ Etat: "Faild" });
            }
        });
    } catch (error) {
        res.status(501).json({ Etat: error });
    }
});

// payment :
const paypal = require("paypal-rest-sdk");
const { error } = require("console");

paypal.configure({
    mode: "sandbox",
    client_id: "ASBPxELWZIFtTGCzGA8mGsfCBknb2yHzMTs1_Rv2bWglE-sPY2DC2hU7zbBt-raKIWf7-FXbn6nra1I_",
    client_secret: "ECJRYt20E-Hzky1xWuGcxM3PX77uWu_r50TNJhPl1NbHT-FwLsNdMp6hmBNR9I37daRQQeW-Rush9kIn",
});

router.get(
    "/createpaypalpayment/:amount/:currency/:id_user/:id_ch/:debut/:fin",
    async(req, res) => {
        console.log("messi");
        const amount = req.params.amount;
        const currency = "USD";
        const user = req.params.id_user;
        const chambre = req.params.id_ch;
        const debut = req.params.debut;
        console.log("date Debut  : " + debut);
        const fin = req.params.fin;
        var payment_json = {
            intent: "sale",
            payer: { payment_method: "paypal" },
            redirect_urls: {
                return_url: `http://192.168.70.25:3000/Mobile/execute/${amount}/${chambre}/${user}/${debut}/${fin}`,
                cancel_url: "http://cancel.url",
            },
            transactions: [{
                item_list: {
                    items: [{
                        name: "item",

                        sku: "item",
                        price: `${amount}`,
                        currency: "USD",
                        quantity: 1,
                    }, ],
                },
                amount: {
                    currency: "USD",
                    total: `${amount}`,
                },
                description: `Purchase of ${"mounder"}`,
            }, ],
        };

        paypal.payment.create(payment_json, (err, payment) => {
            if (err) {
                console.log(err.message);
                throw err;
            } else {
                // console.log(JSON.stringify(payment));
                console.log(payment);

                for (let index = 0; index < payment.links.length; index++) {
                    if (payment.links[index].rel == "approval_url") {
                        res.redirect(payment.links[index].href);
                    }
                }
            }
        });
    }
);

router.get("/execute/:amount/:idch/:id_user/:debut/:fin", async(req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    console.log("PayerID:", payerId);
    console.log("paymentId:", paymentId);

    const execute_payment_json = {
        payer_id: payerId,
        transactions: [{
            amount: {
                currency: "USD",
                total: `${req.params.amount}`,
            },
        }, ],
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
        if (error) {
            console.log("Execution Error:", error.response, error.message);
            return res.status(400).send("Erreur d'exécution du paiement");
        } else {
            console.log("Payment success:", JSON.stringify(payment));
            // il faut D'aboard changer sattus du chambre :
            PMS.query(
                "Update chambre set status = ?  WHERE id_ch = ?", ["réservée", req.params.idch],
                (err, reslt) => {
                    if (!err) {
                        console.log("Etat changer");
                        //ajouter votre paiment dans la base donnes :
                        const datepaiment = new Date(Date.now());
                        PMS.query(
                            "insert into paiment (montant,id_user,id_ch,methodPaiment,datePaiment) values (?,?,?,?,?)", [
                                req.params.amount,
                                req.params.id_user,
                                req.params.idch,
                                'Pypale',
                                datepaiment
                            ], (err, reslt) => {
                                if (!err) {
                                    console.log("le paiment est inserer avec success");
                                } else {
                                    console.log(err.message);
                                }
                            }
                        );
                        //
                    } else {
                        console.log("problem de changement");
                    }
                }
            );
            //
            //Ajouter Votre reservations dans la base de donne :
            PMS.query(
                "INSERT INTO reservation (id_persson , id_chambre,date_debut,date_fin) values (?,?,?,?)", [req.params.id_user, req.params.idch, req.params.debut, req.params.fin],
                (err, reslt) => {
                    try {
                        if (!err) {
                            console.log("La reservation est fait avec success");
                        } else {
                            console.log("la reservations est faild");
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            );
            //
            return res.redirect(
                "http://return_url/?status=success&id=" +
                payment.id +
                "&state=" +
                payment.state
            );
        }
    });
});

router.get("/reservation/:id_user", (req, res) => {
    PMS.query(
        "select * from reservation where id_persson = ?", [req.params.id_user],
        (err, reslt) => {
            if (!err) {
                console.log(reslt);
                res.status(200).json({ Data: reslt });
            } else {
                res.status(501).json({ Etat: err.message });
            }
        }
    );
});
//

//singaler problem  :
router.post("/problem/:id_user", (req, res) => {
    console.log("essi");
    try {
        const message = req.body.message;
        const obj = req.body.obj;
        const type = req.body.type;
        const date = new Date(Date.now());
        PMS.query(
            "INSERT INTO problem (	type_problem , id_user , message , obj , date ) values (?,?,?,?,?) ", [type, req.params.id_user, message, obj, date],
            (err, reslt) => {
                if (!err) {


                    const date = new Date(Date.now());
                    PMS.query(
                        "insert into notification (contenu ,date_c) values (?,?)", [`il ya un nouveau problem signaler par le client ${req.params.id_user}`, date],
                        (err2, rsltt) => {
                            if (!err2) {
                                res
                                    .status(200)
                                    .json({ Etat: "Success", id_user: reslt.insertId });
                            } else {
                                res.status(200).json({ Etat: err2.message });
                            }
                        }
                    );

                } else {
                    res.status(200).json({ Etat: err });
                }
            }
        );
    } catch (error) {
        res.status(200).json({ Etat: error });
    }
});
//
exports.App = router;
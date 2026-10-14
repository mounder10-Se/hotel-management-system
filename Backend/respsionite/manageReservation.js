const express = require("express");
const router = express.Router();
router.use(express.json());
const mysql = require("mysql2");
const cors = require("cors");
router.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

const PMS = mysql.createConnection({
    //Mysql
    host: "localhost",
    password: "",
    user: "root",
    port: "3306",
    database: "pms",
});

router.get("/clients", (req, res) => {
    try {
        PMS.query(
            "SELECT * FROM persson WHERE Role = ? ", ["client"],
            (err, reslt) => {
                if (!err) {
                    res.status(200).json({ Etat: "Success", data: reslt });
                } else {
                    res.status(500).json({ Etat: "Error", message: err.message });
                }
            }
        );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get("/chambresL", (req, res) => {
    try {
        PMS.query(
            "SELECT * FROM chambre WHERE status = 'disponible' ",
            (err, reslt) => {
                if (!err) {
                    res.status(200).json({ Etat: "Success", data: reslt });
                } else {
                    res.status(500).json({ Etat: "Error", message: err.message });
                }
            }
        );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/ajouterRservation", (req, res) => {
    const { id_persson, id_chambre, date_debut, date_fin, prix_total } = req.body;
    PMS.query(
        "INSERT INTO reservation (id_persson, id_chambre, date_debut, date_fin, Etat) VALUES (?, ?, ?, ?, ?)", [id_persson, id_chambre, date_debut, date_fin, "EN_COURS"],
        (err, reslt) => {
            if (!err) {
                PMS.query(
                    "UPDATE chambre set status = 'réservée' WHERE id_ch = ? ", [id_chambre],
                    (errChambre, resltChambre) => {
                        if (!errChambre) {
                            PMS.query(
                                "INSERT INTO paiment (montant,id_user,id_ch,	methodPaiment,datePaiment) VALUES (?,?,?,?,?) ", [prix_total, id_persson, id_chambre, "manuel", new Date()],
                                (errPaiment, resltPaiment) => {
                                    if (!errPaiment) {
                                        res.status(200).json({
                                            Etat: "Success",
                                            message: "Réservation ajoutée avec succès",
                                        });
                                    } else {
                                        res
                                            .status(500)
                                            .json({ Etat: "Error", message: errPaiment.message });
                                    }
                                }
                            );
                        } else {
                            console.log(errChambre);
                        }
                    }
                );
            } else {
                res.status(500).json({ Etat: "Error", message: err.message });
            }
        }
    );
});

router.get("/allReservation", (req, res) => {
    PMS.query("SELECT * FROM reservation", (err, reslt) => {
        if (!err) {
            res.status(200).json({ Etat: "Success", data: reslt });
        } else {
            res.status(500).json({ Etat: "Error", message: err.message });
        }
    });
});
router.post("/supprimerReservation/:id", (req, res) => {
    console.log("mounder");
    const { id } = req.params;
    PMS.query("DELETE FROM reservation WHERE id_reservation = ?", [id], (err, reslt) => {
        if (!err) {
            res.status(200).json({ Etat: "Success", message: "Réservation supprimée avec succès" });
        } else {
            res.status(500).json({ Etat: "Error", message: err.message });
        }
    });
});
router.get("/programes", (req, res) => {
    PMS.query("SELECT * FROM schedule", (err, reslt) => {
        if (!err) {
            res.status(200).json({ Etat: "Success", data: reslt });
        } else {
            res.status(500).json({ Etat: "Error", message: err.message });
        }
    });
});


exports.manageReservation = router;
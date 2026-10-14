const express = require("express");
const router = express.Router();
router.use(express.json());
const cors = require("cors");
const session = require("express-session");
router.use(
    session({
        secret: "3306",
        name: "Session",
        resave: false,
        saveUninitialized: true,
        cookie: {},
    })
);
router.use(
    cors({
        origin: "*",
        credentials: true,
    })
);
// cookies :
const cookies = require("cookie-parser");
router.use(cookies());
//
// pour uplade images =>
const path = require("path");
const Fs = require("fs");
const multer = require("multer");
//
// Hash les mot de pass
const bcrytp = require("bcrypt");
//
// mysql2
const mysql = require("mysql2");
const PMS = mysql.createConnection({
    host: "localhost",
    password: "",
    user: "root",
    port: "3306",
    database: "pms",
});
PMS.connect((err) => {
    if (!err) {
        console.log("connection success avec la base");
    } else {
        console.log("connection impossible avec base");
    }
});
//
const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage: Storage });
//creation d'une compte :
const nodemailer = require("nodemailer");
const transports = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "msemroun@gmail.com",
        pass: "hccx kizg vjgs sesx",
    },
});

const send = async(transporter, mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
};

function generateSixDigitNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}

let codeConfirmation = 0;
const lsitRecuperation = new Map();
router.post("/creation", (req, res) => {
    const email = req.body.email;
    console.log("email est  : " + email);
    PMS.query("SELECT * FROM persson WHERE email = ?", [email], (err, reslt) => {
        if (!err) {
            if (reslt.length == 0) {
                codeConfirmation = generateSixDigitNumber();
                const mailOptions = {
                    from: {
                        name: "mounder",
                        adress: "msemroun@gmail.com",
                    },
                    to: [`${email}`],
                    subject: "Code de vérification pour la récupération de votre compte",
                    text: `Bonjour,
            
            Vous avez demandé à récupérer l'accès à votre compte.
            
            Voici votre code de vérification à 6 chiffres : ${codeConfirmation}
            
            Veuillez saisir ce code dans l'application pour confirmer votre identité.
            
            Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce message.
            
            Cordialement,
            L’équipe de support`,
                };
                console.log("le code de onfirmation est : " + codeConfirmation);
                send(transports, mailOptions);
                res.status(200).json({ Etat: "Success" });
            } else {
                res.status(200).json({ Etat: "email invalide" });
            }
        } else {
            res.status(200).json({ Etat: err.message });
        }
    });
});
router.post("/verifier/:code", (req, res) => {
    const code = req.params.code;
    console.log(code);
    console.log(codeConfirmation.toString() == code);
    const email = req.body.email;
    const password = bcrytp.hashSync(req.body.password, 10);
    console.log(password);
    console.log(req.body.nom);
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const telephone = req.body.telephone;
    const requet =
        "insert into persson ( `name`, `prenom`, `email`,`numero` ,`password`, `Role`) values (?,?,?,?,?,?)";

    if (codeConfirmation.toString() == code) {
        PMS.query(
            requet, [nom, prenom, email, telephone, password, "client"],
            (err, reslt) => {
                if (!err) {
                    const date = new Date(Date.now());
                    PMS.query(
                        "insert into notification (contenu ,date_c) values (?,?)", [`il  une  nouvelle inscriptio avec email(${email})`, date],
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
                    res.status(200).json({ Etat: err.message });
                }
            }
        );
    } else {
        res.status(200).json({ Etat: "code invalide " });
    }
});

//le cas de utilisateur doiit choisir une image de profile dasn la creation du compte ;
router.post("/ajouterPicture", upload.single("image"), (req, res) => {
    const file = req.file.filename;
    const id_user = req.body.id_user;
    console.log("le nom du image : ", file);
    console.log("id_user est  : ", id_user);
    try {
        PMS.query(
            "UPDATE persson set image = ? WHERE id_user = ? ", [file, id_user],
            (err, reslt) => {
                if (!err) {
                    res.status(200).json({ Etat: "Success", id_user: id_user });
                } else {
                    res.status(200).json({ Etat: err.message });
                }
            }
        );
    } catch (error) {
        res.status(500).json({ Etat: error });
    }
});
exports.creation = router;
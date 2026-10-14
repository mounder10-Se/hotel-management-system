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
// creation d'une compte :

router.post("/SingIn", upload.single("image"), (req, res) => {
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const password = bcrytp.hashSync(req.body.password, 10);
    const image = req.file.filename;
    const Role = req.body.Role;
    const requet =
        "insert into persson ( `name`, `prenom`, `email`, `password`, `Role`, `image`) values (?,?,?,?,?,?)";
    PMS.query(
        requet, [nom, prenom, email, password, Role, image],
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
// Login :
router.post("/Login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const requet_1 = "SELECT * FROM persson WHERE email = ?";

    PMS.query(requet_1, [email], (err, reslt) => {
        if (!err) {
            if (reslt.length == 0) {
                res.status(200).json({ Etat: "mot de pass ou l'email invalide" });
            } else {
                const Bool_password = bcrytp.compareSync(password, reslt[0].password);
                if (Bool_password) {
                    res.cookie("connect", reslt[0].id_user, {
                        maxAge: 3600 * 24 * 24 * 24,
                    });

                    req.session.username = reslt[0].email;
                    res
                        .status(200)
                        .json({ Etat: "Success", Data: reslt[0], Role: reslt[0].Role });
                } else {
                    res.status(200).json({ Etat: "Faild" });
                }
            }
        } else {
            res.status(200).json({ Etat: err.message });
        }
    });
});
//

// test :
router.get("/test", (req, res) => {
    const date = new Date(Date());
    console.log(date);
    res.status(200).json({
        Etat: `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    });
});
//
//mot de passs oublier par utilisateur..
const nodemailer = require("nodemailer");
const transports = nodemailer.createTransport({
    //Selectioner super email qui envoier le code de recupération.......
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
    //fonction return le code e récuperation....
    return Math.floor(100000 + Math.random() * 900000);
}

let codeConfirmation = 0;
const ListuserCode = new Map();
router.post("/send-code", (req, res) => {
    const email = req.body.email;
    const code = generateSixDigitNumber();
    try {
        PMS.query(
            "SELECT * FROM persson WHERE email = ? ", [email],
            (err, reslt) => {
                if (!err) {
                    if (reslt.length != 0) {
                        const mailOptions = {
                            from: {
                                name: "mounder",
                                adress: "msemroun@gmail.com",
                            },
                            to: [`${email}`],
                            subject: "Code de vérification pour la récupération de votre compte",
                            text: `Bonjour,

          Vous avez demandé à récupérer l'accès à votre compte.
          
          Voici votre code de vérification à 6 chiffres : ${code}
          
          Veuillez saisir ce code dans l'application pour confirmer votre identité.
          
          Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce message.
          
          Cordialement,
          L’équipe de support`,
                        };
                        send(transports, mailOptions);
                        ListuserCode.set(reslt[0]["id_user"], code);
                        res
                            .status(200)
                            .json({ Etat: "Success", id_user: reslt[0]["id_user"] });
                    } else {
                        res.status(200).json({ Etat: "Faild" });
                    }
                } else {
                    res.status(200).json({ Etat: err.message });
                }
            }
        );
    } catch (error) {
        res.status(500).json({ Etat: error.message });
    }
});

router.post("/verify-code", (req, res) => {
    console.log(ListuserCode);
    const codeConfirmation = req.body.code;
    const id_user = req.body.id_user;
    console.log(ListuserCode.get(id_user));
    console.log(codeConfirmation);
    if (ListuserCode.get(id_user) == codeConfirmation) {
        res.status(200).json({ Etat: "Success", id_user: id_user });
    } else {
        res.status(200).json({ Etat: "Faild" });
    }
});
router.post("/reset-password", (req, res) => {
    const user_id = req.body.id_user;
    const password = bcrytp.hashSync(req.body.password, 10);
    console.log(password);
    console.log(user_id);
    try {
        PMS.query(
            "UPDATE persson set password = ? WHERE id_user = ? ", [password, user_id],
            (err, reslt) => {
                if (!err) {
                    PMS.query(
                        "SELECT * FROM persson WHERE id_user = ?", [user_id],
                        (errSelect, resltSelect) => {
                            if (!errSelect) {
                                console.log(resltSelect);
                                res.cookie("connect", `${user_id}`, {
                                    maxAge: 24 * 24 * 24 * 3600,
                                });
                                res
                                    .status(200)
                                    .json({ Etat: "Success", Role: resltSelect[0]["Role"] });
                            } else {
                                res.status(200).json({ Etat: errSelect.message });
                            }
                        }
                    );
                } else {
                    res.status(200).json({ Etat: err.message });
                }
            }
        );
    } catch (error) {
        res.status(500).json({ Etat: error });
    }
});
//
exports.Login = router;
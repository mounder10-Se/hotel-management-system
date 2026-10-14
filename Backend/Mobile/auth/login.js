const express = require("express");
const router = express.Router();
router.use(express.json());

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
// Login pour le client :
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const requetRole = "SELECT * FROM persson WHERE email = ? AND Role = ?";
        PMS.query(requetRole, [email, "client"], (err, reslt) => {
            if (!err) {
                const Fetch = reslt[0];
                if (Fetch == undefined) {
                    res
                        .status(200)
                        .json({ Etat: "mote de pass ou le email est inccorecte" });
                } else {
                    if (bcrypt.compareSync(password, Fetch["password"])) {
                        console.log(Fetch["id_user"]);
                        res.status(200).json({ Etat: "Success", Data: Fetch["id_user"] });
                    } else {
                        res.status(200).json({ Etat: "mote de pass est  inccorecte" });
                    }
                }
            } else {
                res.status(200).json({ Etat: err.message });
            }
        });
    } catch (error) {
        res.status(500).json({ Etat: error });
    }
});
//

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

router.post("/code", (req, res) => {
    const email = req.body.email;
    PMS.query("SELECT * FROM persson where email = ?", [email], (err, reslt) => {
        if (!err) {
            codeConfirmation = generateSixDigitNumber();
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
          
          Voici votre code de vérification à 6 chiffres : ${codeConfirmation}
          
          Veuillez saisir ce code dans l'application pour confirmer votre identité.
          
          Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce message.
          
          Cordialement,
          L’équipe de support`,
                };

                lsitRecuperation.set(reslt[0]["id_user"], codeConfirmation);
                console.log(lsitRecuperation);
                send(transports, mailOptions); //function donoyer code vers email client pour recupérer le compte..
                res.status(200).json({ Etat: "Success", id: reslt[0]["id_user"] });
            } else {
                res.status(200).json({ Etat: "email invalide" });
            }
        } else {
            res.status(200).json({ Etat: err.message });
        }
    });
});

router.post("/verifier", (req, res) => {
    const id_user = parseInt(req.body.id_user);
    const confirmation = parseInt(req.body.code);
    const expectedCode = lsitRecuperation.get(id_user);

    if (expectedCode === confirmation) {
        res.status(200).json({ Etat: "Success", id: id_user });
    } else {
        res.status(200).json({ Etat: "code invalide" });
    }
});

router.post("/mdf", (req, res) => {
    const id_user = req.body.id_user;

    const password = bcrypt.hashSync(req.body.password, 10);

    PMS.query(
        "UPDATE persson SET password = ? where id_user = ?", [password, id_user],
        (err, reslt) => {
            if (!err) {
                res.status(200).json({ Etat: "Success" });
            } else {
                res.status(200).json({ Etat: err.message });
            }
        }
    );
});
exports.Loginmobile = router;
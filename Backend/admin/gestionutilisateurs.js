module.exports = (io) => {
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
  // Hash les mot de pass
  const bcrypt = require("bcrypt");
  //
  router.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );
  // pour uplade images =>
  const path = require("path");
  const Fs = require("fs");
  const multer = require("multer");
  //
  const cookies = require("cookie-parser");
  const mysql = require("mysql2");
  const PMS = mysql.createConnection({
    host: "localhost",
    password: "",
    user: "root",
    port: "3306",
    database: "pms",
  });

  const ADMINES = new Map();

  router.get("/utilisateurs", (req, res) => {
    const requet = "SELECT * FROM persson";
    PMS.query(requet, (err, reslt) => {
      if (!err) {
        res.status(200).json(reslt);
      } else {
        res.status(200).json({ Etat: err.message });
      }
    });
  });

  const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images/");
    },

    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  const upload = multer({ storage: Storage });

  router.post("/create", upload.single("image"), (req, res) => {
    const test = req.file;
    if (test == undefined) {
      const requet =
        "insert into persson (name , prenom ,Role, email , password) values (?,?,?,?,?)";
      const passHash = bcrypt.hashSync(req.body.password, 10);
      PMS.query(
        requet,
        [
          req.body.nom,
          req.body.prenom,
          req.body.Role,
          req.body.email,
          passHash,
        ],

        (err, reslt) => {
          if (!err) {
            // insert dans notification
            const notification =
              "INSERT INTO notification (contenu , date_c  ) values (?,?) ";
            const date = new Date(Date());
            PMS.query(
              notification,
              [
                ` Un nouvel utilisateur a été ajouté au système (${req.body.email})`,
                date,
              ],
              (err, reslt) => {
                if (!err) {
                  io.emit("new_notification", {
                    id_notification: reslt.insertId, // l'ID de la notif
                    contenu: ` Un nouvel utilisateur a été ajouté au système (${req.body.email})`,
                    date_c: date,
                  });

                  
                  console.log("e");
                  res.status(200).send(reslt);
                } else {
                  res.status(500).send(err.sqlMessage);
                }
              }
            );

            //
          } else {
            res.status(500).send(err.sqlMessage);
          }
        }
      );
    } else {
      const requet =
        "insert into persson (name , prenom ,Role, email , password , image) values (?,?,?,?,?,?)";
      const passHash = bcrypt.hashSync(req.body.password, 10);
      PMS.query(
        requet,
        [
          req.body.nom,
          req.body.prenom,
          req.body.Role,
          req.body.email,
          passHash,
          req.file.filename,
        ],

        (err, reslt) => {
          if (!err) {
            res.status(200).send(reslt);
          } else {
            res.status(500).send(err.sqlMessage);
          }
        }
      );
    }
  });

  // se deconnect :
  router.post("/deconnect", (req, res) => {
    req.session.destroy();
    res.clearCookie("Session");

    res.cookie("connect", "", { maxAge: -3600 });

    res.status(200).json({ Etat: "deconnect" });
  });

  // Update :

  router.get("/infPersson/:id", (req, res) => {
    const id_user = req.params.id;
    const requet_1 = "SELECT * FROM persson WHERE id_user = ?";

    PMS.query(requet_1, [id_user], (err, reslt) => {
      if (!err) {
        res.status(200).json({ Data: reslt[0] });
      } else {
        res.status(200).json({ Etat: err.message });
      }
    });
  });

  router.put("/update", upload.single("image"), (req, res) => {
    const id_user = req.body.id_user;
    const requet = `UPDATE persson set name = ? , prenom = ? , email = ? , Role = ? , image = ?  where id_user = ${id_user} `;
    const requet2 = `UPDATE persson SET name = ? , prenom = ? , email = ? , Role = ?  WHERE persson.id_user = ${id_user} `;
    if (req.file) {
      PMS.query(
        requet,
        [
          req.body.nom,
          req.body.prenom,
          req.body.email,
          req.body.Role,
          req.file.filename,
        ],

        (err, reslt) => {
          if (!err) {
            res.status(200).json([{ Etat: "Success" }]);
          } else {
            res.status(200).json([{ Etat: err.message }]);
          }
        }
      );
    } else {
      PMS.query(
        `UPDATE persson SET name = ?, prenom = ?, email = ? , Role = ? WHERE id_user = ?`,
        [req.body.nom, req.body.prenom, req.body.email, req.body.Role, id_user],
        (err, reslt) => {
          if (!err) {
            res.status(200).json([{ Etat: "Success" }]);
          } else {
            res.status(200).json([{ Etat: err.sqlMessage }]);
          }
        }
      );
    }
  });

  router.get("/allNot", (req, res) => {
    PMS.query("SELECT * FROM notification where vu = 0", (err, reslt) => {
      if (!err) {
        if (reslt.length != 0) {
          const date1 = new Date(Date());

          const date2 = new Date(`${reslt[0].date_c}`);

          const diffMs = Math.abs(date2 - date1);
          const diffMinutes = Math.floor(diffMs / 1000 / 60);
          const diffHeures = Math.floor(diffMinutes / 60);
          const restMinutes = diffMinutes % 60;
          console.log(restMinutes);
          res.status(200).json({
            Etat: "Success",
            minutes: restMinutes,
            hours: diffHeures,
            months: diffMs,
            Data: reslt,
          });
        } else {
          res.status(200).json({
            Etat: "Success",
            minutes: 0,
            hours: 0,
            months: 0,
            Data: 0,
          });
        }
      } else {
        res.status(200).json({ Etat: err.message });
      }
    });
    
  });
  //
  const cron = require("cron");
  io.emit("notification");
  return router;
};

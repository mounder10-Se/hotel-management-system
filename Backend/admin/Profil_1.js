const express = require("express");
const router = express.Router();
router.use(express.json());
const cors = require("cors");
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
const mysql = require("mysql2");
const PMS = mysql.createConnection({
  host: "localhost",
  password: "",
  user: "root",
  port: "3306",
  database: "pms",
});

router.get("/informationPerssonel/:id", (req, res) => {
  const user_id = req.params.id;
  const requet = "SELECT * FROM persson WHERE id_user = ?";
  PMS.query(requet, [user_id], (err, reslt) => {
    if (!err) {
      const Fetch = reslt[0];
      console.log(Fetch);
      res.status(200).json({ Etat: "Success", Data: Fetch });
    } else {
      res.status(200).json({ Etat: err.message });
    }
  });
});

router.delete("/delete/:id", (req, res) => {
  const requetImage = "SELECT * FROM persson WHERE id_user = ?";
  PMS.query(requetImage, [req.params.id], (err, reslt) => {
    const fetch = reslt[0];

    // const pathimage = path.join(__dirname, "images", fetch["image"]);
    const pathimage = `images/${fetch["image"]}`;
    console.log(pathimage);
    Fs.access(pathimage, (err) => {
      if (!err) {
        Fs.unlink(pathimage, (err) => {
          if (!err) {
            const user_id = req.params.id;
            const requet = "DELETE FROM persson WHERE id_user = ?";
            PMS.query(requet, [user_id], (err, reslt) => {
              if (!err) {
                res.status(200).json({ Etat: "Success" });
              } else {
                res.status(200).json({ Etat: err.message });
              }
            });
          } else {
            console.log(err.message);
            console.log("err de suppression");
          }
        });
      } else {
        const user_id = req.params.id;
        const requet = "DELETE FROM persson WHERE id_user = ?";
        PMS.query(requet, [user_id], (err, reslt) => {
          if (!err) {
            res.status(200).json({ Etat: "Success" });
          } else {
            res.status(200).json({ Etat: err.message });
          }
        });
      }
    });
  });
});

exports.Profil_1 = router;

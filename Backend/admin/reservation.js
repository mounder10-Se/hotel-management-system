const express = require("express");
const router = express.Router();
router.use(express.json());
const mysql = require("mysql2");
const cors = require("cors");
const PMS = mysql.createConnection({
  //Mysql
  host: "localhost",
  password: "",
  user: "root",
  port: "3306",
  database: "pms",
});

router.post("/reservation", (req, res) => {
  const id_chambre = req.body.id_ch;
  const id_persson = req.body.id_user;
console.log(id_persson)
  try {
      PMS.query("select * from reservation where id_persson = ?" , [id_persson] ,(err , reslt)=>{
        if (!err) {
            
            if (reslt.length !=0) {
                       res.status(200).json({"Etat" : "déja fait une reservation a cette chambre "});
            } else {
                PMS.query(
                    "insert into reservation (id_persson , id_chambre) values (?,?)",
                    [id_persson, id_chambre],
                    (err, reslt) => {
                      if (!err) {
                        res.status(200).json({ Etat: "Success" });
                      } else {
                        res.status(501).json({ Etat: err.message });
                      }
                    }
                  );
            }
        } else {
            res.status(501).json({"Etat" : err.message});
        }
      })
  } catch (error) {
    res.status(500).json({ Etat: error });
  }
});

exports.reservation = router;

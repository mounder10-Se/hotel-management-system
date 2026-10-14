const express = require("express");
const router = express.Router();
router.use(express.json());
const mysql = require("mysql2");
const cors = require("cors");
router.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
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
router.get("/probleme", (req, res) => {
    PMS.query("select * from problem", (err, result) => {
        if (!err) {
            res.status(200).json(result);
        } else {
            res.status(200).json({ Etat: err.message });
        }
    });
});

router.delete("/probleme/:id", (req, res) => {
    const id = req.params.id;
    try {
        PMS.query("delete from problem where id_problem = ?", [id], (err, result) => {
            if (!err) {
                res.status(200).json({ Etat: "Success" });
            }
        });
    } catch (error) {
        res.status(200).json({ Etat: error.message });
    }
});
exports.probleme = router;
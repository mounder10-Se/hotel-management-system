const express = require("express");
const router = express.Router();
router.use(express.json());
const mysql = require("mysql2");
const cors = require("cors");
const socket = require("socket.io");

router.use(cors({
    origin: '*'
}));
const PMS = mysql.createConnection({
    host: "localhost",
    password: "",
    user: "root",
    port: "3306",
    database: "pms",
}); //connextion avec DB.

router.get("/updateAllNotification", (req, res) => {
    PMS.query("UPDATE notification SET vu = 1 WHERE vu = 0", (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ message: "Notifications updated successfully", Etat: "Success" });
        }
    });
});
router.get("/updateNotification/:id_notification", (req, res) => {
    PMS.query("UPDATE notification SET vu = 1 WHERE id_notification = ?", [req.params.id_notification], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ message: "Notifications updated successfully", Etat: "Success" });
        }
    });
});
exports.Notifications = router;
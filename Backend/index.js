const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const path = require("path");
const cookies = require("cookie-parser");

// Middleware setup
app.use(express.json());
app.use(cookies());
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

//Utilisation d'une SocketIo:
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const Users = new Map();
io.on("connection", (client) => {
    //pour faire la connection

    client.on("registre", (Data) => {
        Users.set(Data.id_user, client.id);
        console.log(Users); //aficher tout les utilisateur connecter.
    });

    client.on("message", (Data) => {
        const idSocket = Users.get(Data.id_user);
        console.log(Data.id_user);
        console.log(idSocket);
        // client.to(idSocket).emit("notifications", { message: Data.message });
    });
});

app.use((req, res, next) => {
    req.Users = Users;
    next();
});

// Import routes
const { Login } = require("./auth/Login");
const { Profil_1 } = require("./admin/Profil_1");
const { probleme } = require("./admin/probleme");
const gestionutilisateurs = require("./admin/gestionutilisateurs");
const { gestionChambre } = require("./admin/gestionChambre");
const { Notifications } = require("./admin/Notifications");
const { Loginmobile } = require("./Mobile/auth/login");
const { App } = require("./Mobile/client/app");
const { reservation } = require("./admin/reservation");
const { creation } = require("./Mobile/auth/creation");
const propertyManager = require("./manager/PropertyManager");
const { manageReservation } = require("./respsionite/manageReservation");
// Static files
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/articles", express.static(path.join(__dirname, "articles")));

// Routes
app.use("/auth", Login);
app.use("/admin", Profil_1);
app.use("/admin", probleme);
app.use("/respsionite", manageReservation);
app.use("/admin/gestionutilisateurs", gestionutilisateurs(io));
app.use("/admin", gestionChambre);
app.use("/admin", Notifications);
app.use("/admin", reservation);
app.use("/Mobile", Loginmobile);
app.use("/Mobile", App);
app.use("/Mobile", creation);
app.use("/", propertyManager);

// Database setup
const mysql = require("mysql2");
const PMS = mysql.createConnection({
    host: "localhost",
    password: "",
    user: "root",
    port: "3306",
    database: "pms",
});

// API routes
app.get("/api/v1/chambres", (req, res) => {
    try {
        PMS.query("select * from  chambre ", (err, reslt) => {
            if (!err) {
                res.status(200).json(reslt);
            } else {
                res.status(200).json({ Etat: err.message });
            }
        });
    } catch (error) {
        res.status(500).json({ Etat: error });
    }
});

app.get("/api/v1/reservations", (req, res) => {
    try {
        PMS.query(
            "select * from  reservation where Etat = ?", ["EN_COURS"],
            (err, reslt) => {
                if (!err) {
                    res.status(200).json(reslt);
                } else {
                    res.status(200).json({ Etat: err.message });
                }
            }
        );
    } catch (error) {
        res.status(500).json({ Etat: error });
    }
});

app.get("/api/v1/utilisateurs", (req, res) => {
    try {
        PMS.query("select * from  persson ", (err, reslt) => {
            if (!err) {
                res.status(200).json(reslt);
            } else {
                res.status(200).json({ Etat: err.message });
            }
        });
    } catch (error) {
        res.status(500).json({ Etat: error });
    }
});

// Cron job for reservation management
const cron = require("node-cron");

cron.schedule("*/1 * * * *", () => {
    const aujourdhui = new Date();
    console.log("La date d'aujourd'hui est :", aujourdhui.toISOString());

    PMS.query(
        "SELECT * FROM reservation WHERE Etat = ?", ["EN_COURS"],
        (err, result) => {
            if (err) {
                console.error(
                    "Erreur lors de la récupération des réservations :",
                    err.message
                );
                return;
            }

            const reservations = result;

            reservations.forEach((reservation) => {
                const dateFin = new Date(reservation.date_fin);

                if (dateFin <= aujourdhui) {
                    PMS.query(
                        "UPDATE reservation SET Etat = ? WHERE id_reservation = ?", ["FIN", reservation.id_reservation],
                        (err) => {
                            if (err) {
                                console.error(
                                    "Erreur lors de la mise à jour de la réservation :",
                                    err.message
                                );
                                return;
                            }

                            PMS.query(
                                "UPDATE chambre SET status = ? WHERE id_ch = ?", ["disponible", reservation.id_chambre],
                                (err) => {
                                    if (err) {
                                        console.error(
                                            "Erreur lors de la mise à jour de la chambre :",
                                            err.message
                                        );
                                        return;
                                    }

                                    const contenuNotif = `La réservation du client N° ${reservation.id_persson} dans la chambre N° ${reservation.id_chambre} est arrivée à sa fin. Veuillez vérifier ou libérer la chambre.`;
                                    const dateNotif = new Date();

                                    PMS.query(
                                        "INSERT INTO notification (contenu, date_c) VALUES (?, ?)", [contenuNotif, dateNotif],
                                        (err, resInsert) => {
                                            if (err) {
                                                console.error(
                                                    "Erreur lors de l'insertion de la notification :",
                                                    err.message
                                                );
                                                return;
                                            }

                                            io.emit("new_notification", {
                                                id_notification: resInsert.insertId,
                                                contenu: contenuNotif,
                                                date_c: dateNotif,
                                            });
                                        }
                                    );
                                }
                            );
                        }
                    );
                } else {
                    console.log(
                        " La réservation n'est pas encore terminée pour le client :",
                        reservation.id_persson
                    );
                }
            });
        }
    );
});

server.listen(port, () => {
    console.log(port);
});
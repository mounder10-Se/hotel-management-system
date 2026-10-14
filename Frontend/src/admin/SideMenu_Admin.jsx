import AddIcon from "@mui/icons-material/Add";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import cookie from "cookies-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import NotificationDropdown from "../acount";
import Ajouter_Chambre from "./AjouterChambre";
import Users from "./Gestion_Utilisateurs";
import GestionChambre from "./GestionChambre";
import TableauDeBord from "./TableauDeBord";
import Problems from "./Problems";

const socket = io.connect("http://localhost:3000");

function About() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">À propos</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Notre Application
          </h3>
          <p className="text-gray-600">
            Cette application de gestion hôtelière permet de gérer efficacement
            les chambres, les utilisateurs et les réservations. Elle offre une
            interface intuitive pour l'administration complète de votre
            établissement.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Fonctionnalités
          </h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Gestion des chambres (ajout, modification, suppression)</li>
            <li>Gestion des utilisateurs et des droits d'accès</li>
            <li>Tableau de bord avec statistiques en temps réel</li>
            <li>Interface responsive et moderne</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Contact</h3>
          <p className="text-gray-600">
            Pour toute question ou assistance, n'hésitez pas à contacter notre
            équipe de support :
            <br />
            Email : support@hotel.com
            <br />
            Téléphone : +213 XX XX XX XX
          </p>
        </div>
      </div>
    </div>
  );
}

function Admin() {
  const [open, setOpen] = useState(false);
  const [content, setConten] = useState("");
  const [openSide, setOpenSide] = useState(true);
  const handleClicksnack = () => {
    setOpen(true);
  };

  const handleClosesnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    socket.emit("registre", { id_user: cookie.get("connect") });
    socket.on("notifications", (Data) => {
      handleClicksnack();
      setConten(`il ya une message  : ${Data.message}`);
    });
  }, []);

  const [activeOption, setActiveOption] = useState("Tableau de bord");
  const [Contenue, SetContenue] = useState(null);
  const [isChambresOpen, setIsChambresOpen] = useState(false);
  const [user, SetUser] = useState([]);
  const navigate = useNavigate();

  const HandelProfil = async () => {
    const respons = await axios.get(
      `informationPerssonel/${cookie.get("connect")}`
    );
    SetUser(respons.data["Data"]);
  };

  useEffect(() => {
    HandelProfil();
  }, []);

  const handleClick = (option) => {
    setActiveOption(option);
    switch (option) {
      case "Tableau de bord":
        SetContenue(<TableauDeBord />);
        break;
      case "Utilisateurs":
        SetContenue(<Users />);
        break;
      case "Problèmes":
        SetContenue(<Problems />);
        break;
      case "Ajouter Chambre":
        SetContenue(<Ajouter_Chambre />);
        break;
      case "Gestion des chambres":
        SetContenue(<GestionChambre />);
        break;
      case "À propos":
        SetContenue(<About />);
        break;
      default:
        SetContenue(<div>Aucune Data</div>);
        break;
    }
  };

  const menuItems = [
    { name: "Tableau de bord", icon: <DashboardOutlinedIcon /> },
    { name: "Utilisateurs", icon: <GroupOutlinedIcon /> },
    { name: "Problèmes", icon: <ReportProblemOutlinedIcon /> },
  ];

  const chambreItems = [
    { name: "Ajouter Chambre", icon: <AddIcon /> },
    { name: "Gestion des chambres", icon: <DynamicFeedIcon /> },
  ];

  return (
    <div className="w-full h-screen bg-[#f5f1e8] flex flex-wrap">
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClosesnack}>
        <Alert
          onClose={handleClicksnack}
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {content}
        </Alert>
      </Snackbar>

      {openSide ? (
        <div className="bg-[#C4A998] w-64 text-white h-full fixed flex flex-col p-4 shadow-lg">
          <div className="flex flex-col items-center py-4">
            <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden mb-2">
              <img
                src={`http://localhost:3000/images/${user.image}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold">mounder</h2>
            <p className="text-sm text-white/80">semroun10@gmail.com</p>
          </div>
          <div className="border-t border-white/20 mt-2 mb-2"></div>
          <div className="uppercase text-sm font-semibold">
            PANNEAU D'ADMINISTRATION
          </div>
          <nav
            className="flex flex-col space-y-2 mt-2 overflow-y-auto h-[calc(100vh-4rem)]"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleClick(item.name)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition duration-300 ${
                  activeOption === item.name
                    ? "bg-black text-white"
                    : "text-white hover:bg-[#b39887]"
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}

            <div className="relative">
              <button
                onClick={() => setIsChambresOpen(!isChambresOpen)}
                className={`flex justify-between items-center w-full px-4 py-3 rounded-md transition duration-300 ${
                  isChambresOpen ? "bg-[#b39887]" : "hover:bg-[#b39887]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <LuggageOutlinedIcon /> Chambres
                </span>
                {isChambresOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </button>

              {isChambresOpen && (
                <div className="ml-4 mt-2 space-y-2 border-l-2 border-white/20 pl-4">
                  {chambreItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleClick(item.name)}
                      className={`flex items-center gap-3 w-full px-4 py-2 rounded-md transition duration-300 ${
                        activeOption === item.name
                          ? "bg-black text-white"
                          : "text-white hover:bg-[#b39887]"
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <button
            onClick={async () => {
              const respons = await axios.post("/deconnect");
              if (respons.data["Etat"] === "deconnect") {
                navigate("/singIn");
              }
            }}
            className="mt-auto flex items-center bg-red-600 gap-3 px-10 py-4 rounded-md hover:bg-red-400 transition duration-300"
          >
            <LoginOutlinedIcon />
            Déconnexion
          </button>
        </div>
      ) : (
        <div className="bg-[#C4A998] w-20 text-white h-full fixed flex flex-col p-4 shadow-lg">
          <div className="flex flex-col items-center py-4">
            <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mb-2">
              <img
                src={`http://localhost:3000/images/${user.image}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="border-t border-white/20 mt-2 mb-2"></div>

          <nav className="flex flex-col space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleClick(item.name)}
                className={`flex items-center justify-center p-3 rounded-md transition duration-300 ${
                  activeOption === item.name
                    ? "bg-black text-white"
                    : "text-white hover:bg-[#b39887]"
                }`}
                title={item.name}
              >
                {item.icon}
              </button>
            ))}

            <button
              onClick={() => setIsChambresOpen(!isChambresOpen)}
              className={`flex items-center justify-center p-3 rounded-md transition duration-300 ${
                isChambresOpen ? "bg-[#b39887]" : "hover:bg-[#b39887]"
              }`}
              title="Chambres"
            >
              <LuggageOutlinedIcon />
            </button>

            {isChambresOpen && (
              <div className="space-y-2">
                {chambreItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleClick(item.name)}
                    className={`flex items-center justify-center p-3 rounded-md transition duration-300 ${
                      activeOption === item.name
                        ? "bg-black text-white"
                        : "text-white hover:bg-[#b39887]"
                    }`}
                    title={item.name}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            )}
          </nav>

          <button
            onClick={async () => {
              const respons = await axios.post("/deconnect");
              if (respons.data["Etat"] === "deconnect") {
                navigate("/singIn");
              }
            }}
            className="mt-auto flex items-center justify-center p-3 rounded-md bg-red-600 hover:bg-red-400 transition duration-300"
            title="Déconnexion"
          >
            <LoginOutlinedIcon />
          </button>
        </div>
      )}

      {openSide ? <div className="w-64"></div> : <div className="w-20"></div>}

      <main className="flex-3 flex flex-col">
        <header className="bg-white shadow-md p-4 flex items-center justify-between w-full">
          <div className="self-start">
            <IconButton onClick={() => setOpenSide(!openSide)}>
              <MenuRoundedIcon />
            </IconButton>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <NotificationDropdown />
          </div>
        </header>
        <section
          className="pt-20 p-6 overflow-y-auto h-[calc(100vh-4rem)]"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {Contenue}
        </section>
      </main>
    </div>
  );
}

export default Admin;

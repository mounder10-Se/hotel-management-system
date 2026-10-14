import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import HandymanIcon from "@mui/icons-material/Handyman";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import cookie from "cookies-js";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

function Dashboard() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Tableau de bord du gestionnaire
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#f5f1e8] p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Employés</h3>
          <p className="text-3xl font-bold text-[#C4A998]">0</p>
          <p className="text-sm text-gray-600">Employés actifs</p>
        </div>
        <div className="bg-[#f5f1e8] p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Maintenance
          </h3>
          <p className="text-3xl font-bold text-[#C4A998]">0</p>
          <p className="text-sm text-gray-600">Demandes en cours</p>
        </div>
        <div className="bg-[#f5f1e8] p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Budget</h3>
          <p className="text-3xl font-bold text-[#C4A998]">$0</p>
          <p className="text-sm text-gray-600">Budget mensuel</p>
        </div>
      </div>
    </div>
  );
}

function PropertyManager() {
  const [open, setOpen] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState("");
  const [openSide, setOpenSide] = useState(true);
  const [activeOption, setActiveOption] = useState("overview");
  const [problemDialogOpen, setProblemDialogOpen] = useState(false);
  const [problemForm, setProblemForm] = useState({
    type_problem: "",
    obj: "",
    message: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Updated user state management
  const [userData, setUserData] = useState({
    name: "",
    prenom: "",
    email: "",
    image: "",
  });

  // Updated user data fetching
  const fetchUserData = async () => {
    try {
      const userId = cookie.get("connect");
      if (userId) {
        const response = await axios.get(`/informationPerssonel/${userId}`);
        if (response.data && response.data.Data) {
          const data = response.data.Data;
          setUserData({
            name: data.name || "",
            prenom: data.prenom || "",
            email: data.email || "",
            image: data.image || "",
          });
        }
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  // Set active option based on current path
  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path === "propmanager") {
      setActiveOption("overview");
    } else {
      setActiveOption(path);
    }
  }, [location]);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Helper function for image URL
  const getImageUrl = (imageFileName) => {
    if (!imageFileName) return "/default-avatar.png";
    try {
      return `http://localhost:3000/images/${imageFileName}`;
    } catch (err) {
      return "/default-avatar.png";
    }
  };

  const handleClicksnack = () => {
    setOpen(true);
  };

  const handleClosesnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleProblemDialogOpen = () => {
    setProblemDialogOpen(true);
  };

  const handleProblemDialogClose = () => {
    setProblemDialogOpen(false);
    setProblemForm({
      type_problem: "",
      obj: "",
      message: "",
    });
  };

  const handleProblemFormChange = (e) => {
    setProblemForm({
      ...problemForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleProblemSubmit = async () => {
    try {
      const userId = cookie.get("connect"); // Get user ID from cookie
      const response = await axios.post(
        `http://localhost:3000/Mobile/problem/${userId}`,
        {
          message: problemForm.message,
          obj: problemForm.obj,
          type: problemForm.type_problem,
        }
      );

      if (response.data) {
        setSnackbarContent("Problème signalé avec succès");
        handleClicksnack();
        handleProblemDialogClose();
      }
    } catch (error) {
      console.error("Error submitting problem:", error);
      setSnackbarContent("Erreur lors de la soumission du problème");
      handleClicksnack();
    }
  };

  const handleClick = (path) => {
    setActiveOption(path);
    navigate(path === "overview" ? "/propmanager" : `/propmanager/${path}`);
  };

  const menuItems = [
    {
      name: "Vue d'ensemble",
      path: "overview",
      icon: <DashboardOutlinedIcon />,
    },
    { name: "Employés", path: "employees", icon: <GroupOutlinedIcon /> },
    { name: "Planning", path: "schedule", icon: <CalendarMonthIcon /> },
    { name: "Budget", path: "budget", icon: <AccountBalanceWalletIcon /> },
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
          {snackbarContent}
        </Alert>
      </Snackbar>

      {openSide ? (
        <div className="bg-[#C4A998] w-64 text-white h-full fixed flex flex-col p-4 shadow-lg">
          <div className="flex flex-col items-center py-4">
            <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden mb-2">
              <img
                src={getImageUrl(userData.image)}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
              />
            </div>
            <h2 className="text-xl font-bold">
              {userData.name} {userData.prenom}
            </h2>
            <p className="text-sm text-white/80">{userData.email}</p>
          </div>
          <div className="border-t border-white/20 mt-2 mb-2"></div>
          <div className="uppercase text-sm font-semibold">
            GESTION DES PROPRIÉTÉS
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
                onClick={() => handleClick(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition duration-300 ${
                  activeOption === item.path
                    ? "bg-black text-white"
                    : "text-white hover:bg-[#b39887]"
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </nav>

          <button
            onClick={async () => {
              const response = await axios.post("/deconnect");
              if (response.data["Etat"] === "deconnect") {
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
                src={getImageUrl(userData.image)}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
              />
            </div>
          </div>
          <div className="border-t border-white/20 mt-2 mb-2"></div>

          <nav className="flex flex-col space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleClick(item.path)}
                className={`flex items-center justify-center p-3 rounded-md transition duration-300 ${
                  activeOption === item.path
                    ? "bg-black text-white"
                    : "text-white hover:bg-[#b39887]"
                }`}
                title={item.name}
              >
                {item.icon}
              </button>
            ))}
          </nav>

          <button
            onClick={async () => {
              const response = await axios.post("/deconnect");
              if (response.data["Etat"] === "deconnect") {
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
            <IconButton
              onClick={handleProblemDialogOpen}
              title="Signaler un problème"
            >
              <ReportProblemIcon />
            </IconButton>
          </div>
        </header>
        <section
          className="pt-20 p-6 overflow-y-auto h-[calc(100vh-4rem)]"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <Outlet />
        </section>
      </main>

      {/* Problem Report Dialog */}
      <Dialog open={problemDialogOpen} onClose={handleProblemDialogClose}>
        <DialogTitle>Signaler un problème</DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            <FormControl fullWidth>
              <InputLabel id="problem-type-label">Type de problème</InputLabel>
              <Select
                labelId="problem-type-label"
                name="type_problem"
                value={problemForm.type_problem}
                onChange={handleProblemFormChange}
                label="Type de problème"
              >
                <MenuItem value="technique">Problème technique</MenuItem>
                <MenuItem value="logiciel">Problème logiciel</MenuItem>
                <MenuItem value="reseau">Problème de réseau</MenuItem>
                <MenuItem value="securite">Problème de sécurité</MenuItem>
                <MenuItem value="performance">Problème de performance</MenuItem>
                <MenuItem value="acces">Problème d'accès</MenuItem>
                <MenuItem value="autre">Autre problème</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Objet"
              name="obj"
              value={problemForm.obj}
              onChange={handleProblemFormChange}
            />

            <TextField
              fullWidth
              label="Message"
              name="message"
              value={problemForm.message}
              onChange={handleProblemFormChange}
              multiline
              rows={4}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProblemDialogClose} color="inherit">
            Annuler
          </Button>
          <Button
            onClick={handleProblemSubmit}
            variant="contained"
            style={{ backgroundColor: "#C4A998" }}
          >
            Soumettre
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PropertyManager;

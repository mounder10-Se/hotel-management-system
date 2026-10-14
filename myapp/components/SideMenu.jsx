import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import cookie from "js-cookie";
import io from "socket.io-client";

// MUI Components
import {
  Button,
  Snackbar,
  Alert,
  Divider,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";

// MUI Icons
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// Components
import NotificationDropdown from "./notification";
import ControlerFacteurs from "./controlerFacteur";
import Alert from "./seuilsDalerte";
import { FactorsDisplay } from "./facteur";
import TodoList from "./tacheconsultaion";
import Planifier from "./planifier";
import Gestionuser from "./manageuser";
import Messagerie from "./Messagerie";

const menuItems = [
  {
    id: "facteur",
    label: "Facteur",
    icon: "/200.png",
    subItems: [
      {
        label: "Controler les facteurs",
        component: <ControlerFacteurs />,
      },
      {
        label: "Configurer les seuils d'alerte",
        component: <Alert />,
      },
      {
        label: "Consulter les facteurs agricoles",
        component: <FactorsDisplay />,
      },
    ],
  },
  {
    id: "taches",
    label: "Tâches",
    icon: "/44.png",
    subItems: [
      {
        label: "Planifier intervention",
        component: <Planifier />,
      },
      {
        label: "Consulter les tâches",
        component: <TodoList />,
      },
    ],
  },
  {
    id: "users",
    label: "Gérer les utilisateurs",
    icon: "/Frame.png",
    component: <Gestionuser />,
  },
  {
    id: "messagerie",
    label: "Messagerie",
    icon: "/Span.svg",
    component: <Messagerie />,
  },
];

function SideMenu() {
  const [openSide, setOpenSide] = useState(true);
  const [active, setActive] = useState("");
  const [component, setComponent] = useState(null);
  const [user, setUser] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [dropdownStates, setDropdownStates] = useState({});

  const socket = io.connect("http://localhost:3000", {
    transports: ["websocket"],
  });

  useEffect(() => {
    socket.emit("register", { id_user: cookie.get("connect") });
    socket.on("alerte", (message) => {
      setAlertMessage(`Les propriétés suivantes ont dépassé le seuil (${message})`);
      setAlertOpen(true);
    });

    fetchUserInfo();
    handleNavigate("Controler les facteurs");
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/lib/user/${cookie.get("connect")}`
      );
      setUser(response.data.Etat);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleNavigate = (label) => {
    setActive(label);
    const item = menuItems.flatMap(item => 
      item.subItems ? item.subItems : item
    ).find(item => item.label === label);
    
    if (item?.component) {
      setComponent(item.component);
    }
  };

  const toggleDropdown = (id) => {
    setDropdownStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <>
      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
          onClose={() => setAlertOpen(false)}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      <div className="flex h-screen">
        {/* Sidebar */}
        <motion.div
          initial={{ width: openSide ? 240 : 72 }}
          animate={{ width: openSide ? 240 : 72 }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-30"
        >
          <div className="p-4 flex items-center gap-3">
            <img src="/public/Container.png" alt="Logo" className="h-8 w-8" />
            {openSide && (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-semibold text-lg"
              >
                HYDROFARM
              </motion.h1>
            )}
          </div>

          <Divider />

          <div className="mt-6 px-2 space-y-2">
            {menuItems.map((item) => (
              <div key={item.id}>
                <Button
                  fullWidth
                  onClick={() => item.subItems ? toggleDropdown(item.id) : handleNavigate(item.label)}
                  className={`justify-start px-3 py-2 ${
                    active === item.label
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  <div className="flex items-center w-full">
                    <img src={item.icon} alt="" className="w-5 h-5" />
                    {openSide && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-3 text-sm font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                    {item.subItems && openSide && (
                      <motion.div
                        animate={{ rotate: dropdownStates[item.id] ? 90 : 0 }}
                        className="ml-auto"
                      >
                        <KeyboardArrowRightIcon />
                      </motion.div>
                    )}
                  </div>
                </Button>

                {item.subItems && openSide && (
                  <AnimatePresence>
                    {dropdownStates[item.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 overflow-hidden"
                      >
                        {item.subItems.map((subItem) => (
                          <Button
                            key={subItem.label}
                            fullWidth
                            onClick={() => handleNavigate(subItem.label)}
                            className={`justify-start px-3 py-1.5 mt-1 ${
                              active === subItem.label
                                ? "bg-green-50 text-green-700"
                                : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                            }`}
                          >
                            <span className="text-sm">{subItem.label}</span>
                          </Button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* User Profile Section */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200"
            initial={{ x: openSide ? 0 : -20, opacity: openSide ? 1 : 0 }}
            animate={{ x: openSide ? 0 : -20, opacity: openSide ? 1 : 0 }}
          >
            {openSide ? (
              <div className="flex items-center gap-3">
                <img
                  src={`http://localhost:3000/images/${user.image}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">Gestionnaire</p>
                  <p className="text-xs text-gray-500">Assia Hammadi</p>
                </div>
              </div>
            ) : (
              <Tooltip title="Assia Hammadi" placement="right">
                <img
                  src={`http://localhost:3000/images/${user.image}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover mx-auto"
                />
              </Tooltip>
            )}
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className={`flex-1 ${openSide ? "ml-60" : "ml-20"}`}>
          {/* Header */}
          <header className="bg-white border-b border-gray-200 h-16 fixed right-0 left-0 top-0 z-20">
            <div className="flex items-center justify-between px-4 h-full">
              <div className="flex items-center gap-4">
                <IconButton
                  onClick={() => setOpenSide(!openSide)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <MenuRoundedIcon />
                </IconButton>
                <div className="relative w-64">
                  <SearchTwoToneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <NotificationDropdown />
                <img
                  src={`http://localhost:3000/images/${user.image}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                />
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="pt-16 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {component}
            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
}

export default SideMenu; 
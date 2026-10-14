import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { createTheme } from "@mui/material/styles";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
// Icons :
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CandlestickChartOutlinedIcon from "@mui/icons-material/CandlestickChartOutlined";
import DisplaySettingsOutlinedIcon from "@mui/icons-material/DisplaySettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import IconButton from "@mui/material/IconButton";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import cookie from "cookies-js";
import Users from "./Gestion_Utilisateurs";
import RoomPreferencesOutlinedIcon from "@mui/icons-material/RoomPreferencesOutlined";
import LoginTwoToneIcon from "@mui/icons-material/LoginTwoTone";
//

import ControlPointDuplicateOutlinedIcon from "@mui/icons-material/ControlPointDuplicateOutlined";
import Ajouter_Chambre from "./AjouterChambre";

import {
  Account,
  AccountPreview,
  AccountPopoverFooter,
  SignOutButton,
} from "@toolpad/core/Account";

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NAVIGATION = [
  {
    kind: "header",
    title: "OPTIONS",
  },
  {
    kind: "divider",
  },
  {
    segment: "manage_users",
    title: (
      <h1 style={{ fontFamily: "inter", fontSize: "19px" }}>
        Gestion des utilisateurs
      </h1>
    ),
    icon: <PeopleAltOutlinedIcon style={{ fontSize: "35px" }} />,
  },

  {
    segment: "controleroom",
    title: (
      <h1 style={{ fontSize: "19px", fontFamily: "inter" }}>
        Propriété controle
      </h1>
    ),
    icon: <RoomPreferencesOutlinedIcon style={{ fontSize: "35px" }} />,
    children: [
      {
        segment: "addroom",
        title: (
          <h1 style={{ fontSize: "17px", fontFamily: "inter" }}>Chambres</h1>
        ),
        icon: <BedOutlinedIcon style={{ fontSize: "25px" }} />,
      },
    ],
  },
  {
    segment: "manage_services",
    title: (
      <h1 style={{ fontSize: "19px", fontFamily: "inter" }}>
        gestion des services
      </h1>
    ),
    icon: <DisplaySettingsOutlinedIcon style={{ fontSize: "35px" }} />,
  },
];

const demoTheme = createTheme({});

function DemoPageContent({ pathname }) {
  const [component, SetComponent] = useState(null);

  useEffect(() => {
    switch (pathname) {
      case "/manage_users":
        SetComponent(<Users />);
        break;
      case "/controleroom/addroom":
        SetComponent(<Ajouter_Chambre />);
        break;
      case "/manage_services":
        SetComponent(<h2>Gestion des Services</h2>);
        break;
      default:
        SetComponent(
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Tableau de bord de l'administrateur
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[#f5f1e8] p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Utilisateurs
                  </h3>
                  <p className="text-3xl font-bold text-[#C4A998]">0</p>
                  <p className="text-sm text-gray-600">Utilisateurs actifs</p>
                </div>
                <div className="bg-[#f5f1e8] p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Chambres
                  </h3>
                  <p className="text-3xl font-bold text-[#C4A998]">0</p>
                  <p className="text-sm text-gray-600">Chambres disponibles</p>
                </div>
                <div className="bg-[#f5f1e8] p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Services
                  </h3>
                  <p className="text-3xl font-bold text-[#C4A998]">0</p>
                  <p className="text-sm text-gray-600">Services actifs</p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#f5f1e8] p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Statistiques rapides
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Taux d'occupation</span>
                      <span className="text-[#C4A998] font-semibold">75%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Revenus mensuels</span>
                      <span className="text-[#C4A998] font-semibold">
                        150,000 DA
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Réservations du mois
                      </span>
                      <span className="text-[#C4A998] font-semibold">45</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f5f1e8] p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Actions rapides
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="bg-[#C4A998] text-white px-4 py-2 rounded-md hover:bg-[#a88b7a] transition-colors duration-200">
                      Ajouter utilisateur
                    </button>
                    <button className="bg-[#C4A998] text-white px-4 py-2 rounded-md hover:bg-[#a88b7a] transition-colors duration-200">
                      Ajouter chambre
                    </button>
                    <button className="bg-[#C4A998] text-white px-4 py-2 rounded-md hover:bg-[#a88b7a] transition-colors duration-200">
                      Gérer services
                    </button>
                    <button className="bg-[#C4A998] text-white px-4 py-2 rounded-md hover:bg-[#a88b7a] transition-colors duration-200">
                      Voir rapports
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        break;
    }
  }, [pathname]);

  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography>{component}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function AccountSidebarPreview(props) {
  const { handleClick, open, mini } = props;
  return (
    <Stack direction="column" p={0}>
      <Divider />
      <AccountPreview
        variant={mini ? "condensed" : "expanded"}
        handleClick={handleClick}
        open={open}
      />
    </Stack>
  );
}

AccountSidebarPreview.propTypes = {
  /**
   * The handler used when the preview is expanded
   */
  handleClick: PropTypes.func,
  mini: PropTypes.bool.isRequired,
  /**
   * The state of the Account popover
   * @default false
   */
  open: PropTypes.bool,
};

function SidebarFooterAccountPopover() {
  return (
    <Stack direction="column">
      <IconButton>
        <Stack direction="row" spacing={1} className="option">
          <Typography>mon profil</Typography>
          <ManageAccountsOutlinedIcon style={{ fontSize: "22px" }} />
        </Stack>
      </IconButton>

      <IconButton>
        {" "}
        <Stack direction="row" spacing={1} className="option">
          <Typography>se d'éconnecte</Typography>
          <LogoutOutlinedIcon style={{ fontSize: "22px" }} />
        </Stack>
      </IconButton>
    </Stack>
  );
}

const createPreviewComponent = (mini) => {
  function PreviewComponent(props) {
    return <AccountSidebarPreview {...props} mini={mini} />;
  }
  return PreviewComponent;
};

function SidebarFooterAccount({ mini }) {
  const PreviewComponent = React.useMemo(
    () => createPreviewComponent(mini),
    [mini]
  );
  return (
    <Account
      slots={{
        preview: PreviewComponent,
        popoverContent: SidebarFooterAccountPopover,
      }}
      slotProps={{
        popover: {
          transformOrigin: { horizontal: "left", vertical: "bottom" },
          anchorOrigin: { horizontal: "right", vertical: "bottom" },
          disableAutoFocus: true,
          slotProps: {
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: (theme) =>
                  `drop-shadow(0px 2px 8px ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.32)"})`,
                mt: 1,
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  bottom: 10,
                  left: 0,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translate(-50%, -50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          },
        },
      }}
    />
  );
}

SidebarFooterAccount.propTypes = {
  mini: PropTypes.bool.isRequired,
};

function DashboardLayoutAccountSidebar(props) {
  const [nom, Setnom] = useState("");
  const [prenom, SetPrenom] = useState("");
  const [email, Setemail] = useState("");
  const [image, Setimage] = useState("");

  const [session, setSession] = React.useState({
    user: {
      name: `${nom}-mùlui`,
      email: "bharatkashyap@outlook.com",
      image: "https://avatars.githubusercontent.com/u/19550456",
    },
  });

  const HandelInformation = async () => {
    var respons = await axios.get(
      `informationPerssonel/${cookie.get("connect")}`
    );
    console.log(respons.data["Data"]["name"]);
    Setnom(respons.data["Data"]["name"]);
    SetPrenom(respons.data["Data"]["prenom"]);
    Setemail(respons.data["Data"]["email"]);
    Setimage(respons.data["Data"]["image"]);

    setSession({
      user: {
        name: `${respons.data["Data"]["name"]} ${respons.data["Data"]["prenom"]}`,
        email: `${respons.data["Data"]["email"]}`,
        image: `http://localhost:3000/images/${respons.data["Data"]["image"]}`,
      },
    });
  };

  React.useEffect(() => {
    HandelInformation();
  }, []);
  const navigate = useNavigate();
  const { window } = props;
  const HandelDeconnect = async () => {
    const respons = await axios.post("/deconnect");
    console.log(respons.data);
    navigate("/login");
  };
  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: "Bharat Kashyap",
            email: "bharatkashyap@outlook.com",
            image: "https://avatars.githubusercontent.com/u/19550456",
          },
        });
      },
      signOut: () => {
        setSession(null);
        HandelDeconnect();
      },
    };
  }, []);

  // Remove this const when copying and pasting into your project.

  const [pathname, setPathname] = React.useState("");
  function SidebarFooter({ mini }) {
    return (
      <Typography
        variant="caption"
        sx={{ m: 1, whiteSpace: "nowrap", overflow: "hidden" }}
      >
        {mini ? (
          <>
            <Divider />
            <IconButton>
              <LoginTwoToneIcon style={{ fontSize: "35px", color: "red" }} />
            </IconButton>
          </>
        ) : (
          <>
            <Divider style={{ alignSelf: "self-end" }} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <IconButton
                style={{
                  display: "flex",
                  width: "90%",
                  justifyContent: "space-between",
                  fontFamily: "inter",
                }}
              >
                <h1 className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 hover:scale-105">
                  <LoginTwoToneIcon style={{ fontSize: "30px" }} /> Déconnexion
                </h1>
              </IconButton>
            </div>
          </>
        )}
      </Typography>
    );
  }

  SidebarFooter.propTypes = {
    mini: PropTypes.bool.isRequired,
  };

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      session={session}
      authentication={authentication}
      branding={{
        title: <h2 style={{ fontFamily: "inter" }}>PANNEAU DADMINISTRATION</h2>,
        logo: "",
      }}
      localeText={"centre"}
    >
      <DashboardLayout
        sidebarExpandedWidth={"290px"}
        sx={{
          backgroundColor: "#f0f0f0",
        }}
        slots={{
          sidebarFooter: SidebarFooter,
        }}
      >
        <DemoPageContent pathname={pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutAccountSidebar.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutAccountSidebar;

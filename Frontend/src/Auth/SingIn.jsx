import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Test() {
  const [passowrd, Setpasswodr] = useState("");
  const [error, Seterror] = useState("");
  const [email, Setemail] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions

    Seterror("");
    if (!email || !passowrd) {
      Seterror("Veuillez remplir tous les champs");
      return;
    }

    try {
      setIsSubmitting(true);
      handleOpen();
      var respons = await axios.post("/Login", {
        password: passowrd,
        email: email,
        withCredentials: true,
      });

      if (respons.data["Etat"] == "Success") {
        setTimeout(() => {
          handleClose();
          const userRole = respons.data.Role; // Assuming the role is returned in the response
          if (userRole === "admin") {
            navigate("/SideMenu");
          } else if (userRole === "manager") {
            navigate("/SideMenu_Manager");
          } else {
            navigate("/aucune");
          }
        }, 2000);
      } else {
        handleClose();
        Seterror("le mot pass ou l'email est incorrect. Veuillez réessauer.");
      }
    } catch (error) {
      handleClose();
      Seterror("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate("/forgot-password");
  };

  return (
    <div
      style={{ height: "100vh", width: "100wh" }}
      className="flex flex-col flex-wrap justify-center items-center bg-[#f5f1e8]"
    >
      <form
        className="bg-white rounded-2xl shadow-lg w-full max-w-md drop-shadow-md p-8"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col justify-self-auto items-center mt-10">
          <img
            src="/public/images/Group 1.png"
            alt=""
            srcSet=""
            className="w-20"
          />
          <h1 className="text-2xl font-bold text-gray-800">Espace Personnel</h1>
          <p className="text-gray-600 mt-2">Portail des membres de l'hôtel</p>
        </div>

        <section className="w-full mt-14 flex flex-wrap flex-col gap-10 items-center">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2 w-96">
            <label className="text-sm font-medium text-gray-700 block">
              Adresse email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => Setemail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c4a998] focus:border-transparent pl-11 transition-all"
                placeholder="exemple@hotel.com"
              />
              <MailOutlinedIcon
                size={20}
                className="text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
              />
            </div>
          </div>

          <div className="space-y-2 w-96">
            <label className="text-sm font-medium text-gray-700 block">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type="password"
                value={passowrd}
                onChange={(e) => Setpasswodr(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c4a998] focus:border-transparent pl-11 transition-all"
                placeholder="Votre mot de passe"
              />
              <VpnKeyOutlinedIcon
                size={20}
                className="text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#c4a998] text-white w-100 p-4 rounded-md hover:bg-[#b39887] transition-colors duration-200 font-medium disabled:opacity-50"
          >
            Se connecter
          </button>

          <button
            onClick={handleForgotPassword}
            className="text-[#c4a998] hover:underline"
          >
            Mot de passe oublié ?
          </button>
        </section>

        <p className="mt-8 text-center text-sm text-gray-500">
          Besoin d'aide ?{" "}
          <button className="text-[#c4a998] hover:underline">
            Contactez-nous
          </button>
        </p>
      </form>

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default Test;

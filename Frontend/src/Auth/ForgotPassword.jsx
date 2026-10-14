import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email) {
      setError("Veuillez saisir votre adresse email");
      return;
    }

    try {
      handleOpen();
      var res = await axios.post("/send-code", {
        email: email,
      });
      navigate("/verify-code", { state: { id_user: res.data["id_user"] } });
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      handleClose();
    }
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
          <img src="/public/images/Group 1.png" alt="" className="w-20" />
          <h1 className="text-2xl font-bold text-gray-800">
            Réinitialisation du mot de passe
          </h1>
          <p className="text-gray-600 mt-2">
            Entrez votre adresse email pour recevoir le code
          </p>
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c4a998] focus:border-transparent pl-11 transition-all"
                placeholder="exemple@hotel.com"
              />
              <MailOutlinedIcon
                size={20}
                className="text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#c4a998] text-white w-100 p-4 rounded-md hover:bg-[#b39887] transition-colors duration-200 font-medium"
          >
            Envoyer le code
          </button>

          <button
            onClick={() => navigate("/SingIn")}
            className="text-[#c4a998] hover:underline"
          >
            Retour à la connexion
          </button>
        </section>
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

export default ForgotPassword;

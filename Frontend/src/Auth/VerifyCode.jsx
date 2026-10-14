import LockResetIcon from "@mui/icons-material/LockReset";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyCode() {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const id_user = location.state.id_user;

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Veuillez saisir le code de vérification à 6 chiffres");
      return;
    }

    try {
      handleOpen();
      var res = await axios.post("/verify-code", {
        code: verificationCode.toString(),
        id_user: id_user,
      });
      if (res.data.Etat == "Success") {
        navigate("/reset-password", {
          state: {
            "id_user": res.data["id_user"],
          },
        });
      } else {
        setError("Code incorrect. Veuillez réessayer.");
      }
    } catch (err) {
      setError("Code incorrect. Veuillez réessayer.");
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
            Vérification du code
          </h1>
          <p className="text-gray-600 mt-2">Entrez le code reçu par email</p>
        </div>

        <section className="w-full mt-14 flex flex-wrap flex-col gap-10 items-center">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2 w-96">
            <label className="text-sm font-medium text-gray-700 block">
              Code de vérification
            </label>
            <div className="relative">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
                  )
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c4a998] focus:border-transparent pl-11 transition-all"
                placeholder="Entrez le code à 6 chiffres"
                maxLength={6}
              />
              <LockResetIcon
                size={20}
                className="text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#c4a998] text-white w-100 p-4 rounded-md hover:bg-[#b39887] transition-colors duration-200 font-medium"
          >
            Vérifier le code
          </button>

          <button
            onClick={() => navigate("/forgot-password")}
            className="text-[#c4a998] hover:underline"
          >
            Retour
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

export default VerifyCode;

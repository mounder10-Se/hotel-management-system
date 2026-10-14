// carde :
import Card from "@mui/material/Card";
//
// select :
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import { useState } from "react";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
//
function Ajouter_Chambre() {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const [imagePreview, setImagePreview] = useState(null);
  const [typChambre, setTypchambre] = useState("standard");
  const [capacite, Setcapacite] = useState("");
  const [Prix, setPrix] = useState("");
  const [Nom_Hotel, SetHotel] = useState("");
  const [desc, setDesc] = useState("");
  const [numbreRoom, setRoom] = useState("");
  const [Status, setStatus] = useState("disponible");
  // methode d'ajouter le chmabre :
  const HandelAjouterchambre = async (event) => {
    event.preventDefault();
    var respons = await axios.post(
      "/ajouterChambre",
      {
        status: Status,
        nomCh: Nom_Hotel,
        type: typChambre,
        image: imagePreview,
        capacite: capacite,
        prix: Prix,
        desc: desc,
        id_chambre: numbreRoom,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (respons.data["Etat"] == "Success") {
      handleOpen();

      setTimeout(() => {
        handleClose();
        alert("la chambre est ajouter dans la base de donne avec success");
        setImagePreview(null);
        setTypchambre("standard");
        Setcapacite("");
        setPrix("");
        SetHotel("");
        setDesc("");
        setRoom("");
        setStatus("disponible");
      }, 3000);
    } else {
      handleOpen();
      setTimeout(() => {
        handleClose();
        alert("le numero du chambre exsite d'éja dans la base de donne");
      }, 3000);
    }
  };
  //
  return (
    <>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "0 auto",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div>
          <Backdrop
            sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
            open={open}
            className="m-auto flex w-full justify-center items-center"
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
        <header
          style={{
            alignSelf: "self-start",
            fontFamily: "inter",
            fontSize: "30px",
          }}
        >
          <h1 className="text-black hover:underline">Ajouter une Chambre</h1>
        </header>
        <Card
          className="bg-white p-6 rounded-lg shadow-md"
          style={{ width: "720px", height: "500px", position: "relative" }}
        >
          <form style={{ height: "100%" }} onSubmit={HandelAjouterchambre}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="col-span-1"
                tyle={{ display: "flex", flexDirection: "column" }}
              >
                <label
                  htmlFor="roomName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                  style={{ display: "flex" }}
                >
                  Nom de la chambre *
                </label>
                <input
                  id="roomName"
                  name="roomName"
                  type="text"
                  required
                  value={Nom_Hotel}
                  onChange={(event) => {
                    SetHotel(event.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#c4a998]  "
                  placeholder="Ex: Chambre Deluxe"
                />
              </div>
              <div
                className="col-span-1"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label
                  htmlFor="floor"
                  className="block text-sm font-medium text-gray-700 mb-1"
                  style={{ alignSelf: "self-start" }}
                >
                  numero *
                </label>
                <input
                  id="floor"
                  name="floor"
                  type="number"
                  required
                  min="0"
                  value={numbreRoom}
                  onChange={(event) => {
                    setRoom(event.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#c4a998] "
                  placeholder="Ex: 2"
                />
              </div>
              <div
                className="col-span-1"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                  style={{ alignSelf: "self-start" }}
                >
                  Prix (€) *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={Prix}
                  onChange={(event) => {
                    setPrix(event.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#c4a998] "
                  placeholder="Ex: 99.99"
                />
              </div>
              <div
                className="col-span-1"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                  style={{ alignSelf: "self-start" }}
                >
                  Capacité *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={capacite}
                  onChange={(event) => {
                    Setcapacite(event.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#c4a998] "
                  placeholder="Ex: 3"
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                  style={{ alignSelf: "self-start" }}
                >
                  Statut *
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={Status}
                  onChange={(event) => {
                    setStatus(event.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#c4a998] "
                >
                  <option value="disponible">Disponible</option>
                  <option value="réservée">Réservée</option>
                  <option value="maintenance">En maintenance</option>
                  <option value="cleaning">En nettoyage</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                  style={{ alignSelf: "self-start" }}
                >
                  type chambre *
                </label>
                <select
                  required
                  value={typChambre}
                  onChange={(event) => {
                    setTypchambre(event.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#c4a998] "
                >
                  <option value="standard">standard</option>
                  <option value="luxe">luxe</option>
                  <option value="suite">suite</option>
                  <option value="Familiale">Familiale</option>
                  <option value="Lune de Miel">Lune de Miel</option>
                </select>
              </div>
            </div>

            {/*  */}

            <section className="flex flex-row justify-items-start items-center gap-x-20">
              <div className="flex flex-col items-center gap-4">
                <input
                  id="fileInput"
                  type="file"
                  name="image"
                  className={"hidden"}
                  onChange={(event) => {
                    setImagePreview(event.target.files[0]);
                  }}
                />
                <label
                  htmlFor="fileInput"
                  className={
                    "inline-block select-none cursor-pointer active:scale-95 bg-[#C4A998] text-white hover:bg-[#b39887] px-4 py-4 rounded-2xl m-5 "
                  }
                >
                  <BackupOutlinedIcon /> Télécharger l'image
                </label>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  style={{ alignSelf: "self-start" }}
                >
                  Description *
                </label>
                <textarea
                  name=""
                  id=""
                  value={desc}
                  onChange={(event) => {
                    setDesc(event.target.value);
                  }}
                  placeholder=""
                  className="px-13 py-10 border border-gray-300 focus:ring-2 focus:ring-[#c4a998]"
                ></textarea>
              </div>
            </section>
            {/*  */}
            <div className="mt-8 flex justify-end -translate-y-4">
              <button
                // w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#c4a998]
                type="submit"
                className="px-6 py-2  rounded-md bg-[#C4A998] text-white hover:bg-[#b39887] focus:outline-none focus:ring-2  focus:ring-offset-2 "
              >
                Ajouter la chambre
              </button>
            </div>
          </form>
        </Card>
      </section>
    </>
  );
}

export default Ajouter_Chambre;

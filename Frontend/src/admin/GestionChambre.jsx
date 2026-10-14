import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import Backdrop from "@mui/material/Backdrop";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useEffect, useState } from "react";
import Paginations from "./pagination";
//pour la modification
import CloseIcon from "@mui/icons-material/Close";
import AppBar from "@mui/material/AppBar";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

// snackBar
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
//
function GestionChambre() {
  // SnackBare :
  const [open3, setOpen3] = useState(false);

  const handleClicksnack = () => {
    setOpen3(true);
  };

  const handleClosesnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen3(false);
  };

  //
  // les methode pour la modifications

  const [open2, setOpen2] = useState(false);

  const handleClickOpen2 = () => {
    setOpen2(true);
    setError("");
  };

  const handleClose2 = () => {
    setOpen2(false);
    setError("");
  };

  const [imagePreview, setImagePreview] = useState(null);
  const [typChambre, setTypchambre] = useState("standard");
  const [capacite, Setcapacite] = useState("");
  const [Prix, setPrix] = useState("");
  const [Nom_Hotel, SetHotel] = useState("");
  const [desc, setDesc] = useState("");
  const [numbreRoom, setRoom] = useState("");
  const [Status, setStatus] = useState("disponible");
  const [Error, setError] = useState("");
  const [idchambre, setcham] = useState("");

  const HandelgetInformations = async (id) => {
    var respons = await axios.get(`/infoChambre/${id}`);
    if (respons.data["Etat"] == "Success") {
      setTypchambre(respons.data["Data"].type);
      Setcapacite(respons.data["Data"].capacité);
      setPrix(respons.data["Data"].prix);
      SetHotel(respons.data["Data"].nom_chambre);
      setDesc(respons.data["Data"].description);
      setRoom(respons.data["Data"].id_ch);
      setStatus(respons.data["Data"].status);
      setcham(respons.data["Data"].id_ch);
    } else {
      console.log(respons.status);
    }
  };

  //
  const [chambres, setChambres] = useState([]);
  const [open, setOpen] = useState(false);
  const [refresh, Setrefresh] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const GetChambres = async () => {
    try {
      const response = await axios.get("/chambres");
      if (response.data["Etat"] === "Success") {
        setChambres(response.data["Data"]);
      } else {
        alert(response.data["Etat"]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des chambres :", error);
    }
  };

  useEffect(() => {
    GetChambres();
  }, [refresh]);

  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 3;
  const indexOfLast = currentPage * postPerPage;
  const indexOfFirst = indexOfLast - postPerPage;
  const result = chambres.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto mt-10">
      {/* snackBar */}
      <div>
        {/* <Button onClick={handleClicksnack}>Open Snackbar</Button> */}
        <Snackbar
          open={open3}
          autoHideDuration={3000}
          onClose={handleClosesnack}
        >
          <Alert
            onClose={handleClosesnack}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            la chambre est mise ajouré
          </Alert>
        </Snackbar>
      </div>
      {/*  */}
      {/*  */}
      <Dialog fullScreen open={open2} onClose={handleClose2}>
        <AppBar sx={{ position: "relative", backgroundColor: "#C4A998" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose2}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Sound
            </Typography>
          </Toolbar>
        </AppBar>
        <List className="h-full">
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
                sx={(theme) => ({
                  color: "#fff",
                  zIndex: theme.zIndex.drawer + 1,
                })}
                open={open}
                className="m-auto flex w-full justify-center items-center"
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            </div>
            {/* message Error */}
            {Error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm  m-5">
                {Error}
              </div>
            )}
            {/*  */}
            <Card
              className="bg-white  rounded-lg drop-shadow-lg p-8"
              style={{ width: "720px", height: "500px", position: "relative" }}
            >
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (imagePreview) {
                    var respons = await axios.put(
                      `/modifierChambre/${idchambre}`,
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
                        handleClose2();
                        handleClicksnack();
                        handleClose();
                        handleClose2();
                        handleClicksnack();
                        handleClose();
                      }, 2000);
                    } else {
                      setError(respons.data["Etat"]);
                    }
                  } else {
                    var respons = await axios.put(
                      `/modifierChambre/${idchambre}`,
                      {
                        status: Status,
                        nomCh: Nom_Hotel,
                        type: typChambre,
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
                        handleClose2();
                        handleClicksnack();
                        handleClose();
                        Setrefresh(!refresh);
                      }, 2000);
                    } else {
                      setError(respons.data["Etat"]);
                    }
                  }
                }}
              >
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
        </List>
      </Dialog>
      {/*  */}
      <div className="m-auto">
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={open}
          className="m-auto flex w-full justify-center items-center"
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      <h2 className="text-2xl font-bold mb-4">Liste des Chambres</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Image</th>
            <th className="border border-gray-300 px-4 py-2">N° Chambre</th>
            <th className="border border-gray-300 px-4 py-2">Nom</th>
            <th className="border border-gray-300 px-4 py-2">Type</th>
            <th className="border border-gray-300 px-4 py-2">Capacité</th>
            <th className="border border-gray-300 px-4 py-2">Prix</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {result.map((chambre) => (
            <tr key={chambre.id_ch} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 flex justify-center">
                <img
                  src={`http://localhost:3000/articles/${chambre.image}`}
                  alt="Image de chambre"
                  width={100}
                  className="rounded-lg"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {chambre.id_ch}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {chambre.nom_chambre}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {chambre.type}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {chambre.capacité}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {chambre.prix}$
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <div
                  className={`rounded-lg px-2 py-1 text-sm text-center ${
                    chambre.status === "disponible"
                      ? "border-green-300 bg-green-300 text-green-700"
                      : chambre.status === "cleaning"
                        ? "border-red-300 bg-red-300 text-red-700"
                        : chambre.status === "réservée"
                          ? "border-yellow-300 bg-yellow-300 text-yellow-700"
                          : chambre.status === "en nettoyage"
                            ? "border-purple-300 bg-purple-300 text-purple-700"
                            : chambre.status === "maintenance"
                              ? "border-blue-300 bg-blue-300 text-blue-700"
                              : ""
                  }`}
                >
                  {chambre.status}
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <span className="w-40 truncate block">
                  {chambre.description}
                </span>
              </td>
              <td className="border border-gray-300 px-4 py-2 ">
                <div className={"flex flex-row justify-around"}>
                  <form
                    action=""
                    onSubmit={async (event) => {
                      event.preventDefault();
                      var respons = await axios.delete(
                        `/dletechamre/${chambre.id_ch}`
                      );
                      if (respons.data["Etat"] == "Success") {
                        handleOpen();
                        setTimeout(() => {
                          handleClose();
                          alert(
                            `${chambre.nom_chambre} supprimer avec success`
                          );
                          setCurrentPage(1);
                          Setrefresh(!refresh);
                        }, 3000);
                      } else {
                        handleOpen();
                        setTimeout(() => {
                          handleClose();
                          alert(
                            `${chambre.nom_chambre} impossile de supprimer`
                          );
                          setCurrentPage(1);
                          Setrefresh(!refresh);
                        }, 3000);
                      }
                    }}
                  >
                    <button
                      className={"text-red-500 hover:text-red-300"}
                      type="submit"
                    >
                      <DeleteOutlineOutlinedIcon />
                    </button>
                  </form>

                  <button
                    className={"text-[#C4A998] hover:text-[#cfc3bc]"}
                    onClick={() => {
                      handleClickOpen2();
                      HandelgetInformations(chambre.id_ch);
                    }}
                  >
                    <ModeEditOutlineOutlinedIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        <Paginations
          ChambrePage={postPerPage}
          totalChambres={chambres.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}

export default GestionChambre;

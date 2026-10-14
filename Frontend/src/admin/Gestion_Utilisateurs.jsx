import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Cookies from "cookies-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// snackBar
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
//
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
function Users() {
  
  // SnackBare :
  const [open, setOpen] = useState(false);

  const handleClicksnack = () => {
    setOpen(true);
  };

  const handleClosesnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const [openerr, setOpenerr] = useState(false);

  const handleClicksnackerr = () => {
    setOpenerr(true);
  };

  const handleClosesnackerr = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenerr(false);
  };
  const [openeup, setOpeneup] = useState(false);

  const handleClicksnackeup = () => {
    setOpeneup(true);
  };

  const handleClosesnackeup = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpeneup(false);
  };
  //
  const [Role, setRole] = useState("");
  const [id_update, setUpdate] = useState("");
  const [Role2, setRole2] = useState("");
  const [user, setUser] = useState([]);
  const [Nom, SetNom] = useState("");
  const [Prenom, SetPrenom] = useState("");
  const [Email, SetEmail] = useState("");
  const [motPass, setMot] = useState("");
  const [image, SetImage] = useState("");
  const [name, setname] = useState("");
  const [lastNae, SetLastName] = useState("");
  const [email, Seteamail] = useState("");
  const [lienImage, setLienimage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [Opn, SetOpn] = useState(false);
  const [Opn2, SetOpn2] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [Etat, Setetat] = useState(false);
  const [circule, Setcircule] = useState(false);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const HandelOpen = () => SetOpn(true);
  const HandelClose = () => SetOpn(false);
  const HandelOpen2 = () => SetOpn2(true);
  const HandelClose2 = () => SetOpn2(false);

  const HandelCreate = async (event) => {
    event.preventDefault();
    if (!Nom || !Prenom || !Email || !motPass) {
      alert("Remplir tous les champs");
    } else {
      const respons = await axios.post(
        "/create",
        {
          i_user: Cookies.get("connect"),
          nom: Nom,
          prenom: Prenom,
          email: Email,
          Role: Role,
          password: motPass,
          image: image,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(respons.data);
      Setetat(true);
      HandelClose2();
      handleClicksnack();
      setTimeout(() => {
        handleClosesnack();
      }, 2000);
    }
  };

  const FetchData = async () => {
    const respons = await axios.get("/utilisateurs");
    console.log(respons.data);
    setUser(respons.data);
  };

  useEffect(() => {
    FetchData();
  }, []);

  const filteredUsers = user.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const List_User = currentItems.map((element) => {
    if (element.id_user != Cookies.get("connect")) {
      return (
        <TableRow key={element.id_user}>
          <TableCell>{element.id_user}</TableCell>
          <TableCell>{element.name}</TableCell>
          <TableCell>{element.prenom}</TableCell>
          <TableCell>{element.email}</TableCell>
          <TableCell>{element.Role}</TableCell>

          <TableCell>
            <div style={{ width: "70px", height: "70px", borderRadius: "50%" }}>
              <img
                src={
                  element.image == null || element.image == undefined
                    ? "/images/OIP.jpg"
                    : `http://localhost:3000/images/${element.image}`
                }
                style={{ width: "70px", height: "70px", borderRadius: "50%" }}
                alt="Profile"
              />
            </div>
          </TableCell>
          <TableCell>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                const respons = await axios.delete(
                  `/delete/${element.id_user}`,
                  {
                    withCredentials: true,
                  }
                );
                console.log(respons.data[0]);
                Setetat(true);

                handleClicksnackerr();
                setTimeout(() => {
                  handleClosesnackerr();
                }, 3000);
              }}
            >
              <Button variant="outlined" color="error" type="submit">
                SUPRIMER
              </Button>
            </form>
          </TableCell>
          <TableCell>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
              }}
            >
              <Button
                variant="outlined"
                type="submit"
                onClick={async (event) => {
                  event.preventDefault();
                  var respons = await axios.get(
                    `/infPersson/${element.id_user}`
                  );
                  const Data = respons.data["Data"];
                  setname(Data.name);
                  SetLastName(Data.prenom);
                  setRole2(Data.Role);
                  Seteamail(Data.email);
                  setUpdate(Data.id_user);
                  HandelOpen();
                }}
              >
                UPDATE
              </Button>
            </form>
          </TableCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow key={element.id_user}>
          <TableCell
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "27px",
              alignItems: "center",
            }}
          >
            <BadgeOutlinedIcon />
            {element.id_user}
          </TableCell>
          <TableCell>{element.name}</TableCell>
          <TableCell>{element.prenom}</TableCell>
          <TableCell>{element.email}</TableCell>
          <TableCell>{element.Role}</TableCell>

          <TableCell>
            <div style={{ width: "70px", height: "70px", borderRadius: "50%" }}>
              <img
                src={
                  element.image == null || element.image == undefined
                    ? "/images/OIP.jpg"
                    : `http://localhost:3000/images/${element.image}`
                }
                style={{ width: "70px", height: "70px", borderRadius: "50%" }}
                alt="Profile"
              />
            </div>
          </TableCell>
          <TableCell>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                const respons = await axios.delete(
                  `/delete/${element.id_user}`,
                  {
                    withCredentials: true,
                  }
                );
                console.log(respons.data[0]);
                Setetat(true);

                handleClicksnackerr();
                setTimeout(() => {
                  handleClosesnackerr();
                }, 3000);
              }}
            >
              <Button variant="outlined" color="error" type="submit">
                SUPRIMER
              </Button>
            </form>
          </TableCell>
          <TableCell>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
              }}
            >
              <Button
                variant="outlined"
                type="submit"
                onClick={async (event) => {
                  event.preventDefault();
                  var respons = await axios.get(
                    `/infPersson/${element.id_user}`
                  );
                  const Data = respons.data["Data"];
                  setname(Data.name);
                  SetLastName(Data.prenom);
                  setRole2(Data.Role);
                  Seteamail(Data.email);
                  setUpdate(Data.id_user);
                  HandelOpen();
                }}
              >
                UPDATE
              </Button>
            </form>
          </TableCell>
        </TableRow>
      );
    }
  });

  const Test_Err = () => {
    setTimeout(() => {
      Setcircule(true);
    }, 3000);
    return circule ? (
      <div className={"text-center"}>Aucune Data pour afficher</div>
    ) : (
      <CircularProgress className={"ml-180 mt-50"}  />
    );
  };

  useEffect(() => {
    Setcircule(false);
    Test_Err();
    Setetat(false);
    FetchData();
  }, [searchTerm, Etat]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const HandelDeleteCokie = async (event) => {
    event.preventDefault();
    const respons = await axios.get("/Cokies");
    if (respons.data[0]["Etat"] === "Deconnexion") {
      navigate("/login");
    }
  };

  const HandelUpdate = async (event) => {
    event.preventDefault();
    var respons = await axios.put(
      `/update`,
      {
        nom: name,
        prenom: lastNae,
        email: email,
        image: lienImage,
        Role: Role2,
        id_user: id_update,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(respons.data);
    HandelClose();
    Setetat(true);
    handleClicksnackeup();
    setTimeout(() => {
      handleClosesnackeup();
    }, 3000);
  };

  return (
    <>

      <section  style={{ marginTop: "90px", display:'flex' , justifyContent:'space-around' , flexDirection:'column'  ,gap:'20px'  }}>
      <TextField
          label="Rechercher..."
          variant="outlined"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
       
        />

 
 <button  onClick={HandelOpen2} className={"fixed top-22 left-70 bg-[#c4a998] text-white p-4 rounded-md hover:bg-[#b39887] transition-colors duration-200 font-medium"}>
 Ajouter nouveau compte
 </button>
     

        <div >
          {List_User.length !== 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 400 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="center">Nom</TableCell>
                    <TableCell align="center">Prenom</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Role</TableCell>
                    <TableCell align="center">Profil</TableCell>
                    <TableCell>Option1</TableCell>
                    <TableCell>Option2</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{List_User}</TableBody>
              </Table>
              <Pagination
                count={Math.ceil(filteredUsers.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                style={{
                  padding: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              />
          
            </TableContainer>

          ) : (
            Test_Err()
          )}
        </div>

        <Dialog
          open={Opn2}
          onClose={HandelClose2}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            Créer un nouveau compte :
          </DialogTitle>
          <DialogContent>
            <DialogContentText style={{ height: "300px" }}>
              <form
                onSubmit={HandelCreate}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "end",
                  marginTop: "30px",
                  padding: "20px",
                  gap: "48px",


                  height: "100%",
                  margin: "0 auto",
                }}
              >
                <div
                  className={"Ajouter"}
                  style={{
                    margin: "50px",
                    height: "120px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className={"mb-5"}
                  >
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                    >
                      Choisir une image
                      <VisuallyHiddenInput
                        type="file"
                        name="image"
                        onChange={(event) => SetImage(event.target.files[0])}
                        multiple
                      />
                    </Button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "20px",
                      width: "100%",
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      label="Nom"
                      variant="outlined"
                      style={{ width: "200px" }}
                      value={Nom}
                      onChange={(event) => SetNom(event.target.value)}
                    />
                    <TextField
                      id="outlined-basic"
                      label="Prenom"
                      variant="outlined"
                      style={{ width: "200px" }}
                      value={Prenom}
                      onChange={(event) => SetPrenom(event.target.value)}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      height: "500px",
                      gap: "20px",
                      marginTop: "8px",
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      label="Email"
                      variant="outlined"
                      style={{ width: "500px" }}
                      type="email"
                      value={Email}
                      onChange={(event) => SetEmail(event.target.value)}
                    />
                    <TextField
                      id="outlined-basic"
                      label="Password"
                      variant="outlined"
                      style={{ width: "500px" }}
                      type="password"
                      value={motPass}
                      onChange={(event) => setMot(event.target.value)}
                    />
                  </div>

                  <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-filled-label">
                      Role
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      value={Role}
                      onChange={(event) => {
                        setRole(event.target.value);
                      }}
                    >
                      <MenuItem value="">
                        <em>Aucune</em>
                      </MenuItem>
                      <MenuItem value={"client"}>client</MenuItem>
                      <MenuItem value={"employée"}>Employée</MenuItem>
                      <MenuItem value={"admin"}>admin</MenuItem>
                      <MenuItem value={"gestionnaire"}>gestionnaire</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </form>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={HandelClose2}>Cancel</Button>
            <form action="">
              <Button type="submit" onClick={HandelCreate}>
                Créer
              </Button>
            </form>
          </DialogActions>
        </Dialog>

        <Dialog
          open={Opn}
          onClose={HandelClose}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            Mettre à jour vos informations
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <div>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Choisir une image
                  <VisuallyHiddenInput
                    type="file"
                    name="image"
                    onChange={(event) => setLienimage(event.target.files[0])}
                    multiple
                  />
                </Button>
              </div>
              <section style={{ display: "flex" }}>
                <TextField
                  id="outlined-basic"
                  label="Nom"
                  variant="outlined"
                  style={{ width: "300px", margin: "15px" }}
                  value={name}
                  onChange={(event) => setname(event.target.value)}
                />
                <TextField
                  id="outlined-basic"
                  label="Prenom"
                  variant="outlined"
                  style={{ width: "300px", margin: "15px" }}
                  value={lastNae}
                  onChange={(event) => SetLastName(event.target.value)}
                />
              </section>
              <section>
                <TextField
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  style={{ width: "500px", margin: "15px" }}
                  value={email}
                  type="email"
                  onChange={(event) => Seteamail(event.target.value)}
                />
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-filled-label">
                    Role
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={Role2}
                    onChange={(event) => {
                      setRole2(event.target.value);
                    }}
                  >
                    <MenuItem value="">
                      <em>Aucune</em>
                    </MenuItem>
                    <MenuItem value={"client"}>client</MenuItem>
                    <MenuItem value={"employée"}>Employée</MenuItem>
                    <MenuItem value={"admin"}>admin</MenuItem>
                  </Select>
                </FormControl>
              </section>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={HandelClose}>Cancel</Button>
            <form action="">
              <Button type="submit" onClick={HandelUpdate}>
                Mettre à jour
              </Button>
            </form>
          </DialogActions>
        </Dialog>
      </section>
      <div>
        {/* <Button onClick={handleClicksnack}>Open Snackbar</Button> */}
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClosesnack}
        >
          <Alert
            onClose={handleClosesnack}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Compte est creé avec success
          </Alert>
        </Snackbar>
      </div>
      <div>
        {/* <Button onClick={handleClicksnack}>Open Snackbar</Button> */}
        <Snackbar
          open={openerr}
          autoHideDuration={3000}
          onClose={handleClosesnackerr}
        >
          <Alert
            onClose={handleClosesnackerr}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Compte est supprimer avec success
          </Alert>
        </Snackbar>
      </div>
      <div>
        {/* <Button onClick={handleClicksnack}>Open Snackbar</Button> */}
        <Snackbar
          open={openeup}
          autoHideDuration={3000}
          onClose={handleClosesnackeup}
        >
          <Alert
            onClose={handleClosesnackeup}
            severity="info"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Compte est Mettre a joure avec success
          </Alert>
        </Snackbar>
      
      </div>
    </>
  );
}

export default Users;

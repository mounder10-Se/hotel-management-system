import { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Snackbar,
  Alert,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

function ConsulterReservation() {
  const [reservations, setReservations] = useState([]);
  const [clients, setClients] = useState([]);
  const [chambres, setChambres] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editForm, setEditForm] = useState({
    id_persson: "",
    id_chambre: "",
    date_debut: "",
    date_fin: "",
    Etat: "",
  });

  // Chargement des données
  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/respsionite/allReservation"
      );
      setReservations(response.data.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
      handleSnackbar("Erreur lors du chargement des réservations", "error");
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/respsionite/clients");
      setClients(response.data.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      handleSnackbar("Erreur lors du chargement des clients", "error");
    }
  };

  const fetchChambres = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/respsionite/chambresL"
      );
      setChambres(response.data.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des chambres:", error);
      handleSnackbar("Erreur lors du chargement des chambres", "error");
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchClients();
    fetchChambres();
  }, []);

  // Gestion des snackbars
  const handleSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  // Gestion de la pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Gestion de la modification
  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setEditForm({
      id_persson: reservation.id_persson,
      id_chambre: reservation.id_chambre,
      date_debut: reservation.date_debut.split("T")[0],
      date_fin: reservation.date_fin.split("T")[0],
      Etat: reservation.Etat,
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:3000/respsionite/modifierReservation/${selectedReservation.id_reservation}`,
        editForm
      );
      handleSnackbar("Réservation modifiée avec succès", "success");
      setEditDialogOpen(false);
      fetchReservations();
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      handleSnackbar("Erreur lors de la modification", "error");
    }
  };

  // Gestion de la suppression
  const handleDelete = (reservation) => {
    setSelectedReservation(reservation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.post(
        `http://localhost:3000/respsionite/supprimerReservation/${selectedReservation.id_reservation}`
      );
      handleSnackbar("Réservation supprimée avec succès", "success");
      setDeleteDialogOpen(false);
      fetchReservations();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      handleSnackbar("Erreur lors de la suppression", "error");
    }
  };

  // Fonction pour obtenir le nom du client
  const getClientName = (id) => {
    const client = clients.find((c) => c.id_user === id);
    return client ? `${client.name} ${client.prenom}` : id;
  };

  // Fonction pour obtenir les détails de la chambre
  const getChambreDetails = (id) => {
    const chambre = chambres.find((c) => c.id_ch === id);
    return chambre ? `Chambre ${chambre.id_ch} - ${chambre.type}` : id;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Paper elevation={3} sx={{ backgroundColor: "#f8f8f8", p: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: "#2c3e50",
            borderBottom: "3px solid #C4A998",
            paddingBottom: "10px",
            marginBottom: "20px",
          }}
        >
          Liste des Réservations
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#C4A998" }}>
                <TableCell sx={{ color: "white" }}>ID</TableCell>
                <TableCell sx={{ color: "white" }}>Client</TableCell>
                <TableCell sx={{ color: "white" }}>Chambre</TableCell>
                <TableCell sx={{ color: "white" }}>État</TableCell>
                <TableCell sx={{ color: "white" }}>Date début</TableCell>
                <TableCell sx={{ color: "white" }}>Date fin</TableCell>
                <TableCell sx={{ color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((reservation) => (
                  <TableRow key={reservation.id_reservation}>
                    <TableCell>{reservation.id_reservation}</TableCell>
                    <TableCell>
                      {getClientName(reservation.id_persson)}
                    </TableCell>
                    <TableCell>
                      {getChambreDetails(reservation.id_chambre)}
                    </TableCell>
                    <TableCell>{reservation.Etat}</TableCell>
                    <TableCell>
                      {new Date(reservation.date_debut).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(reservation.date_fin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(reservation)}
                        sx={{ color: "#C4A998" }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(reservation)}
                        sx={{ color: "#ff6b6b" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={reservations.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>

        {/* Dialog de modification */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Modifier la réservation</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "grid", gap: 2, pt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Client</InputLabel>
                <Select
                  value={editForm.id_persson}
                  onChange={(e) =>
                    setEditForm({ ...editForm, id_persson: e.target.value })
                  }
                  label="Client"
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id_user} value={client.id_user}>
                      {client.name} {client.prenom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Chambre</InputLabel>
                <Select
                  value={editForm.id_chambre}
                  onChange={(e) =>
                    setEditForm({ ...editForm, id_chambre: e.target.value })
                  }
                  label="Chambre"
                >
                  {chambres.map((chambre) => (
                    <MenuItem key={chambre.id_ch} value={chambre.id_ch}>
                      Chambre {chambre.id_ch} - {chambre.type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>État</InputLabel>
                <Select
                  value={editForm.Etat}
                  onChange={(e) =>
                    setEditForm({ ...editForm, Etat: e.target.value })
                  }
                  label="État"
                >
                  <MenuItem value="EN_COUR">En cours</MenuItem>
                  <MenuItem value="FIN">Terminée</MenuItem>
                </Select>
              </FormControl>

              <TextField
                type="date"
                label="Date de début"
                value={editForm.date_debut}
                onChange={(e) =>
                  setEditForm({ ...editForm, date_debut: e.target.value })
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                type="date"
                label="Date de fin"
                value={editForm.date_fin}
                onChange={(e) =>
                  setEditForm({ ...editForm, date_fin: e.target.value })
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
            <Button
              onClick={handleEditSubmit}
              variant="contained"
              sx={{
                backgroundColor: "#C4A998",
                "&:hover": { backgroundColor: "#a88b7a" },
              }}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de suppression */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            Êtes-vous sûr de vouloir supprimer cette réservation ?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar pour les notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </div>
  );
}

export default ConsulterReservation;

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
  Typography,
  Box,
  Snackbar,
  Alert,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

function ConsulterProgramme() {
  const [schedules, setSchedules] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [editForm, setEditForm] = useState({
    employee_name: "",
    role: "",
    start: "",
    end: "",
  });

  // Chargement des programmes
  const fetchSchedules = async () => {
    try {
      const response = await axios.get("http://localhost:3000/respsionite/schedules");
      setSchedules(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des programmes:', error);
      handleSnackbar("Erreur lors du chargement des programmes", "error");
    }
  };

  useEffect(() => {
    fetchSchedules();
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

  // Formatage de la date et heure
  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Gestion de la modification
  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setEditForm({
      employee_name: schedule.employee_name,
      role: schedule.role,
      start: schedule.start.slice(0, 16), // Format YYYY-MM-DDThh:mm
      end: schedule.end.slice(0, 16),
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:3000/respsionite/modifierSchedule/${selectedSchedule.id}`,
        editForm
      );
      handleSnackbar("Programme modifié avec succès", "success");
      setEditDialogOpen(false);
      fetchSchedules();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      handleSnackbar("Erreur lors de la modification", "error");
    }
  };

  // Gestion de la suppression
  const handleDelete = (schedule) => {
    setSelectedSchedule(schedule);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.post(
        `http://localhost:3000/respsionite/supprimerSchedule/${selectedSchedule.id}`
      );
      handleSnackbar("Programme supprimé avec succès", "success");
      setDeleteDialogOpen(false);
      fetchSchedules();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      handleSnackbar("Erreur lors de la suppression", "error");
    }
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
          Programme des Employés
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#C4A998" }}>
                <TableCell sx={{ color: "white" }}>ID</TableCell>
                <TableCell sx={{ color: "white" }}>Employé</TableCell>
                <TableCell sx={{ color: "white" }}>Rôle</TableCell>
                <TableCell sx={{ color: "white" }}>Début</TableCell>
                <TableCell sx={{ color: "white" }}>Fin</TableCell>
                <TableCell sx={{ color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>{schedule.id}</TableCell>
                    <TableCell>{schedule.employee_name}</TableCell>
                    <TableCell>{schedule.role}</TableCell>
                    <TableCell>{formatDateTime(schedule.start)}</TableCell>
                    <TableCell>{formatDateTime(schedule.end)}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(schedule)}
                        sx={{ color: "#C4A998" }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(schedule)}
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
            count={schedules.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Lignes par page"
          />
        </TableContainer>

        {/* Dialog de modification */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Modifier le programme</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "grid", gap: 2, pt: 2, minWidth: "400px" }}>
              <TextField
                label="Nom de l'employé"
                value={editForm.employee_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, employee_name: e.target.value })
                }
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>Rôle</InputLabel>
                <Select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  label="Rôle"
                >
                  <MenuItem value="Réceptionniste">Réceptionniste</MenuItem>
                  <MenuItem value="Femme de chambre">Femme de chambre</MenuItem>
                  <MenuItem value="Agent de sécurité">Agent de sécurité</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Date et heure de début"
                type="datetime-local"
                value={editForm.start}
                onChange={(e) =>
                  setEditForm({ ...editForm, start: e.target.value })
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Date et heure de fin"
                type="datetime-local"
                value={editForm.end}
                onChange={(e) =>
                  setEditForm({ ...editForm, end: e.target.value })
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
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            Êtes-vous sûr de vouloir supprimer ce programme ?
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

export default ConsulterProgramme; 
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import axios from "axios";
import InfoIcon from "@mui/icons-material/Info";

function AjouterReservation() {
  const [formData, setFormData] = useState({
    id_persson: "",
    id_chambre: "",
    date_debut: "",
    date_fin: "",
    prix_total: 0,
  });

  const [selectedChambre, setSelectedChambre] = useState(null);
  const [clients, setClients] = useState([]);
  const [chambres, setChambres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Calcul du nombre de jours entre deux dates
  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calcul du prix total
  const calculateTotalPrice = (chambre, dateDebut, dateFin) => {
    if (!chambre || !dateDebut || !dateFin) return 0;
    const numberOfDays = calculateDays(dateDebut, dateFin);
    return numberOfDays * chambre.prix;
  };

  // Mise à jour du prix total quand les dates ou la chambre changent
  useEffect(() => {
    if (selectedChambre) {
      const newPrice = calculateTotalPrice(
        selectedChambre,
        formData.date_debut,
        formData.date_fin
      );
      setFormData((prev) => ({
        ...prev,
        prix_total: newPrice,
      }));
    }
  }, [selectedChambre, formData.date_debut, formData.date_fin]);

  // Fonction pour formater le prix en DZD
  const formatPrixDZD = (prix) => {
    return new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(prix);
  };

  // Chargement des chambres
  const fetchChambres = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/respsionite/chambresL"
      );
      // S'assurer que chambres est toujours un tableau
      const chambresData = response.data?.data || response.data || [];
      const chambresArray = Array.isArray(chambresData) ? chambresData : [];
      setChambres(chambresArray);
      console.log("Chambres chargées:", chambresArray); // Debug
    } catch (error) {
      console.error("Erreur chargement chambres:", error);
      handleSnackbar("Erreur lors du chargement des chambres", "error");
      setChambres([]);
    }
  };
  const fetchClients = async () => {
    try {
      const response = await axios.get("/clients");
      // S'assurer que clients est toujours un tableau
      const clientsData = response.data?.data || response.data || [];
      setClients(Array.isArray(clientsData) ? clientsData : []);
    } catch (error) {
      console.error("Erreur chargement clients:", error);
      handleSnackbar("Erreur lors du chargement des clients", "error");
      setClients([]); // Initialiser avec un tableau vide en cas d'erreur
    }
  };

  useEffect(() => {
    fetchClients();
    fetchChambres();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(`Changement de ${name} avec la valeur:`, value); // Debug

    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [name]: value,
      };

      // Mise à jour du prix total lors d'un changement de chambre ou de dates
      if (name === "id_chambre") {
        const chambre = chambres.find(
          (ch) => ch.id_ch === value || ch.id === value
        );
        console.log("Chambre trouvée:", chambre); // Debug
        setSelectedChambre(chambre);
        if (chambre) {
          const newPrice = calculateTotalPrice(
            chambre,
            newFormData.date_debut,
            newFormData.date_fin
          );
          return { ...newFormData, prix_total: newPrice };
        }
      } else if (name === "date_debut" || name === "date_fin") {
        if (selectedChambre) {
          const newPrice = calculateTotalPrice(
            selectedChambre,
            name === "date_debut" ? value : newFormData.date_debut,
            name === "date_fin" ? value : newFormData.date_fin
          );
          return { ...newFormData, prix_total: newPrice };
        }
      }

      return newFormData;
    });
  };

  const handleSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.id_persson ||
      !formData.id_chambre ||
      !formData.date_debut ||
      !formData.date_fin
    ) {
      handleSnackbar("Veuillez remplir tous les champs", "error");
      return;
    }

    if (new Date(formData.date_fin) < new Date(formData.date_debut)) {
      handleSnackbar(
        "La date de fin doit être postérieure à la date de début",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/respsionite/ajouterRservation",
        formData
      );
      if (response.data) {
        handleSnackbar("Réservation ajoutée avec succès", "success");
        setFormData({
          id_persson: "",
          id_chambre: "",
          date_debut: "",
          date_fin: "",
          prix_total: 0,
        });
      }
    } catch (error) {
      console.error("Erreur ajout réservation:", error);
      handleSnackbar("Erreur lors de l'ajout de la réservation", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Paper
        elevation={3}
        className="p-8 max-w-3xl mx-auto"
        sx={{ backgroundColor: "#f8f8f8" }}
      >
        <Box mb={4}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              color: "#2c3e50",
              fontWeight: "bold",
              borderBottom: "3px solid #C4A998",
              paddingBottom: "10px",
            }}
          >
            Nouvelle Réservation
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Box sx={{ display: "grid", gap: 3 }}>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}
            >
              <FormControl
                fullWidth
                sx={{ backgroundColor: "white", borderRadius: 1 }}
              >
                <InputLabel>Client</InputLabel>
                <Select
                  name="id_persson"
                  value={formData.id_persson}
                  onChange={handleChange}
                  label="Client"
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id_user} value={client.id_user}>
                      {client.id_user}-{client.name} {client.prenom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                sx={{ backgroundColor: "white", borderRadius: 1 }}
              >
                <InputLabel>Chambre</InputLabel>
                <Select
                  name="id_chambre"
                  value={formData.id_chambre}
                  onChange={handleChange}
                  label="Chambre"
                >
                  {chambres.map((chambre) => (
                    <MenuItem key={chambre.id_ch} value={chambre.id_ch}>
                      Chambre {chambre.id_ch} - {chambre.type} (
                      {formatPrixDZD(chambre.prix)}/nuit)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}
            >
              <TextField
                type="date"
                label="Date de début"
                name="date_debut"
                value={formData.date_debut}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{ backgroundColor: "white", borderRadius: 1 }}
                inputProps={{ min: new Date().toISOString().split("T")[0] }}
              />
              <TextField
                type="date"
                label="Date de fin"
                name="date_fin"
                value={formData.date_fin}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{ backgroundColor: "white", borderRadius: 1 }}
                inputProps={{
                  min:
                    formData.date_debut ||
                    new Date().toISOString().split("T")[0],
                }}
              />
            </Box>

            {/* Affichage des détails de la chambre sélectionnée */}
            {selectedChambre && (
              <Box
                sx={{
                  backgroundColor: "#fff",
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  mt: 2,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: "#2c3e50",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <InfoIcon color="primary" />
                  Détails de la chambre sélectionnée
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <Typography>
                    <strong>Numéro:</strong> {selectedChambre.id_ch}
                  </Typography>
                  <Typography>
                    <strong>Type:</strong> {selectedChambre.type}
                  </Typography>
                  <Typography>
                    <strong>Prix par nuit:</strong>{" "}
                    {formatPrixDZD(selectedChambre.prix)}
                  </Typography>
                  {selectedChambre.description && (
                    <Typography>
                      <strong>Description:</strong>{" "}
                      {selectedChambre.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            {/* Affichage du résumé avec calcul détaillé */}
            {selectedChambre && formData.date_debut && formData.date_fin && (
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: "#2c3e50" }}>
                  Résumé de la réservation
                </Typography>
                <Box sx={{ display: "grid", gap: 2 }}>
                  <Typography>
                    <strong>Durée du séjour:</strong>{" "}
                    {calculateDays(formData.date_debut, formData.date_fin)}{" "}
                    nuits
                  </Typography>
                  <Typography>
                    <strong>Prix par nuit:</strong>{" "}
                    {formatPrixDZD(selectedChambre.prix)}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="h6" sx={{ color: "#2c3e50" }}>
                    Prix total: {formatPrixDZD(formData.prix_total)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Calcul:{" "}
                    {calculateDays(formData.date_debut, formData.date_fin)}{" "}
                    nuits × {formatPrixDZD(selectedChambre.prix)}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                onClick={() =>
                  setFormData({
                    id_persson: "",
                    id_chambre: "",
                    date_debut: "",
                    date_fin: "",
                    prix_total: 0,
                  })
                }
                disabled={loading}
                sx={{
                  borderColor: "#C4A998",
                  color: "#C4A998",
                  "&:hover": {
                    borderColor: "#a88b7a",
                    backgroundColor: "rgba(196, 169, 152, 0.04)",
                  },
                }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: "#C4A998",
                  "&:hover": {
                    backgroundColor: "#a88b7a",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Confirmer la réservation"
                )}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AjouterReservation;

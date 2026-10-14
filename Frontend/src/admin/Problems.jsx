import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

function Problems() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;

  const problemTypes = [
    "Problème technique",
    "Problème de réservation",
    "Problème de facturation",
    "Autre",
  ];

  useEffect(() => {
    fetchProblems();
  }, [page]); // Refetch when page changes

  const fetchProblems = async () => {
    try {
      const response = await axios.get("/probleme");
      const allProblems = response.data;
      setTotalPages(Math.ceil(allProblems.length / itemsPerPage));
      setProblems(allProblems);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des problèmes:", error);
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return problems.slice(startIndex, endIndex);
  };

  const handleViewProblem = (problem) => {
    setSelectedProblem(problem);
    setOpenDialog(true);
  };

  const handleDeleteProblem = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce problème ?")) {
      try {
        await axios.delete(`/probleme/${id}`);
        setProblems(problems.filter((p) => p.id_problem !== id));
        // Update total pages after deletion
        setTotalPages(Math.ceil((problems.length - 1) / itemsPerPage));
        // If current page is empty after deletion, go to previous page
        if (getCurrentPageItems().length === 0 && page > 1) {
          setPage(page - 1);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProblem(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#C4A998]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestion des Problèmes
        </h1>
        <p className="text-gray-600">
          Liste des problèmes signalés par les utilisateurs
        </p>
      </div>

      <TableContainer component={Paper} className="shadow-lg">
        <Table>
          <TableHead>
            <TableRow className="bg-[#C4A998]">
              <TableCell className="text-white font-bold">Type</TableCell>
              <TableCell className="text-white font-bold">Objet</TableCell>
              <TableCell className="text-white font-bold">N° Utilisateur</TableCell>
              <TableCell className="text-white font-bold">Date</TableCell>
              <TableCell className="text-white font-bold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getCurrentPageItems().map((problem) => (
              <TableRow
                key={problem.id_problem}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>{problem.type_problem}</TableCell>
                <TableCell>{problem.obj}</TableCell>
                <TableCell>{problem.id_user}</TableCell>
                <TableCell>{problem.date.slice(0, 10)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleViewProblem(problem)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteProblem(problem.id_problem)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="mt-4 flex justify-center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#C4A998",
            },
            "& .Mui-selected": {
              backgroundColor: "#C4A998 !important",
              color: "white",
            },
          }}
        />
      </div>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedProblem && (
          <>
            <DialogTitle className="bg-[#C4A998] text-white">
              Détails du Problème
            </DialogTitle>
            <DialogContent className="mt-4">
              <div className="space-y-4">
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Type de problème
                  </Typography>
                  <Typography variant="body1">
                    {selectedProblem.type_problem}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Objet
                  </Typography>
                  <Typography variant="body1">{selectedProblem.obj}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Message
                  </Typography>
                  <Typography variant="body1">
                    {selectedProblem.message}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Client
                  </Typography>
                  <Typography variant="body1">
                    {selectedProblem.id_user}
                  </Typography>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseDialog}
                className="text-[#C4A998] hover:bg-[#C4A998] hover:text-white"
              >
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}

export default Problems;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    domaine: "",
    salary: "",
    status: "active",
    hire_date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/@manager/employees"
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setFormData({
      name: "",
      domaine: "",
      salary: "",
      status: "active",
      hire_date: new Date().toISOString().split("T")[0],
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      domaine: employee.domaine,
      salary: employee.salary,
      status: employee.status,
      hire_date: employee.hire_date,
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      try {
        await axios.delete(`http://localhost:3000/@manager/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && selectedEmployee) {
        await axios.put(`http://localhost:3000/@manager/update-salary`, {
          id: selectedEmployee.id,
          salary: formData.salary,
          status: formData.status,
        });
      } else {
        await axios.post("http://localhost:3000/@manager/employees", formData);
      }
      handleClose();
      fetchEmployees();
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Gestion des Employés
        </h2>
        <Button
          variant="contained"
          onClick={handleOpen}
          style={{ backgroundColor: "#C4A998" }}
        >
          Ajouter un employé
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#f5f1e8" }}>
              <TableCell>Nom</TableCell>
              <TableCell>Domaine</TableCell>
              <TableCell>Salaire</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date d'embauche</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.domaine}</TableCell>
                <TableCell>{employee.salary} DA</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      employee.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {employee.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(employee.hire_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(employee)}
                    style={{ color: "#C4A998" }}
                  >
                    Modifier
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(employee.id)}
                    color="error"
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ backgroundColor: "#f5f1e8", paddingTop: "20px" }}>
          {editMode ? "Modifier l'employé" : "Ajouter un employé"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <TextField
              fullWidth
              label="Nom"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={editMode}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Domaine"
              name="domaine"
              value={formData.domaine}
              onChange={handleChange}
              disabled={editMode}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Salaire"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              variant="outlined"
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="active">Actif</MenuItem>
                <MenuItem value="inactive">Inactif</MenuItem>
              </Select>
            </FormControl>
            {!editMode && (
              <TextField
                fullWidth
                label="Date d'embauche"
                name="hire_date"
                type="date"
                value={formData.hire_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            )}
          </form>
        </DialogContent>
        <DialogActions style={{ padding: "20px" }}>
          <Button onClick={handleClose} style={{ color: "#666" }}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            style={{ backgroundColor: "#C4A998" }}
          >
            {editMode ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Employees;

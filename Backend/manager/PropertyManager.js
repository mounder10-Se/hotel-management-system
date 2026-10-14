const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: "pms",
});

// Get all employees
router.get("/@manager/employees", (req, res) => {
    db.query("SELECT * FROM employees", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add new employee
router.post("/@manager/employees", (req, res) => {
    const { name, domaine, salary, status, hire_date } = req.body;

    console.log("Request body:", req.body);

    const sqlEmployee =
        "INSERT INTO employees (name, domaine, salary, status, hire_date) VALUES (?, ?, ?, ?, ?)";
    db.query(
        sqlEmployee, [name, domaine, salary, status, hire_date],
        (err, result) => {
            if (err) {
                console.error("Database insert error:", err);
                return res
                    .status(500)
                    .json({ error: "Database insert error (employees)" });
            }

            const employeeId = result.insertId;

            const currentMonth = new Date().toISOString().slice(0, 7);
            const sqlAppointage = `
            INSERT INTO appointage (employee_id, static_salary, total_days_worked, absent_days, month)
            VALUES (?, ?, ?, ?, ?)
        `;
            const appointageValues = [employeeId, salary, 0, 0, currentMonth];

            db.query(sqlAppointage, appointageValues, (err2, result2) => {
                if (err2) {
                    console.error("Error inserting into appointage:", err2);
                    return res
                        .status(500)
                        .json({ error: "Database insert error (appointage)" });
                }

                res.json({
                    message: "Employee and appointage added successfully",
                    employeeId,
                });
            });
        }
    );
});

// Delete employee by ID
router.delete("/@manager/employees/:id", (req, res) => {
    const sql = "DELETE FROM employees WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database delete error" });
        res.json({ message: "Employee deleted successfully" });
    });
});

// Update salary
router.put("/@manager/update-salary", (req, res) => {
    const { id, status, salary } = req.body;

    if (!id || !salary) {
        return res
            .status(400)
            .json({ Error: "Employee ID and new salary are required" });
    }

    const sql = "UPDATE employees SET salary = ?, status = ? WHERE id = ?";

    db.query(sql, [salary, status, id], (err, result) => {
        if (err) return res.status(500).json({ Error: "Database update error" });

        return res
            .status(200)
            .json({ Status: "Success", Message: "Salary updated successfully" });
    });
});

// Get all maintenance requests
router.get("/@manager/maintenance", (req, res) => {
    const sql = "SELECT * FROM maintenance";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// Create a new maintenance request
router.post("/@manager/maintenance", (req, res) => {
    const { property_id, description, requested_by, assigned_to, status } =
    req.body;
    const request_date = new Date();

    const sql =
        "INSERT INTO maintenance (property_id, description, requested_by, assigned_to, status, request_date) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
        property_id,
        description,
        requested_by,
        assigned_to,
        status,
        request_date,
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res
                .status(500)
                .json({ error: "Database insert error", details: err });
        }
        res.json({
            message: "Maintenance request added successfully",
            requestId: result.insertId,
        });
    });
});

// Update maintenance request
router.put("/@manager/maintenance/:id", (req, res) => {
    const { description, assigned_to, status } = req.body;
    const { id } = req.params;

    let sql;
    let params;

    if (status === "completed") {
        sql = `
            UPDATE maintenance 
            SET description = ?, assigned_to = ?, status = ?, completion_date = CURDATE()
            WHERE id = ?
        `;
        params = [description, assigned_to, status, id];
    } else {
        sql = `
            UPDATE maintenance 
            SET description = ?, assigned_to = ?, status = ?
            WHERE id = ?
        `;
        params = [description, assigned_to, status, id];
    }

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ error: "Database update error" });
        res.json({ message: "Maintenance request updated successfully" });
    });
});

// Delete maintenance request
router.delete("/@manager/maintenance/:id", (req, res) => {
    const sql = "DELETE FROM maintenance WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database delete error" });
        res.json({ message: "Maintenance request deleted successfully" });
    });
});

// Get appointage data
router.get("/@manager/appointage", async(req, res) => {
    const { month } = req.query;

    let sql = `
        SELECT a.id, e.id AS employee_id, e.name, e.salary AS static_salary, 
               a.absent_days, a.total_days_worked, a.month
        FROM appointage a
        JOIN employees e ON a.employee_id = e.id
    `;

    const values = [];

    if (month) {
        sql += " WHERE a.month = ?";
        values.push(month);
    }

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ Error: "Error fetching appointage data" });
        }
        res.json(result);
    });
});

// Get all schedules
router.get("/@manager/schedule", (req, res) => {
    const sql = "SELECT * FROM schedule";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(result);
    });
});

// Save a new schedule
router.post("/@manager/schedule", (req, res) => {
    const { employee_name, role, start, end } = req.body;

    const sql =
        "INSERT INTO schedule (employee_name, role, start, end) VALUES (?, ?, ?, ?)";
    const values = [employee_name, role, start, end];

    db.query(sql, values, (err) => {
        if (err)
            return res.status(500).json({ error: "Failed to insert schedule" });
        res.json({ message: "Schedule saved" });
    });
});

// Get distinct roles
router.get("/@manager/roles", (req, res) => {
    db.query("SELECT DISTINCT domaine FROM employees", (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to fetch roles" });
        const roles = results.map((r) => r.domaine);
        res.json(roles);
    });
});

// Get budget totals
router.get("/@manager/budget/totals", (req, res) => {
    const sql = `
        SELECT IFNULL(SUM(salary), 0) AS totalSalaries FROM employees
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching total salaries:", err);
            return res.status(500).json({ error: "Database error" });
        }

        db.query(
            "SELECT SUM(montant) as totalRevenues FROM paiment ",
            (errPament, resltPaiment) => {
                if (!errPament) {
                    const totalSalaries = results[0].totalSalaries;
                    const profit = 0 - totalSalaries;
                    console.log(resltPaiment[0].totalRevenues);
                    res.json({
                        totalSpent: 0,
                        totalSalaries,
                        totalRevenues: resltPaiment[0].totalRevenues,
                        profit,
                    });
                } else {
                    console.log(errPament.message);
                }
            }
        );
    });
});

module.exports = router;
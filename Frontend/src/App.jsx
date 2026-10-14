import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";

import ADashboardLayoutAccountSidebar from "./admin/dashbordAdmin";
import Users from "./admin/Gestion_Utilisateurs";
import Admin from "./admin/SideMenu_Admin";
import Test from "./Auth/SingIn";
import TableauDeBord from "./admin/TableauDeBord";
import ForgotPassword from "./Auth/ForgotPassword";
import VerifyCode from "./Auth/VerifyCode";
import ResetPassword from "./Auth/ResetPassword";
//propertyManager
import PropManager from "./manager/pages/PropManager";
import Overview from "./manager/components2/Overview";
import Budget from "./manager/components2/Budget";
import Schedule from "./manager/components2/Schedule";
import Salary from "./manager/components2/Salary";
import Maintenance from "./manager/components2/Maintenance";
import Appointage from "./manager/components2/Appointage";
import SideMenu_Manager from "./manager/pages/SideMenu_Manager";
import UpdateSalary from "./manager/pages/UpdateSalary";
import NewRequest from "./manager/pages/NewRequest";
import AddEmployee from "./manager/pages/AddEmployee";
import Employees from "./manager/components2/Employees";
//
import SideMenu_Resp, { Dashboard } from "./respsionite/pages/SideMenu_Resp";
import AjouterReservation from "./respsionite/pages/Fonctionemment/ajouterReservation";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/Admin" element={<ADashboardLayoutAccountSidebar />} />
          <Route path="/users" element={<Users />} />
          <Route path="/singIn" element={<Test />} />
          <Route path="/SideMenu" element={<Admin />} />
          <Route path="/tableau-de-bord" element={<TableauDeBord />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Redirect /SideMenu_Manager to /propmanager */}
          <Route
            path="/SideMenu_Manager"
            element={<Navigate to="/propmanager" replace />}
          />

          {/* Property Manager Routes */}
          <Route path="/propmanager" element={<SideMenu_Manager />}>
            <Route index element={<Overview />} />
            <Route path="employees" element={<Employees />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="budget" element={<Budget />} />
            <Route path="salary" element={<Salary />} />
            <Route path="appointage" element={<Appointage />} />
            <Route path="schedule" element={<Schedule />} />
          </Route>
          <Route
            path="/propmanager/update-salary/:id"
            element={<UpdateSalary />}
          />
          <Route path="/propmanager/new-request" element={<NewRequest />} />
          <Route path="/propmanager/add-employee" element={<AddEmployee />} />

          {/* Receptionist Routes */}
          <Route path="/reception" element={<SideMenu_Resp />}>
            <Route index element={<Dashboard />} />
            <Route path="overview" element={<Dashboard />} />
            <Route path="add-reservation" element={<AjouterReservation />} />
            <Route
              path="view-reservations"
              element={<div>Consulter les réservations</div>}
            />
            <Route
              path="employee-schedule"
              element={<div>Programme des employés</div>}
            />
          </Route>

          <Route path="*" element={<Navigate to="/singIn" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

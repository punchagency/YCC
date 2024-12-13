import "./App.css";
import { Route, Routes } from "react-router-dom";
import GetStarted from "./pages/auth/get-started"; // Adjust the import according to your file structure
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import ForgotPassword from "./pages/auth/forgot-password";
import Dashboard from "./pages/dashboard";
import Role from "./pages/user-management/role";
import Users from "./pages/user-management/users";
import UserDetails from "./pages/user-management/users-details";
import AddUser from "./pages/user-management/add-users";
import Vessels from "./pages/vessel-management/vessels";
import AddVessel from "./pages/vessel-management/add-vessels";
import Documents from "./pages/document-management/documents";
import Maintenance from "./pages/maintenance-scheduling/maintenance";
import AddMaintenance from "./pages/maintenance-scheduling/add-maintenance";
import MaintenanceDetails from "./pages/maintenance-scheduling/maintenance-details";
import Editmaintenance from "./pages/maintenance-scheduling/edit-maintenance";
import Equipment from "./pages/maintenance-scheduling/equipment";
import EquipmentDetails from "./pages/maintenance-scheduling/equipment-details";
import Addequipment from "./pages/maintenance-scheduling/add-equipment";
import EditEquipment from "./pages/maintenance-scheduling/edit-equipment";
import AddDocument from "./pages/document-management/add-document";
import DocumentDetails from "./pages/document-management/document-details";
import EditDocument from "./pages/document-management/edit-document";
import Warranty from "./pages/maintenance-scheduling/warranty";
import AddWarranty from "./pages/maintenance-scheduling/add-warranty";
import WarrantyDetails from "./pages/maintenance-scheduling/warranty-details";
import Expense from "./pages/finance-management/expense";
import AddExpense from "./pages/finance-management/add-expense";
import ExpenseDetails from "./pages/finance-management/expense-details";
import Invoice from "./pages/finance-management/invoice";
import AddInvoice from "./pages/finance-management/add-invoice";
import InvoiceDetails from "./pages/finance-management/invoice-details";
import Compliance from "./pages/compliance-management/compliance";
import AddCompliance from "./pages/compliance-management/add-compliance";
import ComplianceDetails from "./pages/compliance-management/compliance-details";
import AddRole from "./pages/user-management/add-role";
import VesselDetails from "./pages/vessel-management/vessel-details";
import Reports from "./pages/reports/reports";
import ReportDetails from "./pages/reports/report-details";
import Notifications from "./pages/notification/notifications";
import DashboardCrew from "./pages/crew/dashboard";
import ScheduleCalendar from "./pages/maintenance-scheduling/schedule-calendar ";
import RoleDetails from './pages/user-management/role-details';
import Settings from './pages/Settings';
import MyTask from './pages/crew/maintenanace-task/mytask';
import CrewTaskDetails from './pages/crew/maintenanace-task/task-details';
import CrewTaskEdit from './pages/crew/maintenanace-task/task-edit';
import MaintenanceHistory from './pages/crew/maintenanace-task/maintenance-history';
import MaintenanceHistoryDetails from './pages/crew/maintenanace-task/history-details';
import Document from "./pages/crew/document-access/document";
import CrewDocumentDetails from "./pages/crew/document-access/document-details";
import CrewSetting from "./pages/crew/settings/crewsetting";
import Layout from "./layout/layout";
import EditInvoice from "./pages/finance-management/edit-invoice";
import EditExpense from "./pages/finance-management/edit-expense";
import CrewHistoryEdit from "./pages/crew/maintenanace-task/history-edit";
import EditCompliance from "./pages/compliance-management/edit-compliance";
import EditVassel from "./pages/vessel-management/edit-vessel";
import EditWarranty from "./pages/maintenance-scheduling/edit-warranty";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route element={<Layout role="Captain/Manager" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-management/role" element={<Role />} />
          <Route path="/user-management/users" element={<Users />} />
          <Route path="/user-management/users/new" element={<AddUser />} />
          <Route path="/vessel-management/vessels" element={<Vessels />} />
          <Route
            path="/vessel-management/vessels/new"
            element={<AddVessel />}
          />
          <Route
            path="/vessel-management/vessels/:id"
            element={<VesselDetails />}
          />
           <Route
            path="/vessel-management/vessels/edit"
            element={<EditVassel />}
          />

          <Route path="/document-management">
            <Route path="documents" element={<Documents />} />
            <Route path="documents/new" element={<AddDocument />} />
            <Route path="documents/:id" element={<DocumentDetails />} />
            <Route path="documents/edit" element={<EditDocument />} />
          </Route>

          <Route path="/warranty-management/warranty" element={<Warranty />} />

          <Route path="/maintenance-scheduling">
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="maintenance/:id" element={<MaintenanceDetails />} />
            <Route path="maintenance/edit" element={<Editmaintenance />} />
            <Route path="equipment" element={<Equipment />} />
            <Route path="equipment/:id" element={<EquipmentDetails />} />
            <Route path="equipment/new" element={<Addequipment />} />
            <Route path="equipment/edit" element={<EditEquipment />} />
            <Route path="warranty" element={<Warranty />} />
            <Route path="warranty/new" element={<AddWarranty />} />
            <Route path="warranty/:id" element={<WarrantyDetails />} />
            <Route path="warranty/edit" element={<EditWarranty />} />
            <Route path="schedule-calendar" element={<ScheduleCalendar />} />
          </Route>

          <Route path="/finance-management">
            <Route path="expense" element={<Expense />} />
            <Route path="expense/new" element={<AddExpense />} />
            <Route path="expense/:id" element={<ExpenseDetails />} />
            <Route path="expense/edit" element={<EditExpense />} />
            <Route path="invoice" element={<Invoice />} />
            <Route path="invoice/new" element={<AddInvoice />} />
            <Route path="invoice/:id" element={<InvoiceDetails />} />
            <Route path="invoice/edit" element={<EditInvoice />} />
          </Route>
          <Route path="/compliance-management">
            <Route path="compliance" element={<Compliance />} />
            <Route path="compliance/new" element={<AddCompliance />} />
            <Route path="compliance/:id" element={<ComplianceDetails />} />
            <Route path="compliance/edit" element={<EditCompliance />} />
          </Route>

          <Route
            path="/maintenance-scheduling/maintenance/new"
            element={<AddMaintenance />}
          />
          {/* Dynamic Route for User Details */}
          <Route path="/user-management/users/:id" element={<UserDetails />} />
          <Route path="/user-management/users/edit/:id" element={<AddUser />} />
          <Route path="/user-management/role/new" element={<AddRole />} />
          <Route path="/user-management/role/:id" element={<RoleDetails />} />


          {/* Report Route */}
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:reportType" element={<ReportDetails />} />
          {/* Notification Route */}
          <Route path="/notifications" element={<Notifications role={"Captain/Manager"}/>} />
          <Route path="/settings" element={<Settings />} />  

        </Route>

        <Route element={<Layout role="Crew Member" />}>
        <Route path="/crew/dashboard" element={<DashboardCrew />} />
        <Route path="/crew/maintenance-task/mytask" element={<MyTask />} /> 
        <Route path="/crew/maintenance-task/mytask/:id" element={<CrewTaskDetails />} /> 
        <Route path="/crew/maintenance-task/mytask/edit" element={<CrewTaskEdit />} /> 
        <Route path="/crew/maintenance-task/history" element={<MaintenanceHistory />} /> 
        <Route path="/crew/maintenance-task/history/edit" element={<CrewHistoryEdit />} /> 
        <Route path="/crew/maintenance-task/history/:id" element={<MaintenanceHistoryDetails />} />
        <Route path="/crew/maintenance-task/document" element={<Document />} /> 
        <Route path="/crew/maintenance-task/document/:id" element={<CrewDocumentDetails />} /> 
        <Route path="/crew/notifications" element={<Notifications />} />
        <Route path="/crew/settings" element={<CrewSetting />} />
        

        </Route>
      </Routes>
    </div>
  );
}

export default App;

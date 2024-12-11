import './App.css'
import { Route, Routes } from 'react-router-dom';
import GetStarted from './pages/auth/get-started'; // Adjust the import according to your file structure
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import ForgotPassword from './pages/auth/forgot-password';
import Dashboard from './pages/dashboard';
import Role from './pages/user-management/role';
import Users from './pages/user-management/users';
import UserDetails from './pages/user-management/users-details';
import AddUser from './pages/user-management/add-users';
import Vessels from './pages/vessel-management/vessels';
import AddVessel from './pages/vessel-management/add-vessels';
import Documents from './pages/document-management/documents';
import Maintenance from './pages/maintenance-scheduling/maintenance';
import AddMaintenance from './pages/maintenance-scheduling/add-maintenance';
import MaintenanceDetails from './pages/maintenance-scheduling/maintenance-details';
import Editmaintenance from './pages/maintenance-scheduling/edit-maintenance';
import Equipment from './pages/maintenance-scheduling/equipment';
import EquipmentDetails from './pages/maintenance-scheduling/equipment-details';
import Addequipment from './pages/maintenance-scheduling/add-equipment';
import EditEquipment from './pages/maintenance-scheduling/edit-equipment';
import AddDocument from './pages/document-management/add-document';
import DocumentDetails from './pages/document-management/document-details';
import EditDocument from './pages/document-management/edit-document';
import Warranty from './pages/maintenance-scheduling/warranty';
import AddWarranty from './pages/maintenance-scheduling/add-warranty';
import WarrantyDetails from './pages/maintenance-scheduling/warranty-details';
import Expense from './pages/finance-management/expense';
import AddExpense from './pages/finance-management/add-expense';
import ExpenseDetails from './pages/finance-management/expense-details';
import Invoice from './pages/finance-management/invoice';
import AddInvoice from './pages/finance-management/add-invoice';
import InvoiceDetails from './pages/finance-management/invoice-details';
import Compliance from './pages/compliance-management/compliance';
import AddCompliance from './pages/compliance-management/add-compliance';
import ComplianceDetails from './pages/compliance-management/compliance-details';
import AddRole from './pages/user-management/add-role';
import VesselDetails from './pages/vessel-management/vessel-details';
import Reports from './pages/reports/reports';
import ReportDetails from './pages/reports/report-details';
import Notifications from './pages/notification/notifications';
import DashboardCrew from './pages/crew/dashboard';



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-management/role" element={<Role />} />
        <Route path="/user-management/users" element={<Users />} />
        <Route path="/user-management/users/new" element={<AddUser />} />
        <Route path="/vessel-management/vessels" element={<Vessels />} />
        <Route path="/vessel-management/vessels/new" element={<AddVessel />} />
        <Route
          path="/vessel-management/vessels/:id"
          element={<VesselDetails />}
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
        </Route>

        <Route path="/finance-management">
          <Route path="expense" element={<Expense />} />
          <Route path="expense/new" element={<AddExpense />} />
          <Route path="expense/:id" element={<ExpenseDetails />} />
          <Route path="invoice" element={<Invoice />} />
          <Route path="invoice/new" element={<AddInvoice />} />
          <Route path="invoice/:id" element={<InvoiceDetails />} />
        </Route>
        <Route path="/compliance-management">
          <Route path="compliance" element={<Compliance />} />
          <Route path="compliance/new" element={<AddCompliance />} />
          <Route path="compliance/:id" element={<ComplianceDetails />} />
        </Route>

        <Route
          path="/maintenance-scheduling/maintenance/new"
          element={<AddMaintenance />}
        />
        {/* Dynamic Route for User Details */}
        <Route path="/user-management/users/:id" element={<UserDetails />} />
        <Route path="/user-management/users/edit/:id" element={<AddUser />} />
        <Route path="/user-management/role/new" element={<AddRole />} />

        {/* Report Route */}
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/:reportType" element={<ReportDetails />} />
        {/* Notification Route */}
        <Route path="/notifications" element={<Notifications />} />

        <Route path="/crew/dashboard" element={<DashboardCrew />} />  
      </Routes>
    </div>
  );
}

export default App;

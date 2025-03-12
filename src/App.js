import "./App.css";
import { Route, Routes } from "react-router-dom";
import GetStarted from "./pages/auth/get-started"; // Adjust the import according to your file structure
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";

// new import
import CrewSignup from "./pages/auth/crew.signup";
import VendorSignup from "./pages/auth/vendor.signup";
import SupplierSignup from "./pages/auth/supplier.signup";
import Invent from "./pages/invent/invent"
import Order from "./pages/order/order";
import Reports from "./pages/report/report";
// end of new import 


import ForgotPassword from "./pages/auth/forgot-password";
import Dashboard from "./pages/dashboard";
import Role from "./pages/crew-management/role";
import Users from "./pages/crew-management/users";
import UserDetails from "./pages/crew-management/users-details";
import AddUser from "./pages/crew-management/add-users";
import Vessels from "./pages/vessel-management/vessels";
import AddVessel from "./pages/vessel-management/add-vessels";
import VesselScheduleCalendar from "./pages/vessel-management/schedule-calendar ";
import CrewScheduleCalendar from "./pages/crew/maintenanace-task/schedule-calendar ";
import Documents from "./pages/compliance-management/document-management/documents";
import Maintenance from "./pages/maintenance-scheduling/maintenance";
import AddMaintenance from "./pages/maintenance-scheduling/add-maintenance";
import MaintenanceDetails from "./pages/maintenance-scheduling/maintenance-details";
import Editmaintenance from "./pages/maintenance-scheduling/edit-maintenance";
import Equipment from "./pages/maintenance-scheduling/equipment";
import EquipmentDetails from "./pages/maintenance-scheduling/equipment-details";
import Addequipment from "./pages/maintenance-scheduling/add-equipment";
import EditEquipment from "./pages/maintenance-scheduling/edit-equipment";
import AddDocument from "./pages/compliance-management/document-management/add-document";
import DocumentDetails from "./pages/compliance-management/document-management/document-details";
import EditDocument from "./pages/compliance-management/document-management/edit-document";
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
import AddRole from "./pages/crew-management/add-role";
import VesselDetails from "./pages/vessel-management/vessel-details";
// import Reports from "./pages/reports/reports";
// import ReportDetails from "./pages/reports/report-details";
import Notifications from "./pages/notification/notifications";
import DashboardCrew from "./pages/crew/dashboard";
import ScheduleCalendar from "./pages/maintenance-scheduling/schedule-calendar ";
import RoleDetails from './pages/crew-management/role-details';
import Settings from './pages/Settings';
import MyTask from './pages/crew/maintenanace-task/mytask';
import CrewTaskDetails from './pages/crew/maintenanace-task/task-details';
import CrewTaskEdit from './pages/crew/maintenanace-task/task-edit';
import MaintenanceHistory from './pages/crew/maintenanace-task/maintenance-history';
import MaintenanceHistoryDetails from './pages/crew/maintenanace-task/history-details';
import Document from "./pages/crew/document-access/document";
import CrewDocumentDetails from "./pages/crew/document-access/document-details";
import CrewSetting from "./pages/crew/settings/crewsetting";
import Inventory from "./pages/inventory/inventory";
import Layout from "./layout/layout";
import EditInvoice from "./pages/finance-management/edit-invoice";
import EditExpense from "./pages/finance-management/edit-expense";
import CrewHistoryEdit from "./pages/crew/maintenanace-task/history-edit";
import EditCompliance from "./pages/compliance-management/edit-compliance";
import ComingSoon from "./pages/coming-soon";
import EditUser from "./pages/crew-management/edit-user";
import EditVessel from "./pages/vessel-management/edit-vessels";
import EditWarranty from "./pages/maintenance-scheduling/edit-warranty";
import CrewAddDocument from "./pages/crew/document-access/add-document";
import HomeLandingPage from "./pages/landing-pages/home";
import LandingPageLayout from "./layout/landing-page-layout";
import CaptainLandingPage from "./pages/landing-pages/captain";
import CrewLandingPage from "./pages/landing-pages/crew";
import ExteriorLandingPage from "./pages/landing-pages/exterior";
import InteriorLandingPage from "./pages/landing-pages/interior";
import ChefGalleryLandingPage from "./pages/landing-pages/chef-gallery";
import EngineeringLandingPage from "./pages/landing-pages/engineering";
import VendorAndServices from "./pages/landing-pages/vendor-services";
import AboutUs from "./pages/landing-pages/about-us";
import ResourceCenter from "./pages/landing-pages/resource-center";
import ContactUs from "./pages/landing-pages/contact-us";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* new route start */}

        <Route path="/crew/signup" element={<CrewSignup />} />
        <Route path="/vendor/signup" element={<VendorSignup />} />
        <Route path="/supplier/signup" element={<SupplierSignup />} />
      

        {/* end of route */}

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/coming-soon" element={<ComingSoon />} />

        {/* Landing Page Routes */}
        <Route element={<LandingPageLayout />}>
          <Route path="/" element={<HomeLandingPage />} />
          <Route path="/captain" element={<CaptainLandingPage />} />
          <Route path="/crew" element={<CrewLandingPage />} />
          <Route path="/exterior" element={<ExteriorLandingPage />} />
          <Route path="/interior" element={<InteriorLandingPage />} />
          <Route path="/chef-gallery" element={<ChefGalleryLandingPage />} />
          <Route path="/engineering" element={<EngineeringLandingPage />} />
          <Route path="/vendor-services" element={<VendorAndServices />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/resource-center" element={<ResourceCenter />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Route>

        <Route element={
          <ProtectedRoute>
            <Layout role="Captain" />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crew-management/role" element={<Role />} />
          <Route path="/crew-management/crews" element={<Users />} />
          <Route path="/crew-management/crews/new" element={<AddUser />} />
          <Route path="/crew-management/crews/edit" element={<EditUser />} />
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
            element={<EditVessel />}
          />
          <Route
            path="/vessel-management/schedule-calendar"
            element={<VesselScheduleCalendar />}
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
          <Route path="/crew-management/crews/:id" element={<UserDetails />} />
          <Route path="/crew-management/crews/edit/:id" element={<AddUser />} />
          <Route path="/crew-management/role/new" element={<AddRole />} />
          <Route path="/crew-management/role/:id" element={<RoleDetails />} />

          {/* Report Route */}
          {/* <Route path="/crew/reports" element={<Reports />} /> */}
          {/* <Route path="/reports/:reportType" element={<ReportDetails />} /> */}
          {/* Notification Route */}
          <Route
            path="/notifications"
            element={<Notifications role={"Captain"} />}
          />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route element={
          <ProtectedRoute>
            <Layout role="Crew Member" />
          </ProtectedRoute>
        }>
          <Route path="/crew/dashboard" element={<DashboardCrew />} />
          <Route path="/crew/maintenance-task/mytask" element={<MyTask />} />
          <Route
            path="/crew/maintenance-task/mytask/:id"
            element={<CrewTaskDetails />}
          />
          <Route
            path="/crew/maintenance-task/mytask/edit"
            element={<CrewTaskEdit />}
          />
          <Route
            path="/crew/maintenance-task/history"
            element={<MaintenanceHistory />}
          />
          <Route
            path="/crew/maintenance-task/history/edit"
            element={<CrewHistoryEdit />}
          />
          <Route
            path="/crew/maintenance-task/history/:id"
            element={<MaintenanceHistoryDetails />}
          />
          <Route
            path="/crew/maintenance-task/schedule-calendar"
            element={<CrewScheduleCalendar />}
          />
          <Route path="/crew/task-schedule/document" element={<Document />} />
          <Route
            path="/crew/task-schedule/document/:id"
            element={<CrewDocumentDetails />}
          />
          <Route
            path="/crew/task-schedule/document/new"
            element={<CrewAddDocument />}
          />
          <Route path="/crew/notifications" element={<Notifications />} />
          <Route path="/crew/settings" element={<CrewSetting />} />
          <Route path="/crew/inventory/dashboard" element={<Inventory />} />
          <Route path="/crew/orders" element={<Order />} />
          <Route path="/crew/inventory/inventory" element={<Invent />} />
          <Route path="/crew/reports" element={<Reports />} />
         
        </Route>
      </Routes>
    </div>
  );
}

export default App;

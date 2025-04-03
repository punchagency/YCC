import "./App.css";
import { Route, Routes } from "react-router-dom";
import GetStarted from "./pages/auth/get-started"; // Adjust the import according to your file structure
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";

// new import
import CrewSignup from "./pages/auth/crew.signup";
import VendorSignup from "./pages/auth/vendor.signup";
import SupplierSignup from "./pages/auth/supplier.signup";
import Invent from "./pages/invent/invent";
import Order from "./pages/order/order";
import Reports from "./pages/report/report";
import Bookings from "./pages/bookings/bookings";
import VendorStarted from "./pages/auth/vendors-started";
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
import RoleDetails from "./pages/crew-management/role-details";
import Settings from "./pages/Settings";
import MyTask from "./pages/crew/maintenanace-task/mytask";
import CrewTaskDetails from "./pages/crew/maintenanace-task/task-details";
import CrewTaskEdit from "./pages/crew/maintenanace-task/task-edit";
import MaintenanceHistory from "./pages/crew/maintenanace-task/maintenance-history";
import MaintenanceHistoryDetails from "./pages/crew/maintenanace-task/history-details";
import Document from "./pages/crew/document-access/document";
import CrewDocumentDetails from "./pages/crew/document-access/document-details";
import CrewSetting from "./pages/crew/settings/crewsetting";
import Inventory from "./pages/inventory/inventory";
import AdminLayout from "./layout/layout";
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
import Calendar from "./pages/calendar/calendar";
import { NotificationsProvider } from "./context/notificationsContext";
import { ToastProvider } from "./components/Toast";
import AdminFinancialManagement from "./pages/dashboard/admin/financial-management/admin-financial-management";
import AdminDashboard1 from "./pages/dashboard/admin/dashboard";
//context imports

function App() {
  return (
    <ToastProvider>
      <NotificationsProvider>
        <Routes>
          <Route path="/get-started" element={<GetStarted />} /> 
          <Route path="/apply" element={<VendorStarted />} />

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

            <Route path="/chef-galley" element={<ChefGalleryLandingPage />} />

            <Route path="/engineering" element={<EngineeringLandingPage />} />
            <Route path="/vendor-services" element={<VendorAndServices />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/resource-center" element={<ResourceCenter />} />
            <Route path="/contact-us" element={<ContactUs />} />
          </Route>


          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard1 />} />
            <Route path="/admin/bookings-management" element={<Bookings />} />
            <Route path="/admin/orders-management" element={<Order />} />
            <Route path="/admin/inventory-management" element={<Invent />} />
            <Route path="/admin/financial-management" element={<AdminFinancialManagement />} />
            <Route path="/admin/calendar-management" element={<Calendar />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/settings" element={<CrewSetting />} />
            {/* Add other admin routes here look at the setup of the above admin dashboard route */}


          </Route>
        </Routes>
      </NotificationsProvider>
    </ToastProvider>
  );
}

export default App;

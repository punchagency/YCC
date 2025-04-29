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
// import Reports from "./pages/reports/reports";
// import ReportDetails from "./pages/reports/report-details";
import Notifications from "./pages/notification/notifications";

import CrewSetting from "./pages/crew/settings/crewsetting";

import AdminLayout from "./layout/layout";

import ComingSoon from "./pages/coming-soon";

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

import Calendar from "./pages/calendar/calendar";
import { NotificationsProvider } from "./context/notificationsContext";
import { ToastProvider } from "./components/Toast";
import AdminFinancialManagement from "./pages/dashboard/admin/financial-management/admin-financial-management";
import AdminDashboard1 from "./pages/dashboard/admin/dashboard";
import Profile from "./pages/profile/profile";
import SupplierOnboarding from "./pages/onboarding/supplier-onboarding";
import OnboardingPageLayout from "./layout/onboarding-page-layout";
import SupplierOnboardingStep2 from "./components/onboarding/supplier/supplier-onboarding-step2";
import VendorOnboarding from "./pages/onboarding/vendor-onboarding";
import VendorOnboardingStep2 from "./components/onboarding/vendor/vendor-onboarding-step2";
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
            <Route path="/admin/profile" element={<Profile />} />
            <Route path="/admin/dashboard" element={<AdminDashboard1 />} />
            <Route path="/admin/bookings-management" element={<Bookings />} />
            <Route path="/admin/orders-management" element={<Order />} />
            <Route path="/admin/inventory-management" element={<Invent />} />
            <Route path="/admin/inventory-management/:inventoryId" element={<Invent />} />
            <Route
              path="/admin/financial-management"
              element={<AdminFinancialManagement />}
            />
            <Route path="/admin/calendar-management" element={<Calendar />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/settings" element={<CrewSetting />} />
          </Route>

          {/* Onboarding Routes */}
          <Route element={<OnboardingPageLayout />}>
            <Route path="/supplier-vendor/onboarding" element={<SupplierOnboarding />} />
            <Route path="/supplier-vendor/onboarding/refresh-stripe-account" element={<SupplierOnboardingStep2 />} />
            <Route path="/service-provider/onboarding" element={<VendorOnboarding />} />
            <Route path="/service-provider/onboarding/refresh-stripe-account" element={<VendorOnboardingStep2 />} />
          </Route>


        </Routes>
      </NotificationsProvider>
    </ToastProvider>
  );
}

export default App;

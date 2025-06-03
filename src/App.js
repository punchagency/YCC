import "./App.css";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
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
import CrewDashboard from "./pages/dashboard/crew/dashboard";
import CrewCalendar from "./pages/crew/calendar/calendar";
import ProtectedRoute from "./components/ProtectedRoute";
import CrewFinancialManagement from "./pages/crew/financial-management/financial-management";
import Inventory from "./pages/crew/inventory/inventory";
import CrewOrder from "./pages/crew/order/order";
import CrewNotification from "./pages/crew/notification/notification";
import CrewSettings from "./pages/crew/crewSettings/crewsettings";
import CrewReports from "./pages/crew/report-screen/report";
import CrewBooking from "./pages/crew/booking/booking";
import CrewLegal from "./pages/crew/legal/legal";
import CrewTraining from "./pages/crew/training/training";
import CrewAccomodation from "./pages/crew/accomodation/accomo";
import CrewDocument from "./pages/crew/document/document";
import BookingDetails from "./pages/crew/booking/details";
import { UserProvider } from "./context/userContext";
import RespondToQuote from "./pages/quote-related-pages/service-providers/respondToQuoteRequest";
import QuoteDetails from "./pages/quote-related-pages/customers/QuoteDetails";
import QuotePayment from "./pages/quote-related-pages/customers/QuotePayment";

// Add AuthCheck component
const AuthCheck = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // List of public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/captain",
    "/crew",
    "/exterior",
    "/interior",
    "/chef-galley",
    "/engineering",
    "/vendor-services",
    "/about-us",
    "/resource-center",
    "/contact-us",
    "/get-started",
    "/apply",
    "/login",
    "/signup",
    "/crew/signup",
    "/service/signup",
    "/vendor/signup",
    "/forgot-password",
    "/coming-soon",
    "/service/quotes/respond",
    "/supplier/onboarding/:id",
    "/supplier/onboarding/refresh-stripe-account",
    "/vendor/onboarding/:id",
    "/vendor/onboarding/refresh-stripe-account",
  ];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(
    (route) =>
      location.pathname === route || location.pathname.startsWith(route + "/")
  );

  // If no token and not on a public route, redirect to home
  if (!token && !isPublicRoute) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <UserProvider>
      <ToastProvider>
        <NotificationsProvider>
          <AuthCheck>
            <Routes>
              {/* Landing Page Routes - Public Access */}
              <Route element={<LandingPageLayout />}>
                <Route path="/" element={<HomeLandingPage />} />
                <Route path="/captain" element={<CaptainLandingPage />} />
                <Route path="/crew" element={<CrewLandingPage />} />
                <Route path="/exterior" element={<ExteriorLandingPage />} />
                <Route path="/interior" element={<InteriorLandingPage />} />
                <Route
                  path="/chef-galley"
                  element={<ChefGalleryLandingPage />}
                />
                <Route
                  path="/engineering"
                  element={<EngineeringLandingPage />}
                />
                <Route
                  path="/vendor-services"
                  element={<VendorAndServices />}
                />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/resource-center" element={<ResourceCenter />} />
                <Route path="/contact-us" element={<ContactUs />} />
              </Route>

              {/* Auth Routes - Public Access */}
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/apply" element={<VendorStarted />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/crew/signup" element={<CrewSignup />} />
              <Route path="/service/signup" element={<VendorSignup />} />
              <Route path="/vendor/signup" element={<SupplierSignup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route
                path="/service/quotes/respond/:quoteId"
                element={<RespondToQuote />}
              />

              {/* Protected Routes - Require Authentication */}
              {/* Admin Routes */}
              <Route element={<AdminLayout />}>
                <Route path="/admin/profile" element={<Profile />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requiredRoles={["admin"]}>
                      <AdminDashboard1 />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/bookings-management"
                  element={<Bookings />}
                />
                <Route path="/admin/orders-management" element={<Order />} />
                <Route
                  path="/admin/inventory-management"
                  element={<Invent />}
                />
                <Route
                  path="/admin/inventory-management/:inventoryId"
                  element={<Invent />}
                />
                <Route
                  path="/admin/financial-management"
                  element={<AdminFinancialManagement />}
                />
                <Route
                  path="/admin/calendar-management"
                  element={<Calendar />}
                />
                <Route
                  path="/admin/notifications"
                  element={<Notifications />}
                />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/settings" element={<CrewSetting />} />
              </Route>

              {/* Crew Routes */}
              <Route element={<AdminLayout />}>
                <Route
                  path="/crew/dashboard"
                  element={
                    <ProtectedRoute requiredRoles={["crew_member"]}>
                      <CrewDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crew/calendar"
                  element={
                    <ProtectedRoute requiredRoles={["crew_member"]}>
                      <CrewCalendar />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crew/financial-management"
                  element={
                    <ProtectedRoute requiredRoles={["crew_member"]}>
                      <CrewFinancialManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crew/inventory-management"
                  element={
                    <ProtectedRoute requiredRoles={["crew_member"]}>
                      <Inventory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crew/orders-management"
                  element={
                    <ProtectedRoute requiredRoles={["crew_member"]}>
                      <CrewOrder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crew/notifications"
                  element={
                    <ProtectedRoute requiredRoles={["crew_member"]}>
                      <CrewNotification />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crew/settings"
                  element={
                    <ProtectedRoute requiredRoles={["crew_member"]}>
                      <CrewSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crew/reports"
                  element={
                    <ProtectedRoute requiredRoles={["crew_member"]}>
                      <CrewReports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crew/booking/*"
                  element={
                    <ProtectedRoute requiredRoles={["crew_member"]}>
                      <CrewBooking />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/crew/legal-resources"
                  element={
                    <ProtectedRoute requiredRoles={["crew_member"]}>
                      <CrewLegal />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crew/training"
                  element={
                    <ProtectedRoute requiredRoles={["crew_member"]}>
                      <CrewTraining />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crew/accomodation"
                  element={
                    <ProtectedRoute requiredRoles={["crew_member"]}>
                      <CrewAccomodation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crew/document-management"
                  element={
                    <ProtectedRoute requiredRoles={["crew_member"]}>
                      <CrewDocument />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crew/quotes/:quoteId"
                  element={<QuoteDetails />}
                />
                <Route
                  path="/crew/quotes/:quoteId/payment"
                  element={<QuotePayment />}
                />
              </Route>

            {/* Onboarding Routes */}
            <Route element={<OnboardingPageLayout />}>
              {/* <Route
                path="/supplier/onboarding/:id"
                element={<SupplierOnboarding />}
              />
              <Route
                path="/supplier/onboarding/refresh-stripe-account"
                element={<SupplierOnboardingStep2 />}
              />
              <Route path="/vendor/onboarding/:id" element={<VendorOnboarding />} />
              <Route
                path="/vendor/onboarding/refresh-stripe-account"
                element={<VendorOnboardingStep2 />}
              /> */}
              <Route path="/crew/settings" element={<CrewSettings />} />
            </Route>
            <Route
              path="/supplier/onboarding/:id"
              element={<SupplierOnboarding />}
            />
            <Route
              path="/supplier/onboarding/refresh-stripe-account"
              element={<SupplierOnboardingStep2 />}
            />
            <Route path="/vendor/onboarding/:id" element={<VendorOnboarding />} />
            <Route
              path="/vendor/onboarding/refresh-stripe-account"
              element={<VendorOnboardingStep2 />}
            />
          </Routes>
          </AuthCheck>
        </NotificationsProvider>
      </ToastProvider>
    </UserProvider>
  );
}

export default App;

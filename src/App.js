import "./App.css";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import SentryErrorBoundary from "./components/SentryErrorBoundary";
import { SentryRouteTracker } from "./components/sentry/SentryRouterIntegration";
import GetStarted from "./pages/auth/get-started"; // Adjust the import according to your file structure
import Login from "./pages/auth/login";
import Signup from "./pages/auth/crew.signup";

// new import
import CrewSignup from "./pages/auth/crew.signup";
import VendorSignup from "./pages/auth/vendor.signup";
import SupplierSignup from "./pages/auth/supplier.signup";
import Invent from "./pages/invent/invent";
import Order from "./pages/order/order";
import Reports from "./pages/report/";
import Bookings from "./pages/bookings/bookings";
import AdminBookingDetails from "./pages/bookings/adminBookingDetails";
import VendorStarted from "./pages/auth/vendors-started";
// end of new import

import ForgotPassword from "./pages/auth/forgot-password";
import VerifyOtp from "./pages/auth/verify-otp";
import ResetPassword from "./pages/auth/reset-password";
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
import PrivacyPolicy from "./pages/privacy-policy/privacy-policy";
import TermsAndConditions from "./pages/terms-and-conditions/terms-and-conditions";

import Calendar from "./pages/calendar/calendar";
import { NotificationsProvider } from "./context/notificationsContext";
import { ToastProvider } from "./components/Toast";
import AdminFinancialManagement from "./pages/dashboard/admin/financial-management/admin-financial-management";
import AdminDashboard1 from "./pages/dashboard/admin/dashboard";
import Profile from "./pages/profile/profile";
import SupplierOnboarding from "./pages/onboarding/supplier-onboarding";
// import OnboardingPageLayout from "./layout/onboarding-page-layout";
import SupplierOnboardingStep2 from "./components/onboarding/supplier/supplier-onboarding-step2";
import VendorOnboarding from "./pages/onboarding/vendor-onboarding";
import VendorOnboardingStep2 from "./components/onboarding/vendor/vendor-onboarding-step2";
import CrewDashboard from "./pages/dashboard/crew/dashboard";
import SupplierDashboard from "./pages/dashboard/supplier/dashboard";
import SupplierSettings from "./pages/supplier/settings";
import SupplierProfile from "./pages/supplier/profile";
import CrewCalendar from "./pages/crew/calendar/calendar";
import ProtectedRoute from "./components/ProtectedRoute";
import CrewFinancialManagement from "./pages/crew/financial-management/financial-management";
import Inventory from "./pages/crew/inventory/inventory";
import CrewOrder from "./pages/crew/order/order";
import CrewNotification from "./pages/crew/notification/notification";
import CrewSettings from "./pages/crew/crewSettings/crewsettings";
import CrewReports from "./pages/crew/report-screen/report";
import CrewBooking from "./pages/crew/booking/booking";
import CrewCompletedBookingDetails from "./pages/crew/booking/completed-booking-details";
import CrewLegal from "./pages/crew/legal/legal";
import CrewTraining from "./pages/crew/training/training";
import CrewAccomodation from "./pages/crew/accomodation/accomo";
import CrewDocument from "./pages/crew/document/document";
// import BookingDetails from "./pages/crew/booking/details";
import { UserProvider } from "./context/userContext";
import RespondToQuote from "./pages/quote-related-pages/service-providers/respondToQuoteRequest";
import QuoteDetails from "./pages/quote-related-pages/customers/QuoteDetails";
import QuotePayment from "./pages/quote-related-pages/customers/QuotePayment";
import ApprovePage from "./pages/dashboard/admin/approvalPage.js/approve";
import { AuthProvider } from "./context/authContext";
import TestApi from "./components/TestApi";
// import { DashboardAIProvider } from "./context/AIAssistant/dashboardAIContext";
import OrderDetails from "./pages/crew/order/details";
import DocumentList from "./pages/crew/document/documentlist";
import DocumentView from "./pages/crew/document/documentview";
import CartPage from "./pages/crew/cart";
import { CartProvider } from "./context/cart/cartContext";
import EditInventory from "./pages/invent/edit-inventory";
import SupplierOrderConfirmationPage from "./pages/supplier/SupplierOrderConfirmationPage";
import SupplierOrder from "./pages/supplier/order";
import SupplierOrderDetails from "./pages/supplier/OrderDetails";
import SupplierTransaction from "./pages/supplier/transaction";
import AdminOrderDetails from "./pages/order/adminOrderDetails";
import AdminDashboard from "./pages/adminDashboard";
import SelectBookingService from "./pages/crew/booking/SelectBookingService";

// Service Providers
import ServiceProviderDashboard from "./pages/service-providers/dashboard/service-provider-dashboard.js";
import ServiceProviderSettings from "./pages/service-providers/settings/service-provider-settings.js";
import ServiceProvidersBookings from "./pages/service-providers/bookings/service-providers-bookings.js";
import ServiceProvidersBookingDetails from "./pages/service-providers/bookings/booking-details.js";
import ServiceProvidersCalendar from "./pages/service-providers/calendar/service-providers-calendar.js";
import ServiceProvidersServiceManagement from "./pages/service-providers/services-management/service-providers-services-management.js";
import ServiceProvidersTransactions from "./pages/service-providers/transactions/service-providers-transaction.js";
import ServiceProviderBookingsConfirmationPage from "./pages/service-providers/bookings/service-provider-bookings-confirmation-page.js";

// Add AuthCheck component
const AuthCheck = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

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
    "/vendors/onboarding",
    "/vendors/onboarding/refresh-stripe-account",
    "/services/onboarding",
    "/services/onboarding/refresh-stripe-account",
    "/reset-password",
    "/supplier/orders/confirm/:subOrderId/:token",
    "/privacy-policy",
    "/terms-and-conditions",
  ];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => {
    // Convert route pattern to regex if it contains parameters
    const routePattern = route.replace(/:[^/]+/g, "[^/]+");
    const regex = new RegExp(`^${routePattern}$`);
    const matches =
      regex.test(location.pathname) ||
      location.pathname.startsWith(route + "/");

    return matches;
  });

  if (!token && !isPublicRoute) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const theme = createTheme({
    typography: {
      fontFamily:
        "Plus Jakarta Sans, Inter, Roboto, system-ui, -apple-system, Segoe UI, Arial, sans-serif",
    },
    components: {
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            h4: 'h3',
            h5: 'h3',
            h6: 'h3',
            subtitle1: 'h4',
            subtitle2: 'h5',
            body1: 'p',
            body2: 'p',
          },
        },
      },
    },
  });
  return (
    <AuthProvider>
      <UserProvider>
        <ToastProvider>
          <NotificationsProvider>
            <CartProvider>
              <MuiThemeProvider theme={theme}>
                <SentryErrorBoundary>
                  <SentryRouteTracker />
                  <AuthCheck>
                    <Routes>
                    {/* Landing Page Routes - Public Access */}
                    <Route element={<LandingPageLayout />}>
                      <Route path="/" element={<HomeLandingPage />} />
                      <Route path="/captain" element={<CaptainLandingPage />} />
                      <Route path="/crew" element={<CrewLandingPage />} />
                      <Route
                        path="/exterior"
                        element={<ExteriorLandingPage />}
                      />
                      <Route
                        path="/interior"
                        element={<InteriorLandingPage />}
                      />
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
                      <Route
                        path="/resource-center"
                        element={<ResourceCenter />}
                      />
                      <Route
                        path="/resource-center/test"
                        element={<TestApi />}
                      />
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
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/coming-soon" element={<ComingSoon />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route
                      path="/terms-and-conditions"
                      element={<TermsAndConditions />}
                    />
                    <Route
                      path="/service/quotes/respond/:quoteId"
                      element={<RespondToQuote />}
                    />
                    <Route
                      path="/supplier/orders/confirm/:subOrderId/:token"
                      element={<SupplierOrderConfirmationPage />}
                    />
                    <Route
                      path="/service-provider/bookings/confirm/:token"
                      element={<ServiceProviderBookingsConfirmationPage />}
                    />

                    {/* Protected Routes - Require Authentication */}
                    {/* Admin Routes */}
                    <Route element={<AdminLayout />}>
                      <Route path="/admin/profile" element={<Profile />} />
                      <Route
                        path="/admin/dashboard"
                        element={
                          <ProtectedRoute requiredRoles={["admin"]}>
                            {/* <AdminDashboard1 /> */}
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/bookings-management"
                        element={<Bookings />}
                      />
                      <Route
                        path="/admin/bookings-management/:id"
                        element={<AdminBookingDetails />}
                      />
                      <Route
                        path="/admin/orders-management"
                        element={<Order />}
                      />
                      <Route
                        path="/admin/orders-management/:id"
                        element={<AdminOrderDetails />}
                      />
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
                      <Route path="/admin/approve" element={<ApprovePage />} />
                    </Route>
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
                      <Route
                        path="/admin/bookings-management/:id"
                        element={<AdminBookingDetails />}
                      />
                      <Route
                        path="/admin/orders-management"
                        element={<Order />}
                      />
                      <Route
                        path="/admin/inventory-management"
                        element={<Invent />}
                      />
                      <Route
                        path="/admin/inventory-management/:inventoryId"
                        element={<Invent />}
                      />
                      <Route
                        path="/admin/inventory-management/edit/:id"
                        element={<EditInventory />}
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
                      <Route path="/admin/approve" element={<ApprovePage />} />
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
                        path="/crew/profile"
                        element={
                          <ProtectedRoute requiredRoles={["crew_member"]}>
                            <Profile />
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
                        path="/crew/orders-management/:id"
                        element={
                          <ProtectedRoute requiredRoles={["crew_member"]}>
                            <OrderDetails />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/crew/cart"
                        element={
                          <ProtectedRoute requiredRoles={["crew_member"]}>
                            <CartPage />
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
                        path="/crew/booking/select-service"
                        element={
                          <ProtectedRoute requiredRoles={["crew_member"]}>
                            <SelectBookingService />
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
                        path="/crew/bookings/completed/details"
                        element={
                          <ProtectedRoute requiredRoles={["crew_member"]}>
                            <CrewCompletedBookingDetails />
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
                      <Route
                        path="/crew/document-management/list"
                        element={
                          <ProtectedRoute requiredRoles={["crew_member"]}>
                            <DocumentList />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/crew/document/view/:documentId"
                        element={
                          <ProtectedRoute requiredRoles={["crew_member"]}>
                            <DocumentView />
                          </ProtectedRoute>
                        }
                      />
                    </Route>

                    {/* Supplier Routes */}
                    <Route element={<AdminLayout />}>
                      <Route
                        path="/supplier/dashboard"
                        element={
                          <ProtectedRoute requiredRoles={["supplier"]}>
                            <SupplierDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/supplier/inventory"
                        element={
                          <ProtectedRoute requiredRoles={["supplier"]}>
                            <Invent />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/supplier/inventory/:inventoryId"
                        element={
                          <ProtectedRoute requiredRoles={["supplier"]}>
                            <Invent />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/supplier/settings"
                        element={
                          <ProtectedRoute requiredRoles={["supplier"]}>
                            <SupplierSettings />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/supplier/profile"
                        element={
                          <ProtectedRoute requiredRoles={["supplier"]}>
                            <SupplierProfile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/supplier/notifications"
                        element={
                          <ProtectedRoute requiredRoles={["supplier"]}>
                            <Notifications />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/supplier/orders"
                        element={
                          <ProtectedRoute requiredRoles={["supplier"]}>
                            <SupplierOrder />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/supplier/orders-details"
                        element={
                          <ProtectedRoute requiredRoles={["supplier"]}>
                            <SupplierOrderDetails />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/supplier/transactions"
                        element={
                          <ProtectedRoute requiredRoles={["supplier"]}>
                            <SupplierTransaction />
                          </ProtectedRoute>
                        }
                      />
                    </Route>

                    {/* Service Provider's Routes */}
                    <Route element={<AdminLayout />}>
                      <Route
                        path="/service-provider/dashboard"
                        element={
                          <ProtectedRoute requiredRoles={["service_provider"]}>
                            <ServiceProviderDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/service-provider/settings"
                        element={
                          <ProtectedRoute requiredRoles={["service_provider"]}>
                            <ServiceProviderSettings />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/service-provider/bookings"
                        element={
                          <ProtectedRoute requiredRoles={["service_provider"]}>
                            <ServiceProvidersBookings />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/service-provider/calendar"
                        element={
                          <ProtectedRoute requiredRoles={["service_provider"]}>
                            <ServiceProvidersCalendar />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/service-providers/bookings/details"
                        element={
                          <ProtectedRoute requiredRoles={["service_provider"]}>
                            <ServiceProvidersBookingDetails />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/service-provider/transactions"
                        element={
                          <ProtectedRoute requiredRoles={["service_provider"]}>
                            <ServiceProvidersTransactions />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/service-provider/notifications"
                        element={
                          <ProtectedRoute requiredRoles={["service_provider"]}>
                            <Notifications />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/service-provider/services"
                        element={
                          <ProtectedRoute requiredRoles={["service_provider"]}>
                            <ServiceProvidersServiceManagement />
                          </ProtectedRoute>
                        }
                      />
                    </Route>

                    <Route path="/crew/settings" element={<CrewSettings />} />

                    <Route
                      path="/vendors/onboarding/:id"
                      element={<SupplierOnboarding />}
                    />
                    <Route
                      path="/vendors/onboarding/refresh-stripe-account"
                      element={<SupplierOnboardingStep2 />}
                    />
                    <Route
                      path="/services/onboarding/:id"
                      element={<VendorOnboarding />}
                    />
                    <Route
                      path="/services/onboarding/refresh-stripe-account"
                      element={<VendorOnboardingStep2 />}
                    />
                    <Route path="/verify-otp" element={<VerifyOtp />} />
                    </Routes>
                  </AuthCheck>
                </SentryErrorBoundary>
              </MuiThemeProvider>
            </CartProvider>
          </NotificationsProvider>
        </ToastProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;

import "./App.css";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import SentryErrorBoundary from "./components/SentryErrorBoundary";
import { SentryRouteTracker } from "./components/sentry/SentryRouterIntegration";
import { Loading } from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";
import { NotificationsProvider } from "./context/notificationsContext";
import { ToastProvider } from "./components/Toast";
import { UserProvider } from "./context/userContext";
import { AuthProvider } from "./context/authContext";
import { CartProvider } from "./context/cart/cartContext";

// Lazy load auth pages
const GetStarted = lazy(() => import("./pages/auth/get-started"));
const Login = lazy(() => import("./pages/auth/login"));
const Signup = lazy(() => import("./pages/auth/crew.signup"));

// Lazy load auth pages (continued)
const CrewSignup = lazy(() => import("./pages/auth/crew.signup"));
const VendorSignup = lazy(() => import("./pages/auth/vendor.signup"));
const SupplierSignup = lazy(() => import("./pages/auth/supplier.signup"));
const VendorStarted = lazy(() => import("./pages/auth/vendors-started"));
const ForgotPassword = lazy(() => import("./pages/auth/forgot-password"));
const VerifyOtp = lazy(() => import("./pages/auth/verify-otp"));
const ResetPassword = lazy(() => import("./pages/auth/reset-password"));

// Lazy load admin pages
const Invent = lazy(() => import("./pages/invent/invent"));
const Order = lazy(() => import("./pages/order/order"));
const Reports = lazy(() => import("./pages/report/"));
const Bookings = lazy(() => import("./pages/bookings/bookings"));
const AdminBookingDetails = lazy(() => import("./pages/bookings/adminBookingDetails"));
const Notifications = lazy(() => import("./pages/notification/notifications"));
const CrewSetting = lazy(() => import("./pages/crew/settings/crewsetting"));

// Lazy load layouts and common pages
const AdminLayout = lazy(() => import("./layout/layout"));
const LandingPageLayout = lazy(() => import("./layout/landing-page-layout"));
const ComingSoon = lazy(() => import("./pages/coming-soon"));

// Lazy load landing pages
const HomeLandingPage = lazy(() => import("./pages/landing-pages/home"));
const CaptainLandingPage = lazy(() => import("./pages/landing-pages/captain"));
const CrewLandingPage = lazy(() => import("./pages/landing-pages/crew"));
const ExteriorLandingPage = lazy(() => import("./pages/landing-pages/exterior"));
const InteriorLandingPage = lazy(() => import("./pages/landing-pages/interior"));
const ChefGalleryLandingPage = lazy(() => import("./pages/landing-pages/chef-gallery"));
const EngineeringLandingPage = lazy(() => import("./pages/landing-pages/engineering"));
const VendorAndServices = lazy(() => import("./pages/landing-pages/vendor-services"));
const AboutUs = lazy(() => import("./pages/landing-pages/about-us"));
const ResourceCenter = lazy(() => import("./pages/landing-pages/resource-center"));
const ContactUs = lazy(() => import("./pages/landing-pages/contact-us"));
const PrivacyPolicy = lazy(() => import("./pages/privacy-policy/privacy-policy"));
const TermsAndConditions = lazy(() => import("./pages/terms-and-conditions/terms-and-conditions"));


// Lazy load dashboard and profile pages
const Calendar = lazy(() => import("./pages/calendar/calendar"));
const AdminFinancialManagement = lazy(() => import("./pages/dashboard/admin/financial-management/admin-financial-management"));
const AdminDashboard1 = lazy(() => import("./pages/dashboard/admin/dashboard"));
const Profile = lazy(() => import("./pages/profile/profile"));

// Lazy load onboarding pages
const SupplierOnboarding = lazy(() => import("./pages/onboarding/supplier-onboarding"));
const SupplierOnboardingStep2 = lazy(() => import("./components/onboarding/supplier/supplier-onboarding-step2"));
const ImportProducts = lazy(() => import("./pages/supplier/ImportProducts"));
const VendorOnboarding = lazy(() => import("./pages/onboarding/vendor-onboarding"));
const VendorOnboardingStep2 = lazy(() => import("./components/onboarding/vendor/vendor-onboarding-step2"));
const ImportServices = lazy(() => import("./pages/service-providers/importcsv/ImportServices"));

// Lazy load dashboard pages
const CrewDashboard = lazy(() => import("./pages/dashboard/crew/dashboard"));
const SupplierDashboard = lazy(() => import("./pages/dashboard/supplier/dashboard"));
const SupplierSettings = lazy(() => import("./pages/supplier/settings"));
const SupplierProfile = lazy(() => import("./pages/supplier/profile"));

// Lazy load crew pages
const CrewCalendar = lazy(() => import("./pages/crew/calendar/calendar"));
const CrewFinancialManagement = lazy(() => import("./pages/crew/financial-management/financial-management"));
const Inventory = lazy(() => import("./pages/crew/inventory/inventory"));
const CrewOrder = lazy(() => import("./pages/crew/order/order"));
const CrewNotification = lazy(() => import("./pages/crew/notification/notification"));
const CrewSettings = lazy(() => import("./pages/crew/crewSettings/crewsettings"));
const CrewReports = lazy(() => import("./pages/crew/report-screen/report"));
const CrewBooking = lazy(() => import("./pages/crew/booking/booking"));
const CrewCompletedBookingDetails = lazy(() => import("./pages/crew/booking/completed-booking-details"));
const CrewLegal = lazy(() => import("./pages/crew/legal/legal"));
const CrewTraining = lazy(() => import("./pages/crew/training/training"));
const CrewAccomodation = lazy(() => import("./pages/crew/accomodation/accomo"));
const CrewDocument = lazy(() => import("./pages/crew/document/document"));

// Lazy load quote and order related pages
const RespondToQuote = lazy(() => import("./pages/quote-related-pages/service-providers/respondToQuoteRequest"));
const QuoteDetails = lazy(() => import("./pages/quote-related-pages/customers/QuoteDetails"));
const QuotePayment = lazy(() => import("./pages/quote-related-pages/customers/QuotePayment"));
const ApprovePage = lazy(() => import("./pages/dashboard/admin/approvalPage.js/approve"));
const TestApi = lazy(() => import("./components/TestApi"));
const OrderDetails = lazy(() => import("./pages/crew/order/details"));
const DocumentList = lazy(() => import("./pages/crew/document/documentlist"));
const DocumentView = lazy(() => import("./pages/crew/document/documentview"));
const CartPage = lazy(() => import("./pages/crew/cart"));
// Lazy load supplier and inventory pages
const EditInventory = lazy(() => import("./pages/invent/edit-inventory"));
const SupplierOrderConfirmationPage = lazy(() => import("./pages/supplier/SupplierOrderConfirmationPage"));
const SupplierOrder = lazy(() => import("./pages/supplier/order"));
const SupplierOrderDetails = lazy(() => import("./pages/supplier/OrderDetails"));
const SupplierTransaction = lazy(() => import("./pages/supplier/transaction"));
const AdminOrderDetails = lazy(() => import("./pages/order/adminOrderDetails"));
const AdminDashboard = lazy(() => import("./pages/adminDashboard"));
const SelectBookingService = lazy(() => import("./pages/crew/booking/SelectBookingService"));

// Lazy load Service Provider pages
const ServiceProviderDashboard = lazy(() => import("./pages/service-providers/dashboard/service-provider-dashboard.js"));
const ServiceProviderSettings = lazy(() => import("./pages/service-providers/settings/service-provider-settings.js"));
const ServiceProvidersBookings = lazy(() => import("./pages/service-providers/bookings/service-providers-bookings.js"));
const ServiceProvidersBookingDetails = lazy(() => import("./pages/service-providers/bookings/booking-details.js"));
const ServiceProvidersCalendar = lazy(() => import("./pages/service-providers/calendar/service-providers-calendar.js"));
const ServiceProvidersServiceManagement = lazy(() => import("./pages/service-providers/services-management/service-providers-services-management.js"));
const ServiceProvidersTransactions = lazy(() => import("./pages/service-providers/transactions/service-providers-transaction.js"));
const ServiceProviderBookingsConfirmationPage = lazy(() => import("./pages/service-providers/bookings/service-provider-bookings-confirmation-page.js"));

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
    return <Navigate to="/login" replace />;
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
                    <Suspense fallback={<Loading />}>
                      <Routes>
                    {/* Landing Page Routes - Public Access */}
                    <Route element={
                      <Suspense fallback={<Loading />}>
                        <LandingPageLayout />
                      </Suspense>
                    }>
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
                    <Route element={
                      <Suspense fallback={<Loading />}>
                        <AdminLayout />
                      </Suspense>
                    }>
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
                    {/* Admin Routes - Duplicate section */}
                    <Route element={
                      <Suspense fallback={<Loading />}>
                        <AdminLayout />
                      </Suspense>
                    }>
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
                    <Route element={
                      <Suspense fallback={<Loading />}>
                        <AdminLayout />
                      </Suspense>
                    }>
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
                    <Route element={
                      <Suspense fallback={<Loading />}>
                        <AdminLayout />
                      </Suspense>
                    }>
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
                      <Route
                      path="/supplier/products/onboarding/:id"
                      element={
                        <ProtectedRoute requiredRoles={["supplier"]}>
                            <ImportProducts />
                          </ProtectedRoute>
                      }
                    />
                    </Route>

                    {/* Service Provider's Routes */}
                    <Route element={
                      <Suspense fallback={<Loading />}>
                        <AdminLayout />
                      </Suspense>
                    }>
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
                      <Route
                      path="/service-provider/services/onboarding/:id"
                      element={
                        <ProtectedRoute requiredRoles={["service_provider"]}>
                            <ImportServices />
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
                    </Suspense>
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

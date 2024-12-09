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
import Reports from './pages/reports/reports';
import ReportDetails from './pages/reports/report-details';

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
          {/* Dynamic Route for User Details */}
          <Route path="/user-management/users/:id" element={<UserDetails />} />
          <Route path="/user-management/users/edit/:id" element={<AddUser />} />
          {/* Report Route */}
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:reportType" element={<ReportDetails />} />
      </Routes>
    </div>
  );
}

export default App;



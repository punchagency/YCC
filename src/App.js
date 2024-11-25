import './App.css'
import { Route, Routes } from 'react-router-dom';
import GetStarted from './pages/auth/get-started'; // Adjust the import according to your file structure
import CaptainLogin from './pages/auth/captain-login';
import HodLogin from './pages/auth/hod-login';
import CrewLogin from './pages/auth/crew-login';
import CaptainSignup from './pages/auth/captain-signup';
import CaptainForgotPassword from './pages/auth/captain-forgot-password';

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<GetStarted />} />
          <Route path="/captain-login" element={<CaptainLogin />} />
          <Route path="/hod-login" element={<HodLogin />} />
          <Route path="/crew-login" element={<CrewLogin />} />
          <Route path="/captain-signup" element={<CaptainSignup />} />
          <Route path="/captain-forgot-password" element={<CaptainForgotPassword />} />
      </Routes>
    </div>
  );
}

export default App;

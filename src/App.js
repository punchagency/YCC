import './App.css'
import { Route, Routes } from 'react-router-dom';
import GetStarted from './pages/auth/get-started'; // Adjust the import according to your file structure
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import ForgotPassword from './pages/auth/forgot-password';

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<GetStarted />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
}

export default App;

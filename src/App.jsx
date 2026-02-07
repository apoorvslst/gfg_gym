import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GymExercises from './pages/GymExercises';

import Physio from './pages/Physio';

import PoseTracker from './components/PoseTracker';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="exercises" element={<GymExercises />} />
            <Route path="physio" element={<Physio />} />
            <Route path="tracker" element={<PoseTracker />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

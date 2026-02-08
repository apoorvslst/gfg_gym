import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GymExercises from './pages/GymExercises';

import Physio from './pages/Physio';
import DietPlan from './pages/DietPlan';

import PoseTracker from './components/PoseTracker';
import PoseEstimation from './pages/PoseEstimation';

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
            <Route path="diet-plan" element={<DietPlan />} />
            <Route path="tracker" element={<PoseTracker />} />
            <Route path="pose-estimation/:exerciseName" element={<PoseEstimation />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

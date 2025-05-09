import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/auth/Auth';
import Profile from './components/profile/Profile';
import Dashboard from './components/dashboard/Dashboard';
import { ToastProvider } from './components/common/Toast';
import LearningPlan from './components/learningPlan/LearningPlan';
import AddLearningPlan from './components/learningPlan/AddLearningPlan';
import UpdateLearningPlan from './components/learningPlan/UpdateLearningPlan';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} /> {/* Current user profile */}
          <Route path="/profile/:userId" element={<Profile />} /> {/* Add this route for viewing other users */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/LearningPlan" element={<LearningPlan />} />
          <Route path="/new" element={<AddLearningPlan />} />
          <Route path="/edit/:id" element={<UpdateLearningPlan />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;

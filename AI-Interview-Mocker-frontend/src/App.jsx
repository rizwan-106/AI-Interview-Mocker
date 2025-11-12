
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Home from "./components/pages/Home";

import InterviewSetupPage from "./components/InterviewSetupPage";
import InterviewInstructios from "./components/InterviewInstructios";
import InterviewActivePage from "./components/InterviewActivePage";
import InterviewEnd from "./components/InterviewEnd";
import InterviewDashboard from "./components/InterviewDashboard";
import InterviewFeedback from "./components/InterviewFeedback";
import PublicRoute from "./utils/PublicRoute";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Public Routes */}
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <InterviewSetupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview/:id"
          element={
            <ProtectedRoute>
              <InterviewInstructios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview/:id/init"
          element={
            <ProtectedRoute>
              <InterviewActivePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview/:id/end"
          element={
            <ProtectedRoute>
              <InterviewEnd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <InterviewDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/:interviewId"
          element={
            <ProtectedRoute>
              <InterviewFeedback />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}


export default App

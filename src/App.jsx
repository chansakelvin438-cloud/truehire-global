import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Jobs from "./pages/Jobs"
import JobDetails from "./pages/JobDetails"
import Apply from "./pages/Apply"
import Employers from "./pages/Employers"
import PostJob from "./pages/PostJob"
import Safety from "./pages/Safety"
import About from "./pages/About"
import Contact from "./pages/Contact"
import SignIn from "./pages/SignIn"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import EmployerDashboard from "./pages/EmployerDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import EmployerVerification from "./pages/EmployerVerification"
import JobSeekerProfile from "./pages/JobSeekerProfile"
import JobAlerts from "./pages/JobAlerts"
import Privacy from "./pages/Privacy"
import Terms from "./pages/Terms"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Pricing from "./pages/Pricing"
import AuthSessionTimeout from "./components/AuthSessionTimeout"
import PaymentPolicy from "./pages/PaymentPolicy"

function App() {
  return (
    <BrowserRouter>
      <AuthSessionTimeout />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route
          path="/jobs/:id/apply"
          element={
            <ProtectedRoute allowedRole="jobseeker">
              <Apply />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-alerts"
          element={
            <ProtectedRoute allowedRole="jobseeker">
              <JobAlerts />
            </ProtectedRoute>
          }
        />

        <Route path="/employers" element={<Employers />} />
        <Route
            path="/employer-verification"
            element={
              <ProtectedRoute allowedRole="employer">
                <EmployerVerification />
              </ProtectedRoute>
            }
        />

        <Route
          path="/employers/post-job"
          element={
            <ProtectedRoute allowedRole="employer">
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="jobseeker">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRole="jobseeker">
              <JobSeekerProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer-dashboard"
          element={
            <ProtectedRoute allowedRole="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/payment-policy" element={<PaymentPolicy />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
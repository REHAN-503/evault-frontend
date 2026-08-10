import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import LawyerDashboard from './pages/LawyerDashboard';
import JudgeDashboard from './pages/JudgeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuditPage from './pages/AuditPage';
import DocumentDetail from './pages/DocumentDetail';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route path="/lawyer" element={<ProtectedRoute role="lawyer"><LawyerDashboard /></ProtectedRoute>} />
          <Route path="/lawyer/audit" element={<ProtectedRoute role="lawyer"><AuditPage role="lawyer" /></ProtectedRoute>} />

          <Route path="/judge" element={<ProtectedRoute role="judge"><JudgeDashboard /></ProtectedRoute>} />
          <Route path="/judge/audit" element={<ProtectedRoute role="judge"><AuditPage role="judge" /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/audit" element={<ProtectedRoute role="admin"><AuditPage role="admin" /></ProtectedRoute>} />

          <Route path="/documents/:docId" element={<ProtectedRoute><DocumentDetail /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import GalleryPage from "./pages/GalleryPage";
import ComponentDetailPage from "./pages/ComponentDetailPage";
import ComponentPage from "./pages/Components";
import RequestPage from "./pages/Request";
import FeedbackPage from "./pages/Feedback";
import LoginPage from "./pages/Login";
import MainLayout from "./layout/mainLayout";
import AdminPanel from "./pages/AdminPanel";
import RegisterPage from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="components" element={<ComponentPage />} />
          <Route path="components/:id" element={<ComponentDetailPage />} />
          <Route path="request" element={<ProtectedRoute><RequestPage /></ProtectedRoute>} />
          <Route path="feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/signup" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App; 
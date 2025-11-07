import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPages/LoginPage";
import DropListPage from "./pages/DropListPages/DropListPage";
import DropDetailPage from "./pages/DropDetailPages/DropDetailPage";
import AdminPanel from "./pages/AdminPanelPages/AdminPanel";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/drops" element={<DropListPage />} />
        <Route path="/drops/:id" element={<DropDetailPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import UploadPage from "./pages/UploadPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import ReportDetailPage from "./pages/ReportDetailPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Footer from "./components/Footer";
import CreditsPage from "./pages/CreditsPage.jsx";
import GlossaryPage from "./pages/GlossaryPage.jsx";

export default function App() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[var(--bg)] text-[var(--text)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 420px at 8% -5%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 65%), radial-gradient(780px 360px at 95% -10%, color-mix(in srgb, var(--accent-hover) 18%, transparent), transparent 60%)",
        }}
      />

      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/:id" element={<ReportDetailPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
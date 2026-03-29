import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRouter from "./router.jsx";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import AIChatWidget from "./components/AIChatWidget";

export default function App() {
  const location = useLocation();

  // Show footer on Home and About pages, hide on admin/login pages.
  const showFooter =
    (location.pathname === "/" || location.pathname === "/about") &&
    !location.pathname.includes("/login") &&
    !location.pathname.includes("/admin");
  const showAIChat =
    !location.pathname.includes("/admin") && !location.pathname.includes("/login");

  return (
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-1 pt-[72px]">
        <AppRouter />
        <WhatsAppFloat />
        {showAIChat && <AIChatWidget />}
      </main>

      {showFooter && <Footer />}

    </div>
  );
}

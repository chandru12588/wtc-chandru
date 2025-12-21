import Navbar from "./components/Navbar";
import AppRouter from "./router.jsx";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />   {/* ✅ ONLY HERE */}
      <main className="flex-1 pt-20">
        <AppRouter />
        <WhatsAppFloat />
      </main>
      <Footer />
    </div>
  );
}

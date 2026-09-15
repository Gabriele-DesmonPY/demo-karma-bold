import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import HomeHeader from "./components/HomeHeader";
import HomeFooter from "./components/HomeFooter";
import Preloader from "./components/Preloader";
import PageTransition from "./components/PageTransition";
import MouseSpotlight from "./components/MouseSpotlight";
import FilmGrain from "./components/FilmGrain";
import Home from "./pages/Home";
import Approccio from "./pages/Approccio";
import Legalens from "./pages/Legalens";
import Contatti from "./pages/Contatti";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) { el.scrollIntoView({ block: "start" }); return; }
        window.scrollTo(0, 0);
      });
      return () => cancelAnimationFrame(raf);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

// App root — wraps the whole SPA with global ambiance layers
export default function App() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <>
      <Preloader />
      <FilmGrain />
      <ScrollToTop />
      {/* HomeHeader rimosso: duplicava la Nav sovrapponendoci brand e CTA
          "CONOSCIAMOCI" sopra il bottone INIZIAMO. La Nav copre tutte le
          rotte, home inclusa. */}
      <Nav />
      <main>
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/approccio" element={<Approccio />} />
            <Route path="/legalens" element={<Legalens />} />
            <Route path="/contatti" element={<Contatti />} />
          </Routes>
        </PageTransition>
      </main>
      <MouseSpotlight />
      {isHome ? <HomeFooter /> : <Footer />}
    </>
  );
}

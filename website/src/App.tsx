import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import Tutorials from "./pages/Tutorials.tsx";

function App() {
  return (
    <div className={"global-container"}>
      <HashRouter>
        <header>
          <Navbar />
        </header>
        <div className={"global-body"}>
          <Routes>
            <Route path="*" element={<Home title={"Verax Attestation Registry"} />} />
            <Route path="/tutorials" element={<Tutorials title={"Verax | Tutorials"} />} />
          </Routes>
        </div>
        <footer>
          <Footer />
        </footer>
      </HashRouter>
    </div>
  );
}

export default App;

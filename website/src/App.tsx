import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
import SDKDemo from "./pages/SDKDemo.tsx";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";

function App() {
  return (
    <HashRouter>
      <header>
        <Navbar />
      </header>
      <Routes>
        <Route path="*" element={<Home title={"Verax Attestation Registry"} />} />
        <Route path="/sdk-demo" element={<SDKDemo title={"Verax | SDK Demo"} />} />
      </Routes>
      <footer>
        <Footer />
      </footer>
    </HashRouter>
  );
}

export default App;

import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import Home from "./pages/Home.tsx";

function App() {
  return (
    <div className={"global-container"}>
      <HashRouter>
        <header>
          <Navbar />
        </header>
        <div className={"global-body"}>
          <Routes>
            <Route path="*" element={<Home title={"Verax | Home"} />} />
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

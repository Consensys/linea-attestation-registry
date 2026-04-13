import Footer from "./components/Footer.tsx";
import Navbar from "./components/Navbar.tsx";
import Home from "./pages/Home.tsx";
import "./App.css";

const App = () => {
  return (
    <div className={"global-container"}>
      <header>
        <Navbar />
      </header>
      <div className={"global-body"}>
        <Home title={"Verax | Home"} />
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default App;

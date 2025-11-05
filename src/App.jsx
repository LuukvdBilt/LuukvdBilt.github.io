import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Lijst from "./pages/Lijst";
import Favorieten from "./pages/Favorieten"; // 🔥 nieuw
import { TeamProvider } from "./context/TeamContext";
import "./App.css";

function App() {
  return (
    <TeamProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lijst" element={<Lijst />} />
          <Route path="/favorieten" element={<Favorieten />} /> {/* 🔥 nieuw */}
        </Routes>
      </Router>
    </TeamProvider>
  );
}

export default App;

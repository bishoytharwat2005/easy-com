import { BrowserRouter, Routes, Route } from "react-router";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Translator from "./pages/Translator";
import SpeechToSign from "./pages/SpeechToSign";
import Learn from "./pages/Learn";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/translator"
          element={<Translator />}
        />

        <Route
          path="/speech-to-sign"
          element={<SpeechToSign />}
        />

        <Route path="/learn" element={<Learn />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
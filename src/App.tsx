import { Route, Routes } from "react-router";
import LoginFrom from "./components/LoginFrom";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginFrom />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;

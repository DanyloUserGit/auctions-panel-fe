import { Route, Routes } from "react-router";
import LoginFrom from "./components/LoginFrom";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginFrom />} />
    </Routes>
  );
}

export default App;

import "./App.css";
import ChatPages from "./pages/ChatPages";
import { Routes, Route } from "react-router";
import Generator from "./pages/Generator.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ChatPages />} />
        <Route path="/generator" element={<Generator />} />
      </Routes>
    </>
  );
}

export default App;

import "./App.css";
import ChatPages from "./pages/ChatPages";
import { Routes, Route } from "react-router";
import Generator from "./pages/Generator.tsx";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster theme="dark" position="bottom-center" richColors />
      <Routes>
        <Route path="/" element={<ChatPages />} />
        <Route path="/generator" element={<Generator />} />
      </Routes>
    </>
  );
}

export default App;

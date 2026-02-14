import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CaseDetails from "./pages/Casedetails";
import CreateCase from "./pages/Createcase";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/case/:caseId" element={<CaseDetails />} />
          <Route path="/create-case" element={<CreateCase />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

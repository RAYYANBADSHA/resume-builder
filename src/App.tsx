import { Routes, Route } from "react-router-dom";
import Home from "./routes/home";
import Auth from "./routes/auth";
import Upload from "./routes/upload";
import Resume from "./routes/resume";
import Wipe from "./routes/wipe";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} errorElement={<ErrorBoundary />} />
      <Route path="/auth" element={<Auth />} errorElement={<ErrorBoundary />} />
      <Route path="/upload" element={<Upload />} errorElement={<ErrorBoundary />} />
      <Route path="/resume/:id" element={<Resume />} errorElement={<ErrorBoundary />} />
      <Route path="/wipe" element={<Wipe />} errorElement={<ErrorBoundary />} />
      <Route path="*" element={<ErrorBoundary error={{ status: 404 }} />} />
    </Routes>
  );
}

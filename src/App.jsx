import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import RequestHub from "./pages/RequestHub";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import DRFForm from "./pages/DRFForm";
import RAForm from "./pages/RAForm";
import ExtensionForm from "./pages/ExtensionForm";
import PositionRegistry from "./pages/PositionRegistry";
import Placeholder from "./pages/Placeholder";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="requests" element={<RequestHub />} />

          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />

          <Route path="submit/financial/drf" element={<DRFForm />} />
          <Route path="submit/research/ra-application" element={<RAForm />} />
          <Route path="submit/research/extension" element={<ExtensionForm />} />

          <Route
            path="submit/registration/*"
            element={
              <Placeholder
                title="Registration Form"
                screenNumber={3}
              />
            }
          />
          <Route
            path="submit/research/completion"
            element={
              <Placeholder
                title="Research Completion"
                screenNumber={5}
              />
            }
          />
          <Route
            path="submit/research/progress"
            element={
              <Placeholder
                title="Progress Report"
                screenNumber={5}
              />
            }
          />
          <Route
            path="submit/financial/*"
            element={
              <Placeholder
                title="Financial Form"
                screenNumber={3}
              />
            }
          />

          <Route path="admin/positions" element={<PositionRegistry />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

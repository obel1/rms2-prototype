import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import RequestHub from "./pages/RequestHub";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import DRFForm from "./pages/DRFForm";
import RAForm from "./pages/RAForm";
import ExtensionForm from "./pages/ExtensionForm";
import RegistrationForm from "./pages/RegistrationForm";
import ProgressReport from "./pages/ProgressReport";
import CompletionForm from "./pages/CompletionForm";
import RAClaimForm from "./pages/RAClaimForm";
import PaymentClaimForm from "./pages/PaymentClaimForm";
import TRFForm from "./pages/TRFForm";
import IERIFClaimForm from "./pages/IERIFClaimForm";
import PositionRegistry from "./pages/PositionRegistry";
import Approvals from "./pages/Approvals";
import FinanceHandoff from "./pages/FinanceHandoff";
import ControlSheet from "./pages/ControlSheet";
import MyLetters from "./pages/MyLetters";
import Placeholder from "./pages/Placeholder";
import { RoleProvider } from "./state/RoleContext";
import { AuditProvider } from "./state/AuditContext";

export default function App() {
  return (
    <RoleProvider>
      <AuditProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />

              <Route path="requests" element={<RequestHub />} />
              <Route path="approvals" element={<Approvals />} />
              <Route path="finance/handoff" element={<FinanceHandoff />} />
              <Route path="finance/control-sheet" element={<ControlSheet />} />

              <Route path="projects" element={<Projects />} />
              <Route path="projects/:id" element={<ProjectDetail />} />
              <Route path="my-letters" element={<MyLetters />} />

              <Route path="submit/registration/pif" element={<RegistrationForm />} />

              <Route path="submit/research/ra-application" element={<RAForm />} />
              <Route path="submit/research/extension" element={<ExtensionForm />} />
              <Route path="submit/research/progress" element={<ProgressReport />} />
              <Route path="submit/research/completion" element={<CompletionForm />} />

              <Route path="submit/financial/drf" element={<DRFForm />} />
              <Route path="submit/financial/ra-claim" element={<RAClaimForm />} />
              <Route path="submit/financial/claim" element={<PaymentClaimForm />} />
              <Route path="submit/financial/trf" element={<TRFForm />} />
              <Route path="submit/financial/ierif" element={<IERIFClaimForm />} />

              <Route
                path="submit/*"
                element={<Placeholder title="Form" screenNumber={3} />}
              />

              <Route path="admin/positions" element={<PositionRegistry />} />
            </Route>
          </Routes>
        </HashRouter>
      </AuditProvider>
    </RoleProvider>
  );
}
